const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
process.chdir(path.resolve(__dirname, '../..'));
function load(file, mocks = {}) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    {
      exports,
      require(id) {
        if (id in mocks) return mocks[id];
        if (id.startsWith('@lib/'))
          return load(`src/lib/${id.slice(5)}.ts`, mocks);
        return require(id);
      },
    },
  );
  return exports;
}
function check() {
  const { mapStrapiLibraryEntryToCard: map } = load(
    'src/utils/library/mapStrapiLibraries.ts',
  );
  const book = (id, favorite = false, favoriteOrder = id) => ({
    id,
    attributes: {
      type: 'book',
      favorite,
      favoriteOrder,
      coverImage: { data: { attributes: { url: `/cover-${id}.jpg` } } },
    },
  });
  const entry = (objects, visibility = 'public') => ({
    id: 1,
    attributes: {
      favoritesVisibility: visibility,
      singleShelves: {
        data: [
          { attributes: { visibility: 'public', objects: { data: objects } } },
        ],
      },
    },
  });
  const ordinary = [book(1), book(2), book(3), book(4)];
  const starred = [
    book(5, true, 4),
    book(6, true, 3),
    book(7, true, 2),
    book(8, true, 1),
  ];
  const covers = item =>
    Array.from(map(item, 'https://cms.example').coverUrls).map(url =>
      url.split('/').pop(),
    );
  assert.deepEqual(covers(entry([...ordinary, ...starred])), [
    'cover-8.jpg',
    'cover-7.jpg',
    'cover-6.jpg',
    'cover-5.jpg',
  ]);
  for (const count of [0, 1, 3])
    assert.deepEqual(covers(entry([...ordinary, ...starred.slice(0, count)])), [
      'cover-1.jpg',
      'cover-2.jpg',
      'cover-3.jpg',
      'cover-4.jpg',
    ]);
  for (const visibility of ['private', undefined]) {
    const privateEntry = entry([...ordinary, ...starred]);
    privateEntry.attributes.favoritesVisibility = visibility;
    assert.equal(covers(privateEntry)[0], 'cover-1.jpg');
  }
  const hidden = entry(ordinary);
  hidden.attributes.singleShelves.data.push({
    attributes: { visibility: 'private', objects: { data: starred } },
  });
  assert.equal(covers(hidden)[0], 'cover-1.jpg');
  assert.equal(
    covers(
      entry([...ordinary, starred[0], starred[0], starred[1], starred[2]]),
    )[0],
    'cover-1.jpg',
  );
  const { editLibrarySchema } = load(
    'src/utils/library/schema/editLibrarySchema.ts',
  );
  for (const username of ['Wolf', 'W'.repeat(30)])
    assert(editLibrarySchema.safeParse({ username }).success);
  for (const username of ['abc', 'W'.repeat(31), 'a bc', 'ab/c', 'ab?c'])
    assert(!editLibrarySchema.safeParse({ username }).success);
  const cms =
    'docs/library-ai-shelf-cms/src/extensions/users-permissions/validators/userValidators.js';
  if (fs.existsSync(cms)) {
    const module = { exports: {} };
    vm.runInNewContext(fs.readFileSync(cms, 'utf8'), {
      module,
      require: () => ({}),
    });
    for (const username of ['Wolf', 'W'.repeat(30)])
      assert(!module.exports.validateInputs({ username }).username);
    for (const username of ['abc', 'W'.repeat(31), 'a bc', 'ab/c', 'ab?c'])
      assert(module.exports.validateInputs({ username }).username);
  }
  const css = require('sass')
    .renderSync({
      file: 'src/components/library/atoms/Loader/Loader.module.scss',
    })
    .css.toString();
  assert(css.includes('prefers-reduced-motion'));
  assert(css.includes('animation: none'));
  const loader = fs.readFileSync(
    'src/components/library/atoms/Loader/Loader.tsx',
    'utf8',
  );
  assert(loader.includes("Array.from('LIBRARY')"));
  assert(loader.includes('role="status"'));
  assert(!loader.includes('roots-realistic'));
}
let status = 'PASS';
try {
  check();
  console.log(
    'PASS: favorites threshold, privacy, ordering, username boundaries and loader styles',
  );
} catch (error) {
  status = 'FAIL';
  console.error(error);
  process.exitCode = 1;
}
fs.mkdirSync('docs/release-audits', { recursive: true });
fs.appendFileSync(
  'docs/release-audits/library-batch.jsonl',
  JSON.stringify({
    at: new Date().toISOString(),
    event: 'library-batch-check',
    status,
  }) + '\n',
);
