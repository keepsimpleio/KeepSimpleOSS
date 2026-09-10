#!/usr/bin/env node
/* Check the hand-edited Atlas words against the guide.

   src/lib/aiAtlas/features.ts is edited by hand. A key that matches no card
   in the guide is dead text: the page silently falls back to the Terminal's
   own wording and the edit never shows. This reports both directions.

     node scripts/ai-atlas/check-features.mjs

   Exit 1 when a key is dead. Cards without an entry are listed, not failed:
   falling back is allowed on purpose. */
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const guide = JSON.parse(
  readFileSync(new URL('src/lib/aiAtlas/guide.json', root), 'utf8'),
);
const src = readFileSync(new URL('src/lib/aiAtlas/features.ts', root), 'utf8');

const keys = [...src.matchAll(/^ {2}'?([a-z0-9-]+)'?: \[$/gm)].map(m => m[1]);
const ids = new Set([
  ...guide.steps.map(s => 'stage-' + s.id),
  ...guide.entries.map(e => e.id),
  ...guide.system.nodes.map(n => n.id),
  ...guide.system.nodes.map(n => 'system-' + n.id),
]);

const dead = keys.filter(k => !ids.has(k));
const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
const uncovered = [...ids].filter(
  id => !keys.includes(id) && !id.startsWith('system-'),
);

console.log(`${keys.length} keys, ${ids.size} cards in the guide`);
if (uncovered.length)
  console.log(
    `falling back to the guide (${uncovered.length}): ${uncovered.join(', ')}`,
  );
if (duplicates.length)
  console.error(`DUPLICATE keys: ${duplicates.join(', ')}`);
if (dead.length)
  console.error(`DEAD keys, these words never show: ${dead.join(', ')}`);
process.exit(dead.length || duplicates.length ? 1 : 0);
