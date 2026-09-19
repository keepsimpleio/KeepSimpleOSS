const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Gives every existing tag the address it would be given today.
//
// Tags created before 2026-09-09 carry a slug with a timestamp on the end
// (`deep-work-1757367482913`), because the field was unique across every
// library on the platform and the browser had to dodge the collision itself.
// The CMS now derives the slug from the name and keeps it unique inside its
// own library, and the library page addresses a filter by it: `#deep-work`.
// The old ones would put the timestamp in a link a reader is meant to read.
//
//   node scripts/release/library-tag-slug-backfill.cjs staging --check
//   node scripts/release/library-tag-slug-backfill.cjs staging --apply
//   node scripts/release/library-tag-slug-backfill.cjs prod --apply --go "<owner approval>"
//
// Read-only by default. It never touches a name, a colour, a book or a
// sequence: one column, on rows whose address is not already the right one.
const [target, mode = '--check', ...options] = process.argv.slice(2);
const journal = path.resolve(
  __dirname,
  '../../docs/release-staging/library-tag-model.journal.jsonl',
);
const record = {
  at: new Date().toISOString(),
  mechanism: 'library.tagSlug.backfill',
  target,
  mode,
  outcome: 'failed',
};

const FIELD = '~@~';

// The same transliteration the CMS applies (src/api/tag/utils/slug.js). Kept
// in step by hand: the two repositories cannot share a module, so a change to
// one is a change to both.
const CYRILLIC = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  і: 'i',
  ї: 'i',
  є: 'e',
  ґ: 'g',
  ў: 'u',
};

const slugify = name =>
  Array.from(String(name).toLowerCase())
    .map(char => (char in CYRILLIC ? CYRILLIC[char] : char))
    .join('')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

function ctl(args) {
  return execFileSync('/data/bin/keepsimple-ctl', args, {
    encoding: 'utf8',
    timeout: 180000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function rows(sql, approval = []) {
  const output = ctl([
    'cms',
    'sql',
    target,
    ...approval,
    `\\pset format unaligned\n\\pset fieldsep '${FIELD}'\n\\t on\n${sql}`,
  ]);
  return output
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.includes(FIELD))
    .map(line => line.split(FIELD));
}

// The address each tag should hold: its name in Latin letters, unique inside
// its own library. Settled in id order, so the oldest tag keeps the plain word,
// a later namesake takes the suffix, and two runs of this agree.
function plan() {
  const read = rows(
    `SELECT t.id, COALESCE(l.library_id, 0), t.slug, t.name
       FROM tags t
       LEFT JOIN tags_library_links l ON l.tag_id = t.id
      ORDER BY 2, 1;`,
  );

  const taken = new Map();
  const changes = [];

  for (const [rawId, rawLibrary, slug, name] of read) {
    const id = Number(rawId);
    const library = rawLibrary;
    if (!taken.has(library)) taken.set(library, new Set());
    const held = taken.get(library);

    const base = slugify(name) || 'tag';
    let wanted = base;
    for (let suffix = 2; held.has(wanted); suffix += 1) {
      wanted = `${base}-${suffix}`;
    }
    held.add(wanted);

    if (wanted !== slug) {
      changes.push({
        id,
        library: Number(library),
        name,
        from: slug,
        to: wanted,
      });
    }
  }

  return { total: read.length, changes };
}

try {
  if (!['prod', 'staging'].includes(target)) {
    throw new Error('Expected prod or staging.');
  }
  if (!['--check', '--apply'].includes(mode)) {
    throw new Error('Expected --check or --apply.');
  }
  const writing = mode === '--apply';
  const needsGo = writing && target === 'prod';
  if (
    needsGo
      ? options.length !== 2 || options[0] !== '--go' || !options[1].trim()
      : options.length !== 0
  ) {
    throw new Error('A production write requires --go with owner approval.');
  }
  const approval = needsGo ? options : ['--write'];
  if (needsGo) record.go = options[1];

  const before = plan();
  record.tags = before.total;
  record.changes = before.changes;

  if (!writing) {
    record.outcome = 'passed';
    console.log(
      'LIBRARY_TAG_SLUG_CHECK',
      target,
      JSON.stringify({ tags: before.total, toRewrite: before.changes.length }),
    );
    for (const change of before.changes) {
      console.log(`  ${change.id}  ${change.from}  ->  ${change.to}`);
    }
  } else if (before.changes.length === 0) {
    record.outcome = 'passed';
    console.log('LIBRARY_TAG_SLUG_PASS', target, '{"toRewrite":0}');
  } else {
    const updates = before.changes
      .map(
        change =>
          `UPDATE tags SET slug = '${change.to.replace(/'/g, "''")}' WHERE id = ${change.id};`,
      )
      .join('\n');
    ctl(['cms', 'sql', target, ...approval, `BEGIN;\n${updates}\nCOMMIT;`]);

    const after = plan();
    record.after = { toRewrite: after.changes.length };
    if (after.changes.length !== 0) {
      throw new Error('Some addresses are still not the ones they should be.');
    }
    record.outcome = 'passed';
    console.log(
      'LIBRARY_TAG_SLUG_PASS',
      target,
      JSON.stringify({ rewritten: before.changes.length }),
    );
  }
} catch (error) {
  record.error = error.message;
  console.error('LIBRARY_TAG_SLUG_FAIL', target, error.message);
} finally {
  try {
    fs.mkdirSync(path.dirname(journal), { recursive: true });
    fs.appendFileSync(journal, `${JSON.stringify(record)}\n`);
  } catch (error) {
    console.error('journal write failed:', error.message);
  }
  process.exit(record.outcome === 'passed' ? 0 : 1);
}
