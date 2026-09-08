const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Carries the Library tag model onto the new shape after the CMS schema lands:
// tags become many-to-many with objects (a tag may label any number of them),
// gain their own sequence, and hang off a library rather than the platform.
//
// The old model allowed a tag exactly one object, so every carried link starts
// the tag's sequence at position 1. Read-only by default; a production apply
// needs the owner's word in --go, which is recorded in the journal.
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

function ctl(args) {
  return execFileSync('/data/bin/keepsimple-ctl', args, {
    encoding: 'utf8',
    timeout: 180000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function query(sql, extra = []) {
  const output = ctl(['cms', 'sql', target, sql, ...extra]);
  const line = output.split('\n').find(l => l.trim().startsWith('{'));
  if (!line) {
    throw new Error(`No JSON row returned. Raw output: ${output.trim()}`);
  }
  return JSON.parse(line);
}

const header = `\\pset format unaligned
\\t on
`;

// The new tables are created by Strapi when the schema rolls out. Their names
// follow the owning side of each relation, and the script refuses to guess:
// a missing table means the CMS deploy has not landed yet.
function inspect() {
  return query(`${header}SELECT jsonb_build_object(
  'newLinkTable', EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'tags_objects_links'
  ),
  'libraryLinkTable', EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'tags_library_links'
  ),
  'sequenceColumn', EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'tags_objects_links'
      AND column_name = 'object_order'
  ),
  'oldLinkTable', EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'tags_object_links'
  ),
  'nameStillGloballyUnique', EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'tags' AND indexdef ILIKE '%UNIQUE%'
      AND indexdef ILIKE '%(name)%'
  ),
  'tags', (SELECT count(*) FROM tags),
  'oldLinks', (
    SELECT CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'tags_object_links'
    ) THEN (SELECT count(*) FROM tags_object_links) ELSE 0 END
  ),
  'newLinks', (
    SELECT CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'tags_objects_links'
    ) THEN (SELECT count(*) FROM tags_objects_links) ELSE 0 END
  ),
  'tagsWithLibrary', (
    SELECT CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'tags_library_links'
    ) THEN (SELECT count(DISTINCT tag_id) FROM tags_library_links) ELSE 0 END
  ),
  'tagsWhoseOwnerHasALibrary', (
    SELECT count(DISTINCT t.id) FROM tags t
    JOIN tags_user_links tul ON tul.tag_id = t.id
    JOIN library_user_links lul ON lul.user_id = tul.user_id
  )
);`);
}

// Every statement is idempotent: carrying twice inserts nothing new, and the
// sequence is recomputed from the rows that are actually there.
const APPLY_SQL = `BEGIN;

INSERT INTO tags_objects_links (tag_id, object_id, tag_order, object_order)
SELECT old.tag_id,
       old.object_id,
       COALESCE(old.tag_order, 1),
       row_number() OVER (PARTITION BY old.tag_id ORDER BY old.object_id)
FROM tags_object_links old
JOIN objects o ON o.id = old.object_id
-- Tags label books. Any older link to a video or an audio is left behind
-- rather than carried into a model that has no place to draw it.
WHERE o.type = 'book'
  AND NOT EXISTS (
    SELECT 1 FROM tags_objects_links n
    WHERE n.tag_id = old.tag_id AND n.object_id = old.object_id
  );

UPDATE tags_objects_links n
SET object_order = ranked.position
FROM (
  SELECT id, row_number() OVER (
    PARTITION BY tag_id ORDER BY object_order NULLS LAST, object_id
  ) AS position
  FROM tags_objects_links
) ranked
WHERE ranked.id = n.id
  AND (n.object_order IS DISTINCT FROM ranked.position);

INSERT INTO tags_library_links (tag_id, library_id)
SELECT tul.tag_id, lul.library_id
FROM tags_user_links tul
JOIN library_user_links lul ON lul.user_id = tul.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM tags_library_links existing WHERE existing.tag_id = tul.tag_id
);

COMMIT;`;

// Strapi does not always drop an index it no longer declares, and a leftover
// global unique on the name would keep two libraries from both using a word.
function dropLeftoverNameIndex(approval) {
  const found = query(`${header}SELECT jsonb_build_object('name', (
  SELECT indexname FROM pg_indexes
  WHERE tablename = 'tags' AND indexdef ILIKE '%UNIQUE%'
    AND indexdef ILIKE '%(name)%'
  LIMIT 1
));`);
  if (!found.name) return null;
  ctl([
    'cms',
    'sql',
    target,
    `ALTER TABLE tags DROP CONSTRAINT IF EXISTS "${found.name}";
DROP INDEX IF EXISTS "${found.name}";`,
    ...approval,
  ]);
  return found.name;
}

try {
  if (!['prod', 'staging'].includes(target)) {
    throw new Error('Expected prod or staging.');
  }
  if (!['--check', '--apply'].includes(mode)) {
    throw new Error('Expected --check or --apply.');
  }
  const needsGo = mode === '--apply' && target === 'prod';
  if (
    needsGo
      ? options.length !== 2 || options[0] !== '--go' || !options[1].trim()
      : options.length !== 0
  ) {
    throw new Error('Production apply requires --go with owner approval.');
  }

  const before = inspect();
  record.before = before;

  if (!before.newLinkTable || !before.libraryLinkTable) {
    throw new Error(
      'The CMS tag schema has not rolled out here yet: no new link tables.',
    );
  }
  if (!before.sequenceColumn) {
    throw new Error(
      'The tag sequence column is missing; the relation did not land as many-to-many.',
    );
  }

  if (mode === '--apply') {
    const approval = needsGo ? options : ['--write'];
    ctl(['cms', 'sql', target, APPLY_SQL, ...approval]);
    record.droppedIndex = dropLeftoverNameIndex(approval);
  }

  const after = mode === '--apply' ? inspect() : before;
  record.after = after;

  if (mode === '--apply') {
    if (after.newLinks < before.oldLinks) {
      throw new Error('Carried fewer links than the old model held.');
    }
    if (after.tagsWithLibrary < after.tagsWhoseOwnerHasALibrary) {
      throw new Error('Some tags whose owner has a library were left unlinked.');
    }
    if (after.nameStillGloballyUnique) {
      throw new Error('The global unique index on the tag name is still there.');
    }
  }

  record.outcome = 'passed';
  console.log(
    'LIBRARY_TAG_MODEL_PASS',
    target,
    JSON.stringify({
      links: after.newLinks,
      tagsWithLibrary: after.tagsWithLibrary,
      nameGloballyUnique: after.nameStillGloballyUnique,
    }),
  );
} catch (error) {
  record.error = error.message;
  console.error('LIBRARY_TAG_MODEL_FAIL', error.message);
  process.exitCode = 1;
} finally {
  fs.mkdirSync(path.dirname(journal), { recursive: true });
  fs.appendFileSync(journal, JSON.stringify(record) + '\n', { mode: 0o600 });
}
