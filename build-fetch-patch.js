// Auto-loaded via NODE_OPTIONS=--require during yarn build:staging.
// Replaces HTML/!ok responses from *.keepsimple.io with empty-data JSON so
// build prerender doesn't abort on Cloudflare bot challenges against GH
// Actions runner IPs. Container runtime never sources this file.
'use strict';
(function patch() {
  if (typeof globalThis.fetch !== 'function') return;
  if (globalThis.__strapiFetchPatched) return;
  globalThis.__strapiFetchPatched = true;
  const _origFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async function patchedFetch(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (!/keepsimple\.io/.test(url)) return _origFetch(input, init);
    try {
      const resp = await _origFetch(input, init);
      const ct = (resp.headers && resp.headers.get && resp.headers.get('content-type')) || '';
      if (!resp.ok || ct.startsWith('text/html')) {
        console.warn('[build-fetch] non-JSON/!ok (', resp.status, ct, ') — empty data fallback for', url.slice(0, 100));
        return new Response('{"data":[]}', { status: 200, headers: { 'content-type': 'application/json' } });
      }
      return resp;
    } catch (e) {
      console.warn('[build-fetch] threw — empty data fallback:', e && e.message);
      return new Response('{"data":[]}', { status: 200, headers: { 'content-type': 'application/json' } });
    }
  };
})();
