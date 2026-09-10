/**
 * Where this server writes, what it writes with, and where it leaves its trail.
 *
 * The target is one setting, not a rebuild: the same key file is never used
 * for both, because a key is written against a library id and the two
 * databases number their libraries separately.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

const TARGETS = {
  prod: 'https://strapi.keepsimple.io',
  staging: 'https://staging-strapi.keepsimple.io',
};

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);

const readKey = () => {
  const inline = process.env.KS_LIBRARY_AGENT_KEY;
  if (inline && inline.trim()) return inline.trim();

  const file =
    process.env.KS_LIBRARY_AGENT_KEY_FILE ||
    '/data/secrets/keepsimple-library-agent-key';

  try {
    const key = readFileSync(file, 'utf8').trim();
    if (!key) throw new Error('empty');
    return key;
  } catch {
    throw new Error(
      `No library agent key. Set KS_LIBRARY_AGENT_KEY, or put the key in ${file}.`,
    );
  }
};

export const target = (process.env.KS_LIBRARY_TARGET || 'prod').toLowerCase();

if (!TARGETS[target]) {
  throw new Error(
    `KS_LIBRARY_TARGET must be prod or staging, not "${target}".`,
  );
}

export const strapiUrl = (
  process.env.KS_LIBRARY_STRAPI || TARGETS[target]
).replace(/\/+$/, '');

export const journalPath =
  process.env.KS_LIBRARY_JOURNAL ||
  path.join(repoRoot, 'logs', 'library-mcp.jsonl');

export const agentKey = readKey;

/**
 * A session handed in rather than minted. The token still has to be a real
 * one the CMS accepts, so this grants nothing on its own: it exists so the
 * tools can be exercised against a library before the key endpoint is live,
 * and so a probe can run as a review account instead of an owner.
 */
export const handedSession =
  process.env.KS_LIBRARY_SESSION_JWT && process.env.KS_LIBRARY_ID
    ? {
        jwt: process.env.KS_LIBRARY_SESSION_JWT.trim(),
        libraryId: Number(process.env.KS_LIBRARY_ID),
      }
    : null;
