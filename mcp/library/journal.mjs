/**
 * One line per call, whatever the outcome. Timestamps are UTC, as every
 * machine-readable trail here is; the key and the session it buys never
 * appear in it.
 */

import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { journalPath, target } from './config.mjs';

// A trail, not a second copy of the library. What was written stays in the
// library; the line only has to say which book it reached.
const LONGEST = 120;

const brief = value => {
  if (Array.isArray(value)) return value.map(brief);

  if (typeof value === 'string' && value.length > LONGEST) {
    return `${value.slice(0, LONGEST)}… (${value.length} characters)`;
  }

  return value;
};

const briefArgs = args =>
  args && typeof args === 'object'
    ? Object.fromEntries(
        Object.entries(args).map(([key, value]) => [key, brief(value)]),
      )
    : args;

let ready = false;
let caller = null;

/** Who is on the other end of the pipe, as the client named itself. */
export const setCaller = name => {
  caller = name ?? null;
};

export const record = entry => {
  try {
    if (!ready) {
      mkdirSync(path.dirname(journalPath), { recursive: true });
      ready = true;
    }

    const line = { at: new Date().toISOString(), target, caller, ...entry };

    if (line.args) line.args = briefArgs(line.args);

    appendFileSync(journalPath, `${JSON.stringify(line)}\n`);
  } catch (error) {
    process.stderr.write(`[library-mcp] journal failed: ${error.message}\n`);
  }
};
