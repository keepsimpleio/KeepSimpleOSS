#!/usr/bin/env node
/* Strip the Article and Ladder pages to the words the Atlas tabs render.

   Their source is another project's static site (index.html, ladder.js and
   app.js in its public folder). Those files carry the author's own notes
   (copy-gate comments, hidden drafts, design remarks) that never ship. This
   script keeps only the visible paragraphs, the ladder data and the board's
   step names and tips, and writes src/lib/aiAtlas/readings.json. Run it
   after every refresh of that site:

     node scripts/ai-atlas/strip-readings.mjs <public folder of the source>

   Every run writes one line to logs/ai-atlas-readings.jsonl (gitignored, UTC). */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const root = new URL('../../', import.meta.url);
const out = new URL('src/lib/aiAtlas/readings.json', root);
const journal = new URL('logs/ai-atlas-readings.jsonl', root);
const record = { at: new Date().toISOString(), action: 'strip-readings' };

const decode = s =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');

/* A paragraph becomes runs of plain text and marked text. A mark keeps its
   kind only: key (red) or see (blue). Every other tag is dropped. */
const segments = html => {
  const body = html.replace(/<\/?span[^>]*>/g, '');
  const runs = [];
  const re = /<mark class="(key|see)">([\s\S]*?)<\/mark>/g;
  let last = 0;
  const push = (t, m) => {
    const text = decode(t.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ');
    if (text) runs.push(m ? { t: text, m } : { t: text });
  };
  for (const match of body.matchAll(re)) {
    push(body.slice(last, match.index));
    push(match[2], match[1]);
    last = match.index + match[0].length;
  }
  push(body.slice(last));
  return runs;
};

const pick = (obj, keys) =>
  Object.fromEntries(
    keys.filter(k => obj[k] !== undefined).map(k => [k, obj[k]]),
  );

const literal = (src, name) => {
  const m = new RegExp(`var ${name} = ([\\[{][\\s\\S]*?[\\]}]);\\n`).exec(src);
  if (!m) throw new Error(`${name} not found`);
  return vm.runInNewContext(`(${m[1]})`);
};

try {
  const dir = process.argv[2];
  if (!dir) throw new Error('usage: strip-readings.mjs <public folder>');

  const html = readFileSync(join(dir, 'index.html'), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<ol[^>]*\bhidden\b[\s\S]*?<\/ol>/g, '');
  const paras = [...html.matchAll(/<p class="(lead|para)">([\s\S]*?)<\/p>/g)];
  if (!paras.length || paras[0][1] !== 'lead')
    throw new Error('article lead not found');

  const app = readFileSync(join(dir, 'app.js'), 'utf8');
  const steps = literal(app, 'STEPS');
  const tips = literal(app, 'TIPS');

  const sandbox = { window: {} };
  vm.runInNewContext(readFileSync(join(dir, 'ladder.js'), 'utf8'), sandbox);
  const L = sandbox.window.LADDER;
  if (!L || !Array.isArray(L.rungs)) throw new Error('ladder data not found');

  const readings = {
    article: {
      lead: segments(paras[0][2]),
      paras: paras.slice(1).map(p => segments(p[2])),
      board: { steps, tips },
    },
    ladder: {
      stages: L.stages.map(s => pick(s, ['id', 'label'])),
      tracks: pick(L.tracks, ['think', 'skill']),
      perspective: pick(L.perspective, ['was', 'think']),
      toolsLabel: L.toolsLabel,
      closing: L.closing,
      rungs: L.rungs.map(r =>
        pick(r, [
          'n',
          'stage',
          'title',
          'sub',
          'was',
          'think',
          'skill',
          'text',
          'tools',
        ]),
      ),
    },
  };
  writeFileSync(out, JSON.stringify(readings, null, 2) + '\n');
  Object.assign(record, {
    ok: true,
    paragraphs: paras.length,
    rungs: L.rungs.length,
    steps: steps.length,
  });
} catch (e) {
  Object.assign(record, { ok: false, error: String(e.message).slice(0, 300) });
  process.exitCode = 1;
}
mkdirSync(new URL('logs/', root), { recursive: true });
appendFileSync(journal, JSON.stringify(record) + '\n');
console.log(JSON.stringify(record));
