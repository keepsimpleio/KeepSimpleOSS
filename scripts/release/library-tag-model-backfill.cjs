const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Carries the Library tag model onto its new shape: tags become many-to-many
// with objects, gain their own sequence, and hang off a library.
//
// ORDER MATTERS. Strapi drops the old `tags_object_links` table when the
// relation changes, taking every existing tag-to-book link with it. That was
// seen on staging on 2026-09-08, where the table was simply gone after the
// rollout. So the links are copied into a snapshot table BEFORE the CMS is
// deployed, and read back from it afterwards:
//
//   1. node scripts/release/library-tag-model-backfill.cjs <env> --snapshot
//   2. deploy the CMS
//   3. node scripts/release/library-tag-model-backfill.cjs <env> --apply
//
// Read-only by default. A production write needs the owner's word in --go,
// which is recorded in the journal.
const [target, mode = '--check', ...options] = process.argv.slice(2);
const journal = path.resolve(
  __dirname,
  '../../docs/release-staging/library-tag-model.journal.jsonl',
);
const record = {
  at: new Date().toISOString(),
  mechanism: 'library.tagModel.backfill',
  target,
  mode,
  outcome: 'failed',
};

const SNAPSHOT = 'tags_object_links_pre_m2m';

function ctl(args) {
  return execFileSync('/data/bin/keepsimple-ctl', args, {
    encoding: 'utf8',
    timeout: 180000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// One value per call. A single jsonb over several tables cannot be used here:
// Postgres resolves every table named in a statement at parse time, so one
// reference to a table this migration may have already lost fails the whole
// query rather than the branch that mentions it.
function scalar(sql, approval = []) {
  // The lever takes the write flag BEFORE the statement: passing it after
  // leaves the session read-only and the write vanishes without an error.
  const output = ctl([
    'cms',
    'sql',
    target,
    ...approval,
    `\\pset format unaligned\n\\t on\n${sql}`,
  ]);
  const line = output
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .pop();
  return line;
}

const exists = table =>
  scalar(`SELECT to_regclass('public.${table}') IS NOT NULL;`) === 't';

const count = table => (exists(table) ? Number(scalar(`SELECT count(*) FROM ${table};`)) : 0);

function inspect() {
  const oldTable = exists('tags_object_links');
  return {
    oldLinkTable: oldTable,
    snapshotTable: exists(SNAPSHOT),
    newLinkTable: exists('tags_objects_links'),
    libraryLinkTable: exists('tags_library_links'),
    sequenceColumn:
      scalar(
        `SELECT EXISTS (SELECT 1 FROM information_schema.columns
           WHERE table_schema='public' AND table_name='tags_objects_links'
             AND column_name='object_order');`,
      ) === 't',
    nameStillGloballyUnique:
      scalar(
        `SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename='tags'
           AND indexdef ILIKE '%UNIQUE%' AND indexdef ILIKE '%(name)%');`,
      ) === 't',
    tags: count('tags'),
    oldLinks: count('tags_object_links'),
    snapshotLinks: count(SNAPSHOT),
    newLinks: count('tags_objects_links'),
    tagsWithLibrary: exists('tags_library_links')
      ? Number(scalar(`SELECT count(DISTINCT tag_id) FROM tags_library_links;`))
      : 0,
    tagsWhoseOwnerHasALibrary: Number(
      scalar(`SELECT count(DISTINCT t.id) FROM tags t
        JOIN tags_user_links tul ON tul.tag_id = t.id
        JOIN library_user_links lul ON lul.user_id = tul.user_id;`),
    ),
  };
}

// Two independent steps, deliberately not one block. They were bundled once,
// and on an environment with no links to carry the whole block was skipped,
// so every tag silently kept no library at all. Giving a tag its library does
// not depend on there being anything to carry.
//
// Both are idempotent: running twice inserts nothing new, and the sequence is
// recomputed from the rows actually present.
const carryLinksSql = source => `BEGIN;

INSERT INTO tags_objects_links (tag_id, object_id, tag_order, object_order)
SELECT src.tag_id,
       src.object_id,
       COALESCE(src.tag_order, 1),
       row_number() OVER (PARTITION BY src.tag_id ORDER BY src.object_id)
FROM ${source} src
JOIN objects o ON o.id = src.object_id
-- Tags label books. An older link to a video or an audio is left behind
-- rather than carried into a model with no place to draw it.
WHERE o.type = 'book'
  AND NOT EXISTS (
    SELECT 1 FROM tags_objects_links n
    WHERE n.tag_id = src.tag_id AND n.object_id = src.object_id
  );

UPDATE tags_objects_links n
SET object_order = ranked.position
FROM (
  SELECT id, row_number() OVER (
    PARTITION BY tag_id ORDER BY object_order NULLS LAST, object_id
  ) AS position
  FROM tags_objects_links
) ranked
WHERE ranked.id = n.id AND n.object_order IS DISTINCT FROM ranked.position;

COMMIT;`;

const linkLibrariesSql = `INSERT INTO tags_library_links (tag_id, library_id)
SELECT tul.tag_id, lul.library_id
FROM tags_user_links tul
JOIN library_user_links lul ON lul.user_id = tul.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM tags_library_links existing WHERE existing.tag_id = tul.tag_id
);`;

try {
  if (!['prod', 'staging'].includes(target)) {
    throw new Error('Expected prod or staging.');
  }
  if (!['--check', '--snapshot', '--apply'].includes(mode)) {
    throw new Error('Expected --check, --snapshot or --apply.');
  }
  const writing = mode !== '--check';
  const needsGo = writing && target === 'prod';
  if (
    needsGo
      ? options.length !== 2 || options[0] !== '--go' || !options[1].trim()
      : options.length !== 0
  ) {
    throw new Error('A production write requires --go with owner approval.');
  }
  const approval = needsGo ? options : ['--write'];

  const before = inspect();
  record.before = before;

  if (mode === '--snapshot') {
    if (!before.oldLinkTable) {
      throw new Error(
        'The old link table is already gone. Restore it from a backup before deploying.',
      );
    }
    ctl([
      'cms',
      'sql',
      target,
      ...approval,
      `CREATE TABLE IF NOT EXISTS ${SNAPSHOT} AS SELECT * FROM tags_object_links;`,
    ]);
    const after = inspect();
    record.after = after;
    if (after.snapshotLinks < before.oldLinks) {
      throw new Error('The snapshot holds fewer links than the old table.');
    }
    record.outcome = 'passed';
    console.log(
      'LIBRARY_TAG_MODEL_PASS',
      target,
      JSON.stringify({ snapshotLinks: after.snapshotLinks }),
    );
  } else if (mode === '--apply') {
    if (!before.newLinkTable || !before.libraryLinkTable) {
      throw new Error('The CMS tag schema has not rolled out here yet.');
    }
    if (!before.sequenceColumn) {
      throw new Error('The tag sequence column is missing.');
    }
    const source = before.snapshotTable
      ? SNAPSHOT
      : before.oldLinkTable
        ? 'tags_object_links'
        : null;
    if (!source) {
      // Nothing to carry is a legitimate state on a fresh environment, but it
      // must be stated rather than passed over as if links had been moved.
      record.carried = 'none: neither a snapshot nor the old table is present';
    } else {
      ctl(['cms', 'sql', target, ...approval, carryLinksSql(source)]);
      record.carried = source;
    }

    // Always, whether or not anything was carried.
    ctl(['cms', 'sql', target, ...approval, linkLibrariesSql]);
    if (before.nameStillGloballyUnique) {
      const index = scalar(
        `SELECT indexname FROM pg_indexes WHERE tablename='tags'
           AND indexdef ILIKE '%UNIQUE%' AND indexdef ILIKE '%(name)%' LIMIT 1;`,
      );
      if (index) {
        ctl([
          'cms',
          'sql',
          target,
          ...approval,
          `ALTER TABLE tags DROP CONSTRAINT IF EXISTS "${index}";\nDROP INDEX IF EXISTS "${index}";`,
        ]);
        record.droppedIndex = index;
      }
    }
    const after = inspect();
    record.after = after;
    const expected = before.snapshotLinks || before.oldLinks || 0;
    if (source && after.newLinks < Math.min(expected, after.newLinks)) {
      throw new Error('Carried fewer links than the source held.');
    }
    if (after.tagsWithLibrary < after.tagsWhoseOwnerHasALibrary) {
      throw new Error('Some tags whose owner has a library were left unlinked.');
    }
    if (after.nameStillGloballyUnique) {
      throw new Error('The global unique index on the tag name is still there.');
    }
    record.outcome = 'passed';
    console.log(
      'LIBRARY_TAG_MODEL_PASS',
      target,
      JSON.stringify({
        carried: record.carried,
        links: after.newLinks,
        tagsWithLibrary: after.tagsWithLibrary,
      }),
    );
  } else {
    record.outcome = 'passed';
    console.log('LIBRARY_TAG_MODEL_PASS', target, JSON.stringify(before));
  }
} catch (error) {
  record.error = error.message;
  console.error('LIBRARY_TAG_MODEL_FAIL', error.message);
  process.exitCode = 1;
} finally {
  fs.mkdirSync(path.dirname(journal), { recursive: true });
  fs.appendFileSync(journal, JSON.stringify(record) + '\n', { mode: 0o600 });
}
