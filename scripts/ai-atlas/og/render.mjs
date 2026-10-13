/* Share thumbnails for the three Atlas pages, in English and Russian.

     node scripts/ai-atlas/og/render.mjs

   Renders 1200x630 PNGs into public/ai-atlas/ with headless Chromium, in the
   Atlas palette and its own fonts. The words come from the Atlas texts
   (readings.json, readings.ru.json), so a thumbnail never says what the
   page does not. Static files are cached for thirty days: when a picture
   changes, bump VERSION so the new one gets a new name. One journal line per
   run in logs/ai-atlas-og.jsonl.

   motion-passport: exempt, the output is a still PNG; the only transform
   rotates a square into a diamond and nothing moves. */
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from 'playwright';

const VERSION = 'v2';
const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);
const OUT = path.join(ROOT, 'public', 'ai-atlas');
const font = f => pathToFileURL(path.join(ROOT, 'public', f)).href;

const readings = {
  en: JSON.parse(
    readFileSync(path.join(ROOT, 'src/lib/aiAtlas/readings.json'), 'utf8'),
  ),
  ru: JSON.parse(
    readFileSync(path.join(ROOT, 'src/lib/aiAtlas/readings.ru.json'), 'utf8'),
  ),
};
const runs = rs => rs.map(r => r.t).join('');

/* The one sentence of the Thesis that carries it, as written. */
const thesisLine = {
  en: runs(readings.en.article.paras[2]).replace(/^So today/, 'Today'),
  ru: runs(readings.ru.article.paras[2]).replace(/^Поэтому сегодня/, 'Сегодня'),
};
const rungCount = readings.en.ladder.rungs.length;
const soloCount = readings.en.ladder.rungs.filter(
  r => r.stage === 'solo',
).length;

const WORDS = {
  en: {
    site: 'KEEPSIMPLE · AI ATLAS',
    atlasTitle: 'AI · ATLAS',
    atlasSub: 'How one person runs a team of AI agents',
    thesisLabel: 'Thesis',
    ladderLabel: 'The Ladder',
    ladderTitle: `${rungCount} rungs from chat to a system of agents`,
    stages: ['I · Solo', 'II · Orchestration'],
    author: 'Wolf Alexanyan',
  },
  ru: {
    site: 'KEEPSIMPLE · AI АТЛАС',
    atlasTitle: 'AI · АТЛАС',
    atlasSub: 'Как один человек руководит командой ИИ-агентов',
    thesisLabel: 'Тезис',
    ladderLabel: 'Лестница',
    ladderTitle: `${rungCount} ступеней от чата до системы агентов`,
    stages: ['I · Соло', 'II · Оркестрация'],
    author: 'Wolf Alexanyan',
  },
};

const base = `
@font-face { font-family: 'EB Garamond'; font-weight: 400; src: url(${font('ai-atlas/font-2.woff2')}); }
@font-face { font-family: 'EB Garamond'; font-weight: 500; src: url(${font('ai-atlas/font-3.woff2')}); }
@font-face { font-family: 'EB Garamond'; font-style: italic; font-weight: 400; src: url(${font('ai-atlas/font-0.woff2')}); }
@font-face { font-family: 'JetBrains Mono'; font-weight: 400; src: url(${font('ai-atlas/font-4.woff2')}); }
@font-face { font-family: 'JetBrains Mono'; font-weight: 500; src: url(${font('ai-atlas/font-5.woff2')}); }
@font-face { font-family: 'Kanji'; src: url(${font('fonts/YujiSyuku-Regular.ttf')}); }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 630px; }
body {
  position: relative; overflow: hidden;
  background: #ece4cf; color: #1a1a1a;
  font-family: 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
}
.corner { position: absolute; width: 30px; height: 30px; border: 0 solid #2a2a2a; }
.tl { top: 22px; left: 22px; border-top-width: 1px; border-left-width: 1px; }
.tr { top: 22px; right: 22px; border-top-width: 1px; border-right-width: 1px; }
.bl { bottom: 22px; left: 22px; border-bottom-width: 1px; border-left-width: 1px; }
.br { bottom: 22px; right: 22px; border-bottom-width: 1px; border-right-width: 1px; }
.ring { position: absolute; border-radius: 50%; border: 1px solid rgba(42, 42, 42, 0.22); }
.dmd { display: inline-block; width: 18px; height: 18px; transform: rotate(45deg); background: #b3392b; }
.dmd.gold { background: #c08a2c; } .dmd.blue { background: #4a6f99; }
.site { position: absolute; top: 44px; left: 72px; font-size: 14px; letter-spacing: 0.32em; color: #6a6457; }
.water { position: absolute; font-family: 'Kanji', serif; color: rgba(42, 42, 42, 0.07); line-height: 1; }
.kanji { font-family: 'Kanji', serif; color: #b3392b; line-height: 1; }
.label { display: flex; align-items: center; gap: 18px; font-size: 18px; letter-spacing: 0.32em; text-transform: uppercase; color: #b3392b; }
.label .dmd { width: 12px; height: 12px; }
.serif { font-family: 'EB Garamond', serif; }
.author { font-size: 14px; letter-spacing: 0.32em; text-transform: uppercase; color: #6a6457; }
`;

const frame = (
  inner,
  extraCss = '',
) => `<!doctype html><html><head><meta charset="utf-8">
<style>${base}${extraCss}</style></head><body>
<span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
${inner}</body></html>`;

const rings = (cx, cy, radii) =>
  radii
    .map(
      r =>
        `<span class="ring" style="left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px"></span>`,
    )
    .join('');

const atlas = w =>
  frame(
    `${rings(600, 300, [110, 190, 275, 370])}
     <span class="water" style="right:56px;bottom:30px;font-size:200px">図</span>
     <div class="stack">
       <div class="kanji" style="font-size:150px">天</div>
       <div class="title"><span class="dmd"></span><span class="serif">${w.atlasTitle}</span><span class="dmd"></span></div>
       <div class="sub">${w.atlasSub}</div>
       <div class="dots"><span class="dmd gold"></span><span class="dmd blue"></span><span class="dmd"></span></div>
     </div>`,
    `.stack { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; }
     .title { display: flex; align-items: center; gap: 44px; }
     .title .serif { font-size: 76px; font-weight: 500; letter-spacing: 0.18em; padding-left: 0.18em; }
     .sub { font-size: 22px; letter-spacing: 0.24em; text-transform: uppercase; color: #3d3a33; }
     .dots { display: flex; gap: 26px; margin-top: 6px; }
     .dots .dmd { width: 14px; height: 14px; }`,
  );

const thesis = (w, line) =>
  frame(
    `<div class="site">${w.site}</div>
     <span class="water" style="right:40px;top:120px;font-size:420px">論</span>
     <div class="body">
       <div class="label"><span class="dmd"></span>${w.thesisLabel}</div>
       <p class="serif quote">${line}</p>
       <div class="author">${w.author}</div>
     </div>`,
    `.body { position: absolute; left: 72px; right: 300px; top: 118px; bottom: 64px; display: flex; flex-direction: column; justify-content: space-between; }
     .quote { font-size: 48px; line-height: 1.18; font-weight: 400; }`,
  );

const ladder = w => {
  const STEP_W = 30;
  const STEP_H = 19;
  const steps = Array.from({ length: rungCount }, (_, i) => {
    const last = i === rungCount - 1;
    const solo = i < soloCount;
    const cls = last ? 'step open' : solo ? 'step solo' : 'step orch';
    return `<span class="${cls}" style="left:${i * STEP_W}px;height:${(i + 1) * STEP_H}px"></span>`;
  }).join('');
  return frame(
    `<div class="site">${w.site}</div>
     <span class="water" style="right:330px;top:40px;font-size:300px">梯</span>
     <div class="body">
       <div class="label"><span class="dmd"></span>${w.ladderLabel}</div>
       <p class="serif title">${w.ladderTitle}</p>
       <div class="author">${w.author}</div>
     </div>
     <div class="stairs" style="width:${rungCount * STEP_W}px;height:${rungCount * STEP_H}px">${steps}
       <span class="stage" style="left:0">${w.stages[0]}</span>
       <span class="stage" style="left:${soloCount * STEP_W}px">${w.stages[1]}</span>
     </div>`,
    `.body { position: absolute; left: 72px; width: 560px; top: 118px; bottom: 64px; display: flex; flex-direction: column; justify-content: space-between; }
     .title { font-size: 48px; line-height: 1.15; font-weight: 400; }
     .stairs { position: absolute; right: 80px; bottom: 120px; }
     .step { position: absolute; bottom: 0; width: 26px; }
     .step.solo { background: #1a1a1a; }
     .step.orch { background: #b3392b; }
     .step.open { border: 1px dashed #b3392b; background: transparent; }
     .stage { position: absolute; top: calc(100% + 18px); font-size: 14px; letter-spacing: 0.24em; text-transform: uppercase; color: #3d3a33; white-space: nowrap; }`,
  );
};

const pages = [];
for (const lang of ['en', 'ru']) {
  const w = WORDS[lang];
  pages.push([`og-atlas-${lang}-${VERSION}.png`, atlas(w)]);
  pages.push([`og-thesis-${lang}-${VERSION}.png`, thesis(w, thesisLine[lang])]);
  pages.push([`og-ladder-${lang}-${VERSION}.png`, ladder(w)]);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const written = [];
try {
  for (const [name, html] of pages) {
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, name), type: 'png' });
    written.push(name);
  }
} finally {
  await browser.close();
  mkdirSync(path.join(ROOT, 'logs'), { recursive: true });
  appendFileSync(
    path.join(ROOT, 'logs', 'ai-atlas-og.jsonl'),
    JSON.stringify({
      at: new Date().toISOString(),
      version: VERSION,
      written,
    }) + '\n',
  );
}
console.log(`wrote ${written.length} thumbnails: ${written.join(', ')}`);
