const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { execFileSync } = require('node:child_process');
const contract = require('./library-contract.cjs');
process.chdir(path.resolve(__dirname, '../..'));
const report = {
  at: new Date().toISOString(),
  event: 'library-regressions',
  status: 'FAIL',
};
function load(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const context = {
    exports: {},
    console: { error() {} },
    require: id => {
      if (id in imports) return imports[id];
      throw Error(id);
    },
  };
  vm.runInNewContext(code, context, { filename: file });
  return context.exports;
}
function nativeTitles(source) {
  const ast = ts.createSourceFile(
    'control.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let count = 0;
  function walk(node) {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      /^[a-z]/.test(node.tagName.getText(ast))
    ) {
      count += node.attributes.properties.filter(
        a => ts.isJsxAttribute(a) && a.name.getText(ast) === 'title',
      ).length;
    }
    ts.forEachChild(node, walk);
  }
  walk(ast);
  return count;
}
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(tsx?|scss)$/.test(file)) {
      const source = fs.readFileSync(file, 'utf8');
      if (file.endsWith('.tsx'))
        assert.equal(nativeTitles(source), 0, 'Native tooltip: ' + file);
      assert.equal(
        /\(max\s+\d+\s+(?:items|shelves|books)\)/i.test(source),
        false,
        'Obsolete capacity copy: ' + file,
      );
    }
  }
}
async function main() {
  assert.equal(nativeTitles('<button title="bad" />'), 1);
  assert.equal(nativeTitles('<Modal title="heading" />'), 0);
  scan('src/components/library');
  scan('src/layouts/library');
  for (const file of [
    'src/pages/api/library/dev-session.ts',
    'src/pages/library/dev-share-session.tsx',
  ])
    assert.equal(fs.existsSync(file), false, 'Retired session route restored');
  const paths = load('src/lib/library/libraryPath.ts');
  assert.equal(paths.libraryPath('Wolf'), '/library/wolf');
  assert.equal(paths.libraryPath(' A/B # '), '/library/a%2Fb%20%23');
  assert.equal(paths.libraryPath(undefined), '/library');
  const redirect = load('src/api/library/getLibraryRedirect.ts', {
    '@lib/library/libraryPath': paths,
    './getSingleLibrary': {
      getSingleLibrary: async () => ({
        data: {
          attributes: { user: { data: { attributes: { username: 'Wolf' } } } },
        },
      }),
    },
  });
  assert.equal(
    await redirect.getLibraryRedirect('2', '/ru/library/2/book-12?x=1'),
    '/ru/library/wolf/book-12?x=1',
  );
  assert.equal(
    await redirect.getLibraryRedirect('wolf', '/library/wolf'),
    null,
  );
  const client = {
    get: async (_, { params }) => {
      assert.equal(
        Object.keys(params).some(k => k.startsWith('filters[user]')),
        false,
        'Restricted guest relation filter restored',
      );
      return {
        data: {
          data:
            params['pagination[page]'] === 1
              ? []
              : [
                  {
                    id: 2,
                    attributes: {
                      user: { data: { attributes: { username: 'Wolf' } } },
                    },
                  },
                ],
          meta: { pagination: { pageCount: 2 } },
        },
      };
    },
  };
  const lookup = load('src/api/library/getLibraryIdByUsername.ts', {
    axios: require('axios'),
    '@lib/library/axios': client,
    './getSingleLibrary': { LibraryLoadError: Error },
  });
  assert.equal(await lookup.getLibraryIdByUsername('WOLF'), 2);
  client.get = async () => {
    throw Error('offline');
  };
  await assert.rejects(() => lookup.getLibraryIdByUsername('Wolf'));
  const db = {
    cluster: 'test',
    columns: Object.entries(contract.fields).flatMap(([table_name, fields]) =>
      Object.entries(fields).map(([column_name, data_type]) => ({
        table_name,
        column_name,
        data_type,
      })),
    ),
    isOwner: true,
    hasFlag: true,
    canUpdate: true,
    publicCanUpdate: false,
  };
  contract.validateDatabase(db, 'test');
  for (const patch of [
    { columns: [] },
    { hasFlag: false },
    { canUpdate: false },
    { isOwner: false },
    { publicCanUpdate: true },
    { cluster: 'wrong' },
  ])
    assert.throws(() => contract.validateDatabase({ ...db, ...patch }, 'test'));
  const publicResponse = {
    data: {
      attributes: {
        favoritesVisibility: 'private',
        user: { data: { attributes: { username: 'Wolf' } } },
      },
    },
  };
  contract.validatePublic(publicResponse);
  delete publicResponse.data.attributes.favoritesVisibility;
  assert.throws(() => contract.validatePublic(publicResponse));
  const baseline = {
    cluster: 'test',
    tables: { objects: [{ id: 1, hash: 'a' }] },
  };
  contract.compareSnapshots(baseline, structuredClone(baseline));
  assert.throws(() =>
    contract.compareSnapshots(baseline, {
      cluster: 'test',
      tables: { objects: [] },
    }),
  );
  assert.throws(() =>
    contract.compareSnapshots(baseline, {
      cluster: 'test',
      tables: { objects: [{ id: 1, hash: 'b' }] },
    }),
  );
  execFileSync(process.execPath, ['scripts/release/library-auth-check.cjs'], {
    stdio: 'pipe',
  });
  report.status = 'PASS';
}
main()
  .catch(error => {
    report.error = error.message;
    process.exitCode = 1;
  })
  .finally(() => {
    fs.mkdirSync('docs/release-audits', { recursive: true });
    fs.appendFileSync(
      'docs/release-audits/journal.jsonl',
      JSON.stringify(report) + '\n',
      { mode: 0o600 },
    );
    console.log(JSON.stringify(report));
  });
