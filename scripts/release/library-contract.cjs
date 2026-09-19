const assert = require('node:assert/strict');

const fields = {
  library: {
    ai_shelf_collapsed: 'boolean',
    favorites_visibility: 'character varying',
  },
  objects: {
    favorite: 'boolean',
    favorited_at: 'timestamp without time zone',
    favorite_order: 'integer',
  },
};
const protectedTables = [
  'library',
  'objects',
  'objects_owner_links',
  'objects_shelf_links',
  'objects_components',
  'single_shelves',
  'single_shelves_library_links',
  'library_user_links',
  'files',
  'files_related_morphs',
];
function validateDatabase(data, expectedCluster) {
  assert.equal(data.cluster, expectedCluster, 'Wrong database cluster');
  for (const [table, columns] of Object.entries(fields)) {
    for (const [name, type] of Object.entries(columns)) {
      assert.ok(
        data.columns.some(
          c =>
            c.table_name === table &&
            c.column_name === name &&
            c.data_type === type,
        ),
        `Missing/wrong CMS field: ${table}.${name}`,
      );
    }
  }
  assert.equal(data.isOwner, true, 'Selected account does not own the library');
  assert.equal(data.hasFlag, true, 'Actual owner lacks library-ai');
  assert.equal(data.canUpdate, true, 'Actual owner role lacks library.update');
  assert.equal(data.publicCanUpdate, false, 'Anonymous library writes enabled');
}
function validatePublic(data) {
  const a = data?.data?.attributes;
  assert.ok(a, 'Missing public library');
  assert.ok(
    ['private', 'public'].includes(a.favoritesVisibility),
    'CMS silently omitted favoritesVisibility',
  );
  assert.equal(
    Object.hasOwn(a, 'aiShelfCollapsed'),
    false,
    'Private preference leaked',
  );
  assert.ok(a.user?.data?.attributes?.username, 'Owner username omitted');
}
function compareSnapshots(before, after) {
  assert.equal(
    after.cluster,
    before.cluster,
    'Snapshot belongs to a different database',
  );
  assert.deepEqual(
    after.tables,
    before.tables,
    'Protected content changed. Inspect differences; never restore automatically.',
  );
}
module.exports = {
  fields,
  protectedTables,
  validateDatabase,
  validatePublic,
  compareSnapshots,
};
