const fs = require('fs');
const vm = require('vm');
const ts = require('typescript');
const assert = require('assert/strict');
let stored = 'probe-current';
let removed = 0;
let expired = 0;
const localStorage = {
  getItem: () => stored,
  removeItem: () => {
    stored = null;
  },
};
const globals = {
  window: { localStorage, dispatchEvent: () => expired++ },
  localStorage,
  Event: class Event {},
  process: { env: { NEXT_PUBLIC_STRAPI: 'https://example.invalid' } },
  fetch: async () => ({ status: 401, ok: false }),
};
function load(file, imports) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const context = {
    ...globals,
    exports: {},
    require: id => {
      if (id in imports) return imports[id];
      throw Error('Unexpected import ' + id);
    },
  };
  vm.runInNewContext(code, context, { filename: file });
  return { exports: context.exports, context };
}
(async () => {
  const cookie = load('src/lib/library/cookie/index.ts', {
    'js-cookie': { remove: () => removed++ },
  });
  assert.equal(cookie.exports.getAccessToken(), 'probe-current');
  stored = null;
  assert.equal(cookie.exports.getAccessToken(), undefined);
  assert.equal(removed, 0);
  delete cookie.context.window;
  assert.equal(cookie.exports.getAccessToken(), undefined);
  cookie.context.window = globals.window;
  const axios = load('src/lib/library/axios/index.ts', {
    axios: require('axios'),
    '@lib/library/cookie': cookie.exports,
  }).exports.default;
  stored = 'probe-current';
  axios.defaults.adapter = async config => {
    throw { response: { status: 401 }, config };
  };
  await axios.get('/probe').catch(() => {});
  assert.equal(stored, null);
  assert.equal(removed, 1);
  assert.equal(expired, 1);
  stored = 'probe-new';
  axios.defaults.adapter = async config => {
    config.headers.Authorization = 'Bearer probe-old';
    throw { response: { status: 401 }, config };
  };
  await axios.get('/probe').catch(() => {});
  assert.equal(stored, 'probe-new');
  assert.equal(removed, 1);
  assert.equal(expired, 1);
  const profile = load('src/api/strapi.ts', {
    '@lib/library/cookie': cookie.exports,
  });
  assert.equal(await profile.exports.getMyInfo(), null);
  assert.equal(stored, null);
  assert.equal(removed, 2);
  assert.equal(expired, 2);
  console.log(
    'PASS: token reads and SSR are pure; current-token 401 clears storage/cookie; stale 401 preserves the new session; profile expiry clears both stores.',
  );
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
