// Read-only CMS contract checks and content fingerprints. No deployment or SQL writes.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const contract = require('./library-contract.cjs');
const root = path.resolve(__dirname, '../..');
const outputDir = path.join(root, 'docs/release-audits');
const targets = {
  prod: { cms: 'https://strapi.keepsimple.io', cluster: '7417970324150485018' },
  staging: {
    cms: 'https://staging-strapi.keepsimple.io',
    cluster: '7611252043486130202',
  },
};
const [command, target, ...args] = process.argv.slice(2);
const report = {
  at: new Date().toISOString(),
  command,
  target,
  status: 'FAIL',
};
function sql(query) {
  const out = execFileSync(
    '/data/bin/keepsimple-ctl',
    ['cms', 'sql', target, '\\pset format unaligned\n\\t on\n' + query],
    { encoding: 'utf8', timeout: 60000, maxBuffer: 32 * 1024 * 1024 },
  );
  return JSON.parse(out.split('\n').find(line => line.startsWith('{')));
}
function snapshot() {
  const tables = contract.protectedTables
    .map(
      table =>
        `'${table}',(SELECT COALESCE(jsonb_agg(jsonb_build_object('id',id,'hash',md5(to_jsonb(t)::text)) ORDER BY id),'[]'::jsonb) FROM ${table} t)`,
    )
    .join(',');
  return sql(
    `SELECT jsonb_build_object('cluster',(SELECT system_identifier::text FROM pg_control_system()),'tables',jsonb_build_object(${tables}));`,
  );
}
function outputPath(name) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.json$/.test(name || ''))
    throw Error('Use a snapshot filename ending in .json');
  return path.join(outputDir, name);
}
async function main() {
  if (!targets[target]) throw Error('Expected target prod or staging');
  fs.mkdirSync(outputDir, { recursive: true });
  if (command === 'capture') {
    if (args.length !== 1) throw Error('capture TARGET NAME.json');
    const data = snapshot();
    if (data.cluster !== targets[target].cluster)
      throw Error('Wrong database cluster');
    const bytes = JSON.stringify(data);
    fs.writeFileSync(outputPath(args[0]), bytes, { flag: 'wx', mode: 0o600 });
    report.snapshot = args[0];
    report.sha256 = createHash('sha256').update(bytes).digest('hex');
  } else if (command === 'compare') {
    if (args.length !== 1) throw Error('compare TARGET NAME.json');
    const before = JSON.parse(fs.readFileSync(outputPath(args[0]), 'utf8'));
    if (before.cluster !== targets[target].cluster)
      throw Error('Wrong baseline target');
    contract.compareSnapshots(before, snapshot());
    report.snapshot = args[0];
  } else if (command === 'inspect') {
    if (args.length !== 2 || args.some(x => !/^[1-9]\d*$/.test(x)))
      throw Error('inspect TARGET OWNER_ID LIBRARY_ID');
    const [owner, library] = args;
    const data = sql(`SELECT jsonb_build_object(
      'cluster',(SELECT system_identifier::text FROM pg_control_system()),
      'columns',(SELECT jsonb_agg(to_jsonb(c)) FROM (SELECT table_name,column_name,data_type FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('library','objects')) c),
      'isOwner',EXISTS(SELECT 1 FROM library_user_links WHERE library_id=${library} AND user_id=${owner}),
      'hasFlag',EXISTS(SELECT 1 FROM feature_flags_users_links l JOIN feature_flags f ON f.id=l.feature_flag_id WHERE l.user_id=${owner} AND f.feature_name='can-create-library'),
      'canUpdate',EXISTS(SELECT 1 FROM up_users_role_links u JOIN up_permissions_role_links l ON l.role_id=u.role_id JOIN up_permissions p ON p.id=l.permission_id WHERE u.user_id=${owner} AND p.action='api::library.library.update'),
      'publicCanUpdate',EXISTS(SELECT 1 FROM up_roles r JOIN up_permissions_role_links l ON l.role_id=r.id JOIN up_permissions p ON p.id=l.permission_id WHERE r.type='public' AND p.action='api::library.library.update')
    );`);
    contract.validateDatabase(data, targets[target].cluster);
    const response = await fetch(
      `${targets[target].cms}/api/libraries/${library}`,
      { signal: AbortSignal.timeout(15000) },
    );
    if (response.status !== 200)
      throw Error('Public library HTTP ' + response.status);
    contract.validatePublic(await response.json());
    report.owner = Number(owner);
    report.library = Number(library);
    report.scope =
      'Schema, owner prerequisites, public read only. Owner save/reload and deployment provenance remain separate release gates.';
  } else throw Error('Expected inspect, capture or compare');
  report.status = 'PASS';
}
main()
  .catch(error => {
    report.error = error.message;
    process.exitCode = 1;
  })
  .finally(() => {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.appendFileSync(
      path.join(outputDir, 'journal.jsonl'),
      JSON.stringify(report) + '\n',
      { mode: 0o600 },
    );
    console.log(JSON.stringify(report));
  });
