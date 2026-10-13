/* The Atlas for answer engines and AI assistants.

     node scripts/ai-atlas/generate-llms.mjs          write
     node scripts/ai-atlas/generate-llms.mjs --check  exit 1 when stale

   Writes the Thesis and the Ladder as Markdown, in English and Russian, to
   public/llms-full-pages/ai-atlas/, and keeps an Atlas section in
   public/llms.txt (links) and public/llms-full.txt (the full English text)
   between ai-atlas markers. Everything comes from the texts the pages draw
   (readings.json, readings.ru.json, copy.json, ru.json), so run it after
   any change to them. The rest of both llms files is left as it is. One
   journal line per run in logs/ai-atlas-llms.jsonl. */
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const ORIGIN = 'https://keepsimple.io';
const CHECK = process.argv.includes('--check');
const START = '<!-- ai-atlas:start -->';
const END = '<!-- ai-atlas:end -->';

const json = f => JSON.parse(readFileSync(path.join(ROOT, f), 'utf8'));
const LANGS = {
  en: {
    prefix: '',
    readings: json('src/lib/aiAtlas/readings.json'),
    copy: json('src/lib/aiAtlas/copy.json'),
    mapName: 'The map',
  },
  ru: {
    prefix: '/ru',
    readings: json('src/lib/aiAtlas/readings.ru.json'),
    copy: json('src/lib/aiAtlas/ru.json').copy,
    mapName: 'Карта',
  },
};
const runs = rs => rs.map(r => (r.m === 'key' ? `**${r.t}**` : r.t)).join('');
const plain = rs => rs.map(r => r.t).join('');

const pageUrl = (lang, p) => `${ORIGIN}${LANGS[lang].prefix}${p}`;
const mdUrl = (lang, name) =>
  `${ORIGIN}/llms-full-pages/ai-atlas/${lang === 'en' ? '' : `${lang}/`}${name}.md`;

function thesisMd(lang) {
  const { readings, copy } = LANGS[lang];
  const { lead, paras } = readings.article;
  return [
    `# ${copy.seoTitleThesis}`,
    '',
    `Source: ${pageUrl(lang, '/ai-atlas/thesis')}`,
    'Author: Wolf Alexanyan',
    '',
    `> ${plain(lead)}`,
    '',
    ...paras.flatMap(p => [runs(p), '']),
  ].join('\n');
}

function ladderMd(lang) {
  const { readings, copy } = LANGS[lang];
  const { stages, perspective, tracks, toolsLabel, closing, rungs } =
    readings.ladder;
  const out = [
    `# ${copy.seoTitleLadder}`,
    '',
    `Source: ${pageUrl(lang, '/ai-atlas/ladder')}`,
    'Author: Wolf Alexanyan',
    '',
    copy.seoDescriptionLadder,
    '',
  ];
  for (const stage of stages) {
    out.push(`## ${stage.label}`, '');
    for (const r of rungs.filter(x => x.stage === stage.id)) {
      out.push(`### ${r.n}. ${r.title}`, '', `_${r.sub}_`, '');
      if (r.was) out.push(`- ${perspective.was}: ${r.was}`);
      if (r.think) out.push(`- ${perspective.think}: ${r.think}`);
      if (r.skill) out.push(`- ${tracks.skill}: ${r.skill}`);
      if (r.was || r.think || r.skill) out.push('');
      for (const t of r.text || []) out.push(t, '');
      if (r.tools?.length)
        out.push(`${toolsLabel}:`, '', ...r.tools.map(t => `- ${t}`), '');
    }
  }
  out.push(closing, '');
  return out.join('\n');
}

function indexBlock() {
  const en = LANGS.en.copy;
  const ru = LANGS.ru.copy;
  return [
    START,
    '## AI Atlas: learning to work with AI agents',
    '',
    `- [${en.seoTitle}](${pageUrl('en', '/ai-atlas')}): ${en.seoDescription}`,
    `- [${en.seoTitleThesis}](${pageUrl('en', '/ai-atlas/thesis')}): ${en.seoDescriptionThesis} Markdown: ${mdUrl('en', 'thesis')}`,
    `- [${en.seoTitleLadder}](${pageUrl('en', '/ai-atlas/ladder')}): ${en.seoDescriptionLadder} Markdown: ${mdUrl('en', 'ladder')}`,
    `- [${ru.seoTitle}](${pageUrl('ru', '/ai-atlas')}): ${ru.seoDescription}`,
    `- [${ru.seoTitleThesis}](${pageUrl('ru', '/ai-atlas/thesis')}): ${ru.seoDescriptionThesis} Markdown: ${mdUrl('ru', 'thesis')}`,
    `- [${ru.seoTitleLadder}](${pageUrl('ru', '/ai-atlas/ladder')}): ${ru.seoDescriptionLadder} Markdown: ${mdUrl('ru', 'ladder')}`,
    END,
  ].join('\n');
}

function fullBlock() {
  const demote = md => md.replace(/^(#+) /gm, '#$1 ');
  return [
    indexBlock().replace(END, ''),
    demote(thesisMd('en')),
    demote(ladderMd('en')),
    END,
  ].join('\n');
}

/* Insert the block after the file's opening title and summary, or replace
   the block a previous run left. */
function withBlock(text, block) {
  if (text.includes(START) && text.includes(END)) {
    const a = text.indexOf(START);
    const b = text.indexOf(END) + END.length;
    return text.slice(0, a) + block + text.slice(b);
  }
  const at = text.indexOf('\n## ');
  if (at === -1) return `${text.trimEnd()}\n\n${block}\n`;
  return `${text.slice(0, at).trimEnd()}\n\n${block}\n${text.slice(at)}`;
}

const pagesDir = path.join(ROOT, 'public', 'llms-full-pages', 'ai-atlas');
const targets = [
  [path.join(pagesDir, 'thesis.md'), () => thesisMd('en')],
  [path.join(pagesDir, 'ladder.md'), () => ladderMd('en')],
  [path.join(pagesDir, 'ru', 'thesis.md'), () => thesisMd('ru')],
  [path.join(pagesDir, 'ru', 'ladder.md'), () => ladderMd('ru')],
  [path.join(ROOT, 'public', 'llms.txt'), old => withBlock(old, indexBlock())],
  [
    path.join(ROOT, 'public', 'llms-full.txt'),
    old => withBlock(old, fullBlock()),
  ],
];

const stale = [];
for (const [file, make] of targets) {
  const old = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const next = make(old);
  if (next === old) continue;
  stale.push(path.relative(ROOT, file));
  if (!CHECK) {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, next);
  }
}

mkdirSync(path.join(ROOT, 'logs'), { recursive: true });
appendFileSync(
  path.join(ROOT, 'logs', 'ai-atlas-llms.jsonl'),
  JSON.stringify({
    at: new Date().toISOString(),
    mode: CHECK ? 'check' : 'write',
    changed: stale,
  }) + '\n',
);

if (CHECK && stale.length) {
  console.error(`Atlas llms files are stale: ${stale.join(', ')}`);
  process.exit(1);
}
console.log(
  stale.length
    ? `${CHECK ? 'stale' : 'wrote'}: ${stale.join(', ')}`
    : 'Atlas llms files are current',
);
