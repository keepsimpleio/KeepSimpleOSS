#!/usr/bin/env node
/* Internal-data guard. This repository is public: every committed line is
   world-readable, and a pushed commit stays fetchable by SHA even after a
   force-push. This guard reads the ADDED lines of the staged diff and refuses
   the commit when they carry data that describes our private infrastructure.
   Existing lines are not judged, so touching an old file never trips it.

   Runs from lint-staged on every commit (see package.json). File arguments
   from lint-staged are ignored: the staged diff is the source of truth.

   Every run writes one line to .internal-data-guard.log (gitignored, UTC).

   Blocked in added lines:
     - source fingerprints exported by other agents' tools: a "sha256" key,
       or a "file" + "line" pair in JSON
     - internal paths: /workspace/, /data/secrets, /data/bin/, /root/.claude,
       wolfs-server/
     - Terminal export shapes under public/: "where"/"when"/"basis" keys in
       JSON, which mark a guide that was not stripped

   There is no bypass flag. If a line is legitimate, rewrite it so it no
   longer names the private thing. */
import { execSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RULES = [
  {
    name: 'source fingerprint (sha256 key)',
    re: /"sha256"\s*:/,
  },
  {
    name: 'source fingerprint (file + line)',
    re: /"file"\s*:\s*"[^"]+"\s*,\s*"line"\s*:\s*\d+/,
  },
  {
    name: 'internal path',
    re: /(\/workspace\/|\/data\/secrets|\/data\/bin\/|\/root\/\.claude|wolfs-server\/)/,
  },
  {
    name: 'unstripped export under public/',
    re: /"(where|when|basis|sourceLabel)"\s*:/,
    onlyUnder: /^public\//,
  },
];

const root = execSync('git rev-parse --show-toplevel').toString().trim();
const journal = resolve(root, '.internal-data-guard.log');
const log = (verdict, detail) =>
  appendFileSync(
    journal,
    `${new Date().toISOString()} ${verdict} ${detail}\n`,
  );

let diff = '';
try {
  diff = execSync('git diff --cached -U0 --no-color --diff-filter=AM', {
    cwd: root,
    maxBuffer: 64 * 1024 * 1024,
  }).toString();
} catch (e) {
  log('ERROR', `git diff failed: ${String(e.message).split('\n')[0]}`);
  process.exit(1);
}

const findings = [];
let file = null;
for (const line of diff.split('\n')) {
  if (line.startsWith('+++ ')) {
    file = line.startsWith('+++ b/') ? line.slice(6) : null;
    continue;
  }
  if (!file || !line.startsWith('+') || line.startsWith('+++')) continue;
  if (file === 'scripts/guard/no-internal-data.mjs') continue;
  const added = line.slice(1);
  for (const rule of RULES) {
    if (rule.onlyUnder && !rule.onlyUnder.test(file)) continue;
    if (rule.re.test(added)) {
      findings.push({ file, rule: rule.name, line: added.trim().slice(0, 120) });
    }
  }
}

if (findings.length) {
  console.error('\nINTERNAL DATA GUARD: commit refused. This repository is public.');
  for (const f of findings) {
    console.error(`  ${f.file}: ${f.rule}\n    + ${f.line}`);
  }
  console.error(
    '\nRewrite the added lines so they no longer describe private infrastructure. There is no bypass.\n',
  );
  log('BLOCK', `${findings.length} finding(s): ${[...new Set(findings.map(f => f.file))].join(',')}`);
  process.exit(1);
}

log('PASS', `${diff.split('\n').filter(l => l.startsWith('+++ ')).length} file(s) staged`);
