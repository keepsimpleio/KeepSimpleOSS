#!/usr/bin/env node
/**
 * A key and the digest that admits it.
 *
 * The key goes to the agent that will hold it, in a file only that agent
 * reads. The digest goes into the CMS as LIBRARY_AGENT_KEYS, with the label
 * and the library id it is written for. The key itself is never stored on the
 * CMS side, so a leak of that configuration hands nobody a session.
 *
 *   node mcp/library/keygen.mjs <label> <library id>
 */

import { createHash, randomBytes } from 'node:crypto';

const [label, libraryId] = process.argv.slice(2);

if (!label || !/^\d+$/.test(String(libraryId))) {
  process.stderr.write(
    'usage: node mcp/library/keygen.mjs <label> <library id>\n',
  );
  process.exit(2);
}

const key = randomBytes(32).toString('base64url');
const digest = createHash('sha256').update(key).digest('hex');

process.stdout.write(
  [
    `key (to the agent, in its key file):  ${key}`,
    `CMS entry (LIBRARY_AGENT_KEYS):       ${label}:${digest}:${libraryId}`,
    '',
  ].join('\n'),
);
