// Runs in deployment CI without credentials, before the frontend image is built.
const fs = require('node:fs');
const { validatePublic } = require('./library-contract.cjs');
const target = process.argv[2];
const endpoints = {
  prod: 'https://strapi.keepsimple.io',
  staging: 'https://staging-strapi.keepsimple.io',
};
const report = {
  at: new Date().toISOString(),
  event: 'library-public-contract',
  target,
  status: 'FAIL',
};
(async () => {
  if (!endpoints[target]) throw Error('Expected prod or staging');
  const response = await fetch(
    endpoints[target] + '/api/libraries?pagination[pageSize]=100',
    { signal: AbortSignal.timeout(20000) },
  );
  if (response.status !== 200)
    throw Error('Library directory HTTP ' + response.status);
  const body = await response.json();
  if (!Array.isArray(body.data) || !body.data.length)
    throw Error('No public library fixture; contract unverified');
  for (const library of body.data) validatePublic({ data: library });
  report.librariesChecked = body.data.length;
  report.status = 'PASS';
})()
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
