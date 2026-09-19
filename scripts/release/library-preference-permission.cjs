const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Run from the project workspace through the project-owned deployment wrapper.
// Default is read-only. Apply only as part of an authorized release.
const [target, mode = '--check', ...options] = process.argv.slice(2);
const action = 'api::library.library.update';
const journal = path.resolve(
  __dirname,
  '../../docs/release-staging/library-permission.journal.jsonl',
);
const record = {
  at: new Date().toISOString(),
  mechanism: 'library.preferencePermission',
  target,
  mode,
  outcome: 'failed',
};

function ctl(args) {
  return execFileSync('/data/bin/keepsimple-ctl', args, {
    encoding: 'utf8',
    timeout: 120000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function inspect() {
  const sql = `\\pset format unaligned
\\t on
SELECT jsonb_build_object(
  'fieldExists', EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'library'
      AND column_name = 'ai_shelf_collapsed' AND data_type = 'boolean'
  ),
  'ownerRoleExists', EXISTS (SELECT 1 FROM up_roles WHERE type = 'authenticated'),
  'ownerCanUpdate', EXISTS (
    SELECT 1 FROM up_permissions p
    JOIN up_permissions_role_links l ON l.permission_id = p.id
    JOIN up_roles r ON r.id = l.role_id
    WHERE r.type = 'authenticated' AND p.action = '${action}'
  ),
  'publicCanUpdate', EXISTS (
    SELECT 1 FROM up_permissions p
    JOIN up_permissions_role_links l ON l.permission_id = p.id
    JOIN up_roles r ON r.id = l.role_id
    WHERE r.type = 'public' AND p.action = '${action}'
  )
);`;
  const output = ctl(['cms', 'sql', target, sql]);
  return JSON.parse(output.split('\n').find(line => line.startsWith('{')));
}

try {
  if (!['prod', 'staging'].includes(target)) {
    throw new Error('Expected prod or staging.');
  }
  if (!['--check', '--apply'].includes(mode)) {
    throw new Error('Expected --check or --apply.');
  }
  const needsGo = mode === '--apply' && target === 'prod';
  if (
    needsGo
      ? options.length !== 2 || options[0] !== '--go' || !options[1].trim()
      : options.length !== 0
  ) {
    throw new Error('Production apply requires --go with owner approval.');
  }
  const before = inspect();
  record.before = before;
  if (
    !before.fieldExists ||
    !before.ownerRoleExists ||
    before.publicCanUpdate
  ) {
    throw new Error('Library schema or role prerequisites require review.');
  }
  if (!before.ownerCanUpdate && mode === '--apply') {
    // The deployed CMS controller checks ownership and rejects owner changes.
    // Grant only the authenticated route; never grant anonymous writes.
    const approval = needsGo ? options : ['--write'];
    ctl(['cms', 'grant', target, 'authenticated', action, ...approval]);
  }
  const after = mode === '--apply' ? inspect() : before;
  record.after = after;
  if (!after.ownerCanUpdate || after.publicCanUpdate || !after.fieldExists) {
    throw new Error('Library preference saving is blocked by CMS permissions.');
  }
  record.outcome = 'passed';
  console.log('LIBRARY_PREFERENCE_PERMISSION_PASS', target);
} catch (error) {
  record.error = error.message;
  console.error('LIBRARY_PREFERENCE_PERMISSION_FAIL', error.message);
  process.exitCode = 1;
} finally {
  fs.mkdirSync(path.dirname(journal), { recursive: true });
  fs.appendFileSync(journal, JSON.stringify(record) + '\n', { mode: 0o600 });
}
