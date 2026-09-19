#!/usr/bin/env node
/**
 * Mirror Wolf's production library onto the staging CMS (the CMS behind the
 * DEV preview), from the read-only production snapshot in backups/.
 *
 *   node scripts/release/library-staging-mirror.cjs            # plan only
 *   node scripts/release/library-staging-mirror.cjs --apply    # write staging
 *
 * Additive and idempotent: shelves are matched by name, books by slug, covers
 * by the production file hash. Nothing on staging is deleted; a book or shelf
 * that exists only on staging stays. Objects and links go in through
 * `keepsimple-ctl cms sql staging --write`; cover files go in through the
 * staging upload API (the only way a binary reaches the container) and are
 * then linked to their book by SQL. Every run appends one line to
 * docs/release-staging/library-staging-mirror.journal.jsonl (private).
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const CTL = '/data/bin/keepsimple-ctl';
const HOST = 'staging';
const CMS = 'https://staging-strapi.keepsimple.io';
const OWNER_USERNAME = 'wolf';
const SQL_BATCH_BYTES = 90 * 1024; // one lever argument, under the 128 KiB cap
const journal = path.resolve(
  __dirname,
  '../../docs/release-staging/library-staging-mirror.journal.jsonl',
);

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const backupDir = path.resolve(
  args[args.indexOf('--backup') + 1] && args.includes('--backup')
    ? args[args.indexOf('--backup') + 1]
    : path.join(__dirname, '../../backups/library-wolf-20260909'),
);
const sessionFile = path.resolve(__dirname, '../../.dev-session.json');

function ctl(ctlArgs, input) {
  return execFileSync(CTL, ctlArgs, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
    input,
  });
}

function sqlRead(inner) {
  const out = ctl([
    'cms',
    'sql',
    HOST,
    `\\t on\n\\a\nselect json_agg(t) from (${inner}) t;`,
  ]);
  const text = out
    .split('\n')
    .filter(line => !/^\s*$/.test(line) && !/^(BEGIN|COMMIT)$/.test(line))
    .join('\n')
    .trim();
  if (!text || text === 'null') return [];
  return JSON.parse(text);
}

function sqlWrite(statements) {
  const sql = `BEGIN;\n${statements.join('\n')}\nCOMMIT;`;
  if (Buffer.byteLength(sql) > 127 * 1024) {
    throw new Error(`SQL batch too large: ${Buffer.byteLength(sql)} bytes`);
  }
  const out = ctl(['cms', 'sql', HOST, '--write', sql]);
  if (/ERROR/.test(out)) throw new Error(out);
  return out;
}

const TAG = '$ksm$';
function lit(value) {
  if (value == null) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  const s = String(value);
  if (s.includes(TAG)) throw new Error('value contains the quote tag');
  return `${TAG}${s}${TAG}`;
}
const ts = value => (value == null ? 'NULL' : `${lit(value)}::timestamp`);
const date = value => (value == null ? 'NULL' : `${lit(value)}::date`);

function batches(statements) {
  const groups = [];
  let current = [];
  let size = 0;
  for (const s of statements) {
    const bytes = Buffer.byteLength(s) + 1;
    if (size + bytes > SQL_BATCH_BYTES && current.length) {
      groups.push(current);
      current = [];
      size = 0;
    }
    current.push(s);
    size += bytes;
  }
  if (current.length) groups.push(current);
  return groups;
}

function log(record) {
  fs.mkdirSync(path.dirname(journal), { recursive: true });
  fs.appendFileSync(
    journal,
    JSON.stringify({ at: new Date().toISOString(), host: HOST, ...record }) +
      '\n',
    { mode: 0o600 },
  );
}

async function uploadCover(jwt, filePath, fileName, mime) {
  const form = new FormData();
  form.append(
    'files',
    new Blob([fs.readFileSync(filePath)], { type: mime }),
    fileName,
  );
  const res = await fetch(`${CMS}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`upload ${fileName}: HTTP ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  const file = Array.isArray(body) ? body[0] : body;
  if (!file?.id) throw new Error(`upload ${fileName}: no file id in answer`);
  return file;
}

async function main() {
  const started = Date.now();
  const snapshot = JSON.parse(
    fs.readFileSync(path.join(backupDir, 'library-wolf.json'), 'utf8'),
  );
  const prodBooks = snapshot.shelves.flatMap(shelf =>
    shelf.objects.map(o => ({ ...o, shelfName: shelf.name })),
  );

  // Who and where on staging.
  const [owner] = sqlRead(
    `select u.id, u.username, lu.library_id from up_users u
       join library_user_links lu on lu.user_id = u.id
      where lower(u.username) = ${lit(OWNER_USERNAME)}`,
  );
  if (!owner) throw new Error(`no library for ${OWNER_USERNAME} on staging`);
  const libraryId = owner.library_id;
  const userId = owner.id;

  const readShelves = () =>
    sqlRead(
      `select s.id, s.name, s.visibility, s."order"
         from single_shelves s
         join single_shelves_library_links sl on sl.single_shelf_id = s.id
        where sl.library_id = ${libraryId}`,
    );
  const readBooks = () =>
    sqlRead(
      `select o.id, o.slug, o.title, sh.single_shelf_id as shelf_id,
              f.url as cover_url
         from objects o
         join objects_shelf_links sh on sh.object_id = o.id
         join single_shelves_library_links sl on sl.single_shelf_id = sh.single_shelf_id
         left join files_related_morphs m on m.related_id = o.id
              and m.related_type = 'api::object.object' and m.field = 'coverImage'
         left join files f on f.id = m.file_id
        where sl.library_id = ${libraryId}`,
    );

  let shelves = readShelves();
  let books = readBooks();
  const byName = name => shelves.find(s => s.name.toLowerCase() === name.toLowerCase());
  const bySlug = new Map(books.map(b => [b.slug, b]));

  // Shelves: production order first, staging-only shelves after it.
  const shelfPlan = snapshot.shelves.map(shelf => ({
    shelf,
    existing: byName(shelf.name) ?? null,
  }));
  const extraShelves = shelves.filter(
    s => !snapshot.shelves.some(p => p.name.toLowerCase() === s.name.toLowerCase()),
  );

  const bookPlan = prodBooks.map(book => ({
    book,
    existing: bySlug.get(book.slug) ?? null,
  }));
  const coverNeeded = plan =>
    !plan.existing?.cover_url ||
    !plan.existing.cover_url.includes(plan.book.cover.hash);

  const summary = {
    libraryId,
    userId,
    shelvesCreate: shelfPlan.filter(p => !p.existing).map(p => p.shelf.name),
    shelvesUpdate: shelfPlan.filter(p => p.existing).map(p => p.shelf.name),
    shelvesStagingOnly: extraShelves.map(s => s.name),
    booksInsert: bookPlan.filter(p => !p.existing).length,
    booksUpdate: bookPlan.filter(p => p.existing).length,
    coversUpload: bookPlan.filter(coverNeeded).length,
    booksStagingOnly: books.filter(
      b => !prodBooks.some(p => p.slug === b.slug),
    ).length,
  };
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'plan', ...summary }, null, 2));
  if (!apply) {
    log({ mode: 'plan', ...summary, ms: Date.now() - started });
    return;
  }

  const jwt = JSON.parse(fs.readFileSync(sessionFile, 'utf8')).jwt;
  if (!jwt) throw new Error('no staging session token for cover uploads');

  // 1. Shelves.
  const shelfSql = [];
  for (const { shelf, existing } of shelfPlan) {
    if (existing) {
      shelfSql.push(
        `update single_shelves set visibility=${lit(shelf.visibility)}, "order"=${shelf.order}, updated_at=now() where id=${existing.id};`,
        `update single_shelves_library_links set single_shelf_order=${shelf.order + 1} where single_shelf_id=${existing.id} and library_id=${libraryId};`,
      );
    } else {
      shelfSql.push(
        `with s as (insert into single_shelves (name, visibility, type, "order", created_at, updated_at)
           values (${lit(shelf.name)}, ${lit(shelf.visibility)}, ${lit(shelf.type)}, ${shelf.order}, ${ts(shelf.createdAt)}, ${ts(shelf.updatedAt)}) returning id),
         l as (insert into single_shelves_library_links (single_shelf_id, library_id, single_shelf_order) select id, ${libraryId}, ${shelf.order + 1} from s)
         insert into single_shelves_owner_links (single_shelf_id, user_id) select id, ${userId} from s;`,
      );
    }
  }
  extraShelves.forEach((s, i) => {
    const order = snapshot.shelves.length + i;
    shelfSql.push(
      `update single_shelves set "order"=${order}, updated_at=now() where id=${s.id};`,
      `update single_shelves_library_links set single_shelf_order=${order + 1} where single_shelf_id=${s.id} and library_id=${libraryId};`,
    );
  });
  sqlWrite(shelfSql);
  shelves = readShelves();
  const shelfIdByName = new Map(shelves.map(s => [s.name.toLowerCase(), s.id]));

  // 2. Books.
  const [{ next_owner_order: ownerOrderStart }] = sqlRead(
    `select coalesce(max(object_order), 0) + 1 as next_owner_order from objects_owner_links where user_id = ${userId}`,
  );
  let ownerOrder = ownerOrderStart;
  const bookSql = [];
  for (const { book, existing } of bookPlan) {
    const shelfId = shelfIdByName.get(book.shelfName.toLowerCase());
    if (!shelfId) throw new Error(`shelf ${book.shelfName} missing after shelf step`);
    const fields = {
      type: lit(book.type),
      title: lit(book.title),
      description: lit(book.description),
      author: lit(book.author),
      source_url: lit(book.sourceUrl),
      publication_date: date(book.publicationDate),
      shelf_name: lit(book.shelfName),
      source: lit(book.source),
      duration: lit(book.duration),
      slug: lit(book.slug),
      created_at: ts(book.createdAt),
      updated_at: ts(book.updatedAt),
      overall: lit(book.overallRating),
      difficulty: lit(book.difficulty),
      '"order"': lit(book.orderOnShelf),
      favorite: lit(book.favorite),
      favorited_at: ts(book.favoritedAt),
      favorite_order: lit(book.favoriteOrder),
    };
    if (existing) {
      const sets = Object.entries(fields)
        .filter(([k]) => k !== 'slug' && k !== 'created_at')
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      bookSql.push(
        `update objects set ${sets} where id=${existing.id};`,
        `update objects_shelf_links set single_shelf_id=${shelfId}, object_order=${book.orderOnShelf + 1} where object_id=${existing.id};`,
      );
    } else {
      bookSql.push(
        `with o as (insert into objects (${Object.keys(fields).join(', ')}) values (${Object.values(fields).join(', ')}) returning id),
         w as (insert into objects_owner_links (object_id, user_id, object_order) select id, ${userId}, ${ownerOrder++} from o)
         insert into objects_shelf_links (object_id, single_shelf_id, object_order) select id, ${shelfId}, ${book.orderOnShelf + 1} from o;`,
      );
    }
  }
  for (const group of batches(bookSql)) sqlWrite(group);
  books = readBooks();
  const idBySlug = new Map(books.map(b => [b.slug, b]));

  // 3. Covers: upload what staging does not already hold, then link.
  let uploaded = 0;
  const morphSql = [];
  for (const plan of bookPlan) {
    const staged = idBySlug.get(plan.book.slug);
    if (!staged) throw new Error(`book ${plan.book.slug} missing after book step`);
    if (staged.cover_url && staged.cover_url.includes(plan.book.cover.hash)) continue;
    const cover = plan.book.cover;
    const filePath = path.join(backupDir, 'covers', `${plan.book.id}${cover.ext}`);
    // Named by the production hash so a re-run recognises it in the URL.
    const file = await uploadCover(jwt, filePath, `${cover.hash}${cover.ext}`, cover.mime);
    uploaded += 1;
    morphSql.push(
      `delete from files_related_morphs where related_id=${staged.id} and related_type='api::object.object' and field='coverImage';`,
      `insert into files_related_morphs (file_id, related_id, related_type, field, "order") values (${file.id}, ${staged.id}, 'api::object.object', 'coverImage', 1);`,
    );
    if (morphSql.length >= 40) {
      sqlWrite(morphSql.splice(0));
    }
  }
  if (morphSql.length) sqlWrite(morphSql);

  // 4. The library's own words and preferences.
  sqlWrite([
    `update library set about_me=${lit(snapshot.library.aboutMe)}, favorites_visibility=${lit(snapshot.library.favoritesVisibility)}, ai_shelf_collapsed=${lit(snapshot.library.aiShelfCollapsed)}, updated_at=now() where id=${libraryId};`,
  ]);

  // 5. What a visitor now sees.
  const res = await fetch(
    `${CMS}/api/libraries/${libraryId}?populate[singleShelves][populate][objects][populate][coverImage]=true`,
  );
  const view = await res.json();
  const seenShelves = view.data.attributes.singleShelves.data;
  const seen = seenShelves.flatMap(s => s.attributes.objects.data);
  const seenSlugs = new Set(seen.map(o => o.attributes.slug));
  const missing = prodBooks.filter(b => !seenSlugs.has(b.slug)).map(b => b.slug);
  const withoutCover = seen.filter(o => !o.attributes.coverImage?.data).length;
  const result = {
    mode: 'apply',
    ...summary,
    uploaded,
    verify: {
      http: res.status,
      shelves: seenShelves.length,
      books: seen.length,
      prodBooksMissing: missing,
      booksWithoutCover: withoutCover,
    },
    ms: Date.now() - started,
  };
  console.log(JSON.stringify(result, null, 2));
  log(result);
  if (missing.length || withoutCover) process.exitCode = 1;
}

main().catch(err => {
  console.error(err.message || err);
  log({ mode: apply ? 'apply' : 'plan', outcome: 'failed', error: String(err.message || err) });
  process.exit(1);
});
