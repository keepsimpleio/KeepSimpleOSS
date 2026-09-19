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
  // Favourites lead the row however few there are, and the rest of the row
  // is filled from the shelves behind them. The row used to fall back to the
  // first four covers unless there were four favourites, so a library with
  // one or two starred books showed none of them.
  assert.deepEqual(covers(entry([...ordinary])), [
    'cover-1.jpg',
    'cover-2.jpg',
    'cover-3.jpg',
    'cover-4.jpg',
  ]);
  assert.deepEqual(covers(entry([...ordinary, ...starred.slice(0, 1)])), [
    'cover-5.jpg',
    'cover-1.jpg',
    'cover-2.jpg',
    'cover-3.jpg',
  ]);
  assert.deepEqual(covers(entry([...ordinary, ...starred.slice(0, 3)])), [
    'cover-7.jpg',
    'cover-6.jpg',
    'cover-5.jpg',
    'cover-1.jpg',
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
  // One book starred twice is one favourite: it takes one place, not two.
  assert.deepEqual(
    covers(
      entry([...ordinary, starred[0], starred[0], starred[1], starred[2]]),
    ),
    ['cover-7.jpg', 'cover-6.jpg', 'cover-5.jpg', 'cover-1.jpg'],
  );
  // THE AI SHELF. The board is thirteen places: ten fit, three stretch, and
  // the stretch picks punctuate the row instead of standing at its end. A
  // locked pick holds the exact place it stood in, and a roll that comes back
  // short leaves a shorter row rather than a row with holes in it.
  const digestModule = load('src/lib/library/magic/digest.ts');
  const shelfMocks = {
    './digest': digestModule,
    './relay': {
      askRelay: async () => ({ text: '', slot: '', transport: '', model: '' }),
      parseJsonReply: () => ({}),
      RelayError: class RelayError extends Error {},
    },
    './verify': { verifyBook: async () => ({ book: null, errors: [] }) },
    '@lib/library/magic/relay': {
      askRelay: async () => ({ text: '', slot: '', transport: '', model: '' }),
      parseJsonReply: () => ({}),
      RelayError: class RelayError extends Error {},
    },
    '@lib/library/magic/verify': {
      verifyBook: async () => ({ book: null, errors: [] }),
    },
  };
  const {
    arrangeBoard,
    reachPercent,
    AI_SHELF_SIZE,
    AI_SHELF_STRETCH,
    AI_SHELF_FIT,
  } = load('src/lib/library/aishelf/engine.ts', shelfMocks);
  const pick = (kind, i) => ({
    id: `${kind}-${i}`,
    title: `${kind} ${i}`,
    kind,
  });
  const deal = (fit, stretch) => ({
    fit: Array.from({ length: fit }, (_, i) => pick('fit', i)),
    stretch: Array.from({ length: stretch }, (_, i) => pick('stretch', i)),
  });
  const fresh = arrangeBoard(
    Array.from({ length: AI_SHELF_SIZE }, () => null),
    deal(AI_SHELF_FIT, AI_SHELF_STRETCH),
  );
  assert.equal(fresh.length, AI_SHELF_SIZE);
  assert.equal(
    fresh.filter(p => p.kind === 'stretch').length,
    AI_SHELF_STRETCH,
  );
  assert.deepEqual(
    Array.from(
      fresh.map((p, i) => (p.kind === 'stretch' ? i : -1)).filter(i => i >= 0),
    ),
    [3, 7, 11],
  );
  const heldFit = { ...pick('fit', 'locked'), id: 'kept-fit' };
  const heldStretch = { ...pick('stretch', 'locked'), id: 'kept-stretch' };
  const keep = Array.from({ length: AI_SHELF_SIZE }, () => null);
  keep[0] = heldFit;
  keep[7] = heldStretch;
  const rolled = arrangeBoard(
    keep,
    deal(AI_SHELF_FIT - 1, AI_SHELF_STRETCH - 1),
  );
  assert.equal(rolled.length, AI_SHELF_SIZE);
  assert.equal(rolled[0].id, 'kept-fit');
  assert.equal(rolled[7].id, 'kept-stretch');
  assert.equal(
    rolled.filter(p => p.kind === 'stretch').length,
    AI_SHELF_STRETCH,
  );
  const short = arrangeBoard(
    Array.from({ length: AI_SHELF_SIZE }, () => null),
    deal(5, 1),
  );
  assert.equal(short.length, 6);
  assert(short.every(Boolean));
  // Reach is scored on its own weights and stays inside the shown range.
  const full = { theme: 5, notes: 5, tags: 5, difficulty: 5, distance: 5 };
  const none = { theme: 0, notes: 0, tags: 0, difficulty: 0, distance: 0 };
  const signals = { notes: true, tags: true, difficulty: true, lowRated: true };
  assert.equal(reachPercent(full, signals), 97);
  assert.equal(reachPercent(none, signals), 5);
  assert(
    reachPercent({ ...none, distance: 5, difficulty: 5 }, signals) >
      reachPercent({ ...none, theme: 5 }, signals),
  );

  const { createEditLibrarySchema, ABOUT_LIBRARY_MAX, ABOUT_AUTHOR_MAX } = load(
    'src/utils/library/schema/editLibrarySchema.ts',
  );
  const editLibrarySchema = createEditLibrarySchema();
  for (const username of ['Wolf', 'W'.repeat(30)])
    assert(editLibrarySchema.safeParse({ username }).success);
  for (const username of ['abc', 'W'.repeat(31), 'a bc', 'ab/c', 'ab?c'])
    assert(!editLibrarySchema.safeParse({ username }).success);
  // Passage caps: counted on the writing, and a passage left as it was saved
  // stays valid so a long legacy About cannot block an unrelated edit.
  assert.equal(ABOUT_LIBRARY_MAX, 1000);
  assert.equal(ABOUT_AUTHOR_MAX, 1000);
  const legacy = 'a'.repeat(1500);
  const marked = `<strong>${'a'.repeat(999)}</strong>`;
  assert(
    editLibrarySchema.safeParse({ username: 'Wolf', aboutLibrary: marked })
      .success,
  );
  assert(
    !editLibrarySchema.safeParse({ username: 'Wolf', aboutLibrary: legacy })
      .success,
  );
  const keeping = createEditLibrarySchema({ aboutLibrary: legacy });
  assert(keeping.safeParse({ username: 'Wolf', aboutLibrary: legacy }).success);
  assert(
    !keeping.safeParse({ username: 'Wolf', aboutLibrary: legacy + 'b' })
      .success,
  );
  // The editor rewrites legacy paragraphs into line breaks on focus alone;
  // same writing, so the passage still counts as untouched.
  const blocks = createEditLibrarySchema({
    aboutLibrary: `<p>${legacy}</p><p>${legacy}</p>`,
  });
  assert(
    blocks.safeParse({
      username: 'Wolf',
      aboutLibrary: `${legacy}<br />${legacy}`,
    }).success,
  );
  const cms =
    'docs/library-ai-shelf-cms/src/extensions/users-permissions/validators/userValidators.js';
  if (fs.existsSync(cms)) {
    // The CMS reads its username bounds from one enum since cms #416; the
    // frontend schema keeps its own floor (4), the stricter of the two, so
    // the CMS side is checked against its own bounds and the shared shape.
    const policy = require(
      path.resolve(
        'docs/library-ai-shelf-cms/src/extensions/enums/username-policy-enum.js',
      ),
    );
    const module = { exports: {} };
    vm.runInNewContext(fs.readFileSync(cms, 'utf8'), {
      module,
      require: id => (id.endsWith('username-policy-enum') ? policy : {}),
    });
    for (const username of [
      'Wolf',
      'W'.repeat(policy.USERNAME_MIN_LENGTH),
      'W'.repeat(policy.USERNAME_MAX_LENGTH),
    ])
      assert(!module.exports.validateInputs({ username }).username);
    for (const username of [
      'W'.repeat(policy.USERNAME_MIN_LENGTH - 1),
      'W'.repeat(policy.USERNAME_MAX_LENGTH + 1),
      'a bc',
      'ab/c',
      'ab?c',
    ])
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
  // LIBRARY ACCESS. Creation needs no flag; the AI does, and the routes
  // behind it check the same flag the page draws by, so a direct call is
  // stopped where the shelf is not drawn.
  const { holdsFlag } = load('src/lib/library/flags.ts');
  assert(holdsFlag({ featureNames: ['library-ai'] }, 'library-ai'));
  assert(!holdsFlag({ featureNames: ['can-create-library'] }, 'library-ai'));
  assert(!holdsFlag({ featureNames: 'library-ai' }, 'library-ai'));
  assert(!holdsFlag({}, 'library-ai'));
  assert(!holdsFlag(null, 'library-ai'));
  // The constants file carries icon components for its sample cards; the
  // icons are not what is checked here.
  const common = load('src/constants/library/common.ts', {
    '@icons/library/svg': new Proxy({}, { get: () => () => null }),
  });
  assert.equal(common.LIBRARY_AI_FLAG, 'library-ai');
  assert.equal(common.MAX_OBJECTS_PER_LIBRARY, 300);
  for (const route of [
    'src/pages/api/library/ai-shelf.ts',
    'src/pages/api/library/magic-book.ts',
  ])
    assert(
      fs.readFileSync(route, 'utf8').includes('flag: LIBRARY_AI_FLAG'),
      route,
    );
  for (const file of [
    'src/layouts/library/Library/Library.tsx',
    'src/layouts/library/Home/Home.tsx',
    'src/components/Header/Header.tsx',
    'src/components/UserProfile/UserProfile.tsx',
  ])
    assert(!fs.readFileSync(file, 'utf8').includes('can-create-library'), file);
  const libraryPage = fs.readFileSync(
    'src/layouts/library/Library/Library.tsx',
    'utf8',
  );
  assert(libraryPage.includes('viewAsOwner && hasLibraryAi'));
  assert(libraryPage.includes('canEditHere && hasLibraryAi'));
  // The library-wide cap's rejection is told apart from the shelf's.
  const { isLibraryFullError, isShelfFullError } = load(
    'src/lib/library/shelfFull.ts',
  );
  const reject = message => ({
    response: { status: 400, data: { error: { message } } },
  });
  assert(
    isLibraryFullError(reject('A library cannot hold more than 300 objects')),
  );
  assert(
    !isShelfFullError(reject('A library cannot hold more than 300 objects')),
  );
  assert(isShelfFullError(reject('A shelf cannot have more than 50 objects')));
  assert(
    !isLibraryFullError(reject('A shelf cannot have more than 50 objects')),
  );
  assert(!isLibraryFullError({ response: { status: 500, data: {} } }));
}
let status = 'PASS';
try {
  check();
  console.log(
    'PASS: favourites lead the card, privacy, ordering, the AI shelf board, username boundaries and loader styles',
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
