const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
process.chdir(path.resolve(__dirname, '../..'));
function load(file, mocks = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInNewContext(
    source,
    {
      exports,
      process,
      Buffer,
      console,
      require(id) {
        if (id in mocks) return mocks[id];
        if (id.startsWith('@constants/'))
          return load(`src/constants/${id.slice(11)}.ts`, mocks);
        if (id.startsWith('@lib/'))
          return load(`src/lib/${id.slice(5)}.ts`, mocks);
        if (id.startsWith('.'))
          return load(path.resolve(path.dirname(file), `${id}.ts`), mocks);
        return require(id);
      },
    },
    { filename: file },
  );
  return exports;
}
async function main() {
  const { librarySeo } = load('src/lib/library/seo.ts');
  const { DEFAULT_SEO } = load('src/constants/library/seo.config.ts');
  const book = {
    id: 1,
    attributes: {
      type: 'book',
      title: 'Public book',
      description: 'PRIVATE NOTES',
    },
  };
  const entry = {
    id: 2,
    attributes: {
      user: { data: { attributes: { username: 'Reader' } } },
      libraryDetails: { aboutLibrary: '<p>My reading</p>' },
      singleShelves: {
        data: [
          {
            attributes: {
              visibility: 'public',
              objects: { data: [book, book] },
            },
          },
          {
            attributes: {
              visibility: 'private',
              objects: {
                data: [{ id: 99, attributes: { title: 'SECRET BOOK' } }],
              },
            },
          },
        ],
      },
    },
  };
  const seo = librarySeo(entry);
  assert.equal(seo.title, "Reader's Library | KeepSimple");
  assert.equal(
    seo.description,
    "Reader's personal library. Includes personal notes and precise recommendations.",
  );
  assert.equal(seo.schema.description, seo.description);
  assert.equal(seo.schema.image, seo.image);
  assert.equal(
    seo.image,
    'https://keepsimple.io/api/library/thumbnail/reader?v=1',
  );
  const wolf = librarySeo({
    ...entry,
    attributes: {
      ...entry.attributes,
      user: { data: { attributes: { username: 'wolf' } } },
    },
  });
  assert.equal(wolf.title, "Wolf Alexanyan's Library | Collected since 2007");
  assert.equal(
    wolf.description,
    "Wolf Alexanyan's personal library, collected since 2007. Includes personal notes and precise recommendations.",
  );
  assert(wolf.image.endsWith('/wolf-library-v1.png'));
  const originalDomain = process.env.NEXT_PUBLIC_DOMAIN;
  process.env.NEXT_PUBLIC_DOMAIN = 'https://staging.keepsimple.io';
  assert(librarySeo(entry).image.startsWith('https://staging.keepsimple.io/'));
  assert.equal(
    librarySeo(entry).schema.url,
    'https://keepsimple.io/library/reader',
  );
  if (originalDomain === undefined) delete process.env.NEXT_PUBLIC_DOMAIN;
  else process.env.NEXT_PUBLIC_DOMAIN = originalDomain;
  const { renderLibraryThumbnail } = load('src/lib/library/thumbnail.ts');
  for (const name of [
    'Reader',
    'ОченьДлинноеИмяПользователя12345',
    'Ալեքսանդր',
  ]) {
    const png = await renderLibraryThumbnail(name, name);
    const info = await require('sharp')(png).metadata();
    assert.equal(info.format, 'png');
    assert.equal(info.width, 1200);
    assert.equal(info.height, 630);
    fs.mkdirSync('docs/release-audits', { recursive: true });
    fs.writeFileSync(`docs/release-audits/thumbnail-${name}.png`, png);
  }
  assert.equal(seo.schema.mainEntity.numberOfItems, 1);
  assert.equal(seo.schema.url, 'https://keepsimple.io/library/reader');
  assert(!JSON.stringify(seo).includes('SECRET'));
  assert(!JSON.stringify(seo).includes('PRIVATE NOTES'));
  assert(!librarySeo().schema.mainEntity);
  let thumbnailSeo = seo;
  let unavailable = false;
  let renders = 0;
  const thumbnail = load('src/pages/api/library/thumbnail/[username].ts', {
    '@api/library/getPublicLibrarySeo': {
      getPublicLibrarySeo: async () => {
        if (unavailable) throw Error('CMS unavailable');
        return thumbnailSeo;
      },
    },
    '@lib/library/thumbnail': {
      renderLibraryThumbnail: async (name, username) => {
        assert.equal(name, 'Reader');
        assert.equal(username, 'Reader');
        renders++;
        return Buffer.from('PNG fixture');
      },
    },
  }).default;
  async function request(method, username) {
    const result = { headers: {} };
    const res = {
      setHeader(key, value) {
        result.headers[key] = value;
      },
      status(code) {
        result.status = code;
        return res;
      },
      end() {
        return res;
      },
      send(body) {
        result.body = body;
        return res;
      },
    };
    await thumbnail({ method, query: { username } }, res);
    return result;
  }
  const success = await request('GET', 'reader');
  assert.equal(success.status, 200);
  assert.equal(success.headers['Content-Type'], 'image/png');
  assert.equal(success.body.toString(), 'PNG fixture');
  assert.equal((await request('HEAD', 'reader')).body, undefined);
  assert.equal((await request('POST', 'reader')).status, 405);
  assert.equal((await request('GET', ['reader'])).status, 400);
  assert.equal((await request('GET', 'a'.repeat(31))).status, 400);
  thumbnailSeo = librarySeo();
  assert.equal((await request('GET', 'missing')).status, 404);
  unavailable = true;
  const failure = await request('GET', 'reader');
  assert.equal(failure.status, 503);
  assert.equal(failure.headers['Cache-Control'], 'no-store');
  assert.equal(renders, 2);
  const calls = [];
  const api = load('src/api/library/getPublicLibrarySeo.ts', {
    axios: {
      create(options) {
        assert(!options.headers);
        return {
          async get(url, config) {
            calls.push(url);
            assert(!config.headers);
            return url === '/api/libraries'
              ? {
                  data: {
                    data: [entry],
                    meta: { pagination: { pageCount: 1 } },
                  },
                }
              : { data: { data: entry } };
          },
        };
      },
    },
  });
  assert.equal((await api.getPublicLibrarySeo('reader')).title, seo.title);
  assert.equal(calls.length, 2);
  const Generator = load('src/components/SeoGenerator/SeoGenerator.tsx', {
    'next/head': ({ children }) =>
      React.createElement(React.Fragment, null, children),
    'next/router': {
      useRouter: () => ({ locale: 'en', asPath: '/library/wolf' }),
    },
    'next/script': () => null,
    '@lib/schema': { generateSchema: () => ({ '@type': 'WebPage' }) },
  }).default;
  const html = renderToStaticMarkup(
    React.createElement(Generator, {
      strapiSEO: {
        title: seo.title,
        pageTitle: seo.title,
        description: seo.description,
      },
      schemaOverride: seo.schema,
      largeImage: true,
      imageWidth: seo.imageWidth,
      imageHeight: seo.imageHeight,
      omitDefaultAuthor: true,
      ogTags: {
        ogTitle: seo.title,
        ogDescription: seo.description,
        ogType: 'website',
        ogImage: {
          data: { attributes: { url: '', staticUrl: seo.image } },
        },
      },
    }),
  );
  assert(html.includes('summary_large_image'));
  assert(html.includes('CollectionPage'));
  assert(html.includes(seo.image));
  assert(!html.includes('Alexanyan'));
  assert(!html.includes('SECRET'));
  const legacy = renderToStaticMarkup(
    React.createElement(Generator, {
      strapiSEO: {
        title: 'Other section',
        description: 'Description',
        pageTitle: 'Other section',
      },
    }),
  );
  assert(legacy.includes('content="summary"'));
  assert(legacy.includes('Wolf Alexanyan'));
  assert(legacy.includes('WebPage'));
  assert(!legacy.includes('CollectionPage'));
  const response = await fetch(DEFAULT_SEO.image, {
    signal: AbortSignal.timeout(20000),
  });
  assert.equal(response.status, 200);
  assert(response.headers.get('content-type').startsWith('image/'));
  const metadata = await require('sharp')(
    Buffer.from(await response.arrayBuffer()),
  ).metadata();
  assert.equal(metadata.width, 1920);
  assert.equal(metadata.height, 1280);
  if (process.argv.includes('--live')) {
    const live = await load(
      'src/api/library/getPublicLibrarySeo.ts',
    ).getPublicLibrarySeo('wolf');
    assert.equal(live.title, "Wolf's library | KeepSimple");
    assert(live.schema.mainEntity.numberOfItems > 0);
    console.log(
      'PASS: production anonymous library metadata and public objects',
    );
  }
  console.log(
    'PASS: anonymous metadata, private content exclusion, SSR tags, public image and dimensions',
  );
}
main()
  .then(() => journal('PASS'))
  .catch(error => {
    journal('FAIL');
    console.error(error);
    process.exitCode = 1;
  });
function journal(status) {
  fs.mkdirSync('docs/release-audits', { recursive: true });
  fs.appendFileSync(
    'docs/release-audits/library-seo.jsonl',
    JSON.stringify({
      at: new Date().toISOString(),
      event: 'library-seo-check',
      status,
    }) + '\n',
  );
}
