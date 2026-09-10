/* Strip the Terminal's guide to the fields the public Atlas page renders.
   The Terminal's export carries source references (file, line, sha256),
   its own placement notes and a tool inventory that describe the private
   server. None of it is drawn on keepsimple.io/ai-atlas, so none of it
   ships. Run after every refresh of src/lib/aiAtlas/guide.json:

     node scripts/ai-atlas/strip-guide.mjs

   Idempotent: a stripped guide stays as it is. */
import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/aiAtlas/guide.json', import.meta.url);
const guide = JSON.parse(readFileSync(path, 'utf8'));

const pick = (obj, keys) =>
  Object.fromEntries(
    keys.filter(k => obj[k] !== undefined).map(k => [k, obj[k]]),
  );

const stripped = {
  generatedAt: guide.generatedAt,
  steps: guide.steps.map(s =>
    pick(s, ['id', 'title', 'location', 'text', 'children']),
  ),
  entries: guide.entries.map(e =>
    pick(e, ['id', 'title', 'text', 'detail', 'children']),
  ),
  links: guide.links,
  system: {
    nodes: guide.system.nodes.map(n =>
      pick(n, ['id', 'title', 'role', 'detail', 'basis']),
    ),
    edges: guide.system.edges,
  },
};

const before = JSON.stringify(guide).length;
const after = JSON.stringify(stripped).length;
writeFileSync(path, JSON.stringify(stripped, null, 1) + '\n');
console.log(
  `guide.json: ${before} -> ${after} bytes, ${guide.entries.length} entries, ${guide.system.nodes.length} nodes`,
);
