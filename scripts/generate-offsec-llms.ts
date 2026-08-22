// Generates the LLM-discovery artifacts for the Offensive Cybersecurity
// use case. The case content lives in this repo (src/uxcore/data/biasOffsec),
// not in Strapi, so unlike the article generators this script needs no
// network at all.
//
// Outputs:
//   public/llms-full-pages/uxcore-offsec/<slug>.md   one file per case (EN)
//   public/llms.txt                                   marked block with the
//                                                     hub + one line per case
//   public/llms-full.txt                              marked block with the
//                                                     full text of every case
//
// The llms.txt / llms-full.txt blocks are wrapped in marker comments and
// replaced idempotently, so the hand-curated parts of those files are never
// touched. Run: yarn generate:llms:offsec

import * as fs from 'fs/promises';
import * as path from 'path';

import { biases } from '../src/uxcore/data/biasList/biases';
import { getOffsecBiasContent } from '../src/uxcore/data/biasOffsec';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PAGES_DIR = path.join(PUBLIC_DIR, 'llms-full-pages', 'uxcore-offsec');
const SITE = 'https://keepsimple.io';

const START = '<!-- uxcore-offsec:start -->';
const END = '<!-- uxcore-offsec:end -->';

const slugToName = (slug: string) => {
  const words = slug.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const firstSentence = (text: string, cap = 180): string => {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  const dot = clean.indexOf('. ');
  const sentence = dot > 20 ? clean.slice(0, dot + 1) : clean;
  return sentence.length > cap ? `${sentence.slice(0, cap - 1)}…` : sentence;
};

const caseUrl = (slug: string) => `${SITE}/uxcore/cybersecurity/${slug}`;

function buildCaseMarkdown(id: number, slug: string): string | null {
  const content = getOffsecBiasContent(id, 'en');
  if (!content) return null;
  const lines: string[] = [];
  lines.push(`# ${slugToName(slug)} in Offensive Cybersecurity`);
  lines.push(`- URL: ${caseUrl(slug)}`);
  lines.push(`- Bias entry: ${SITE}/uxcore/${id}-${slug}`);
  lines.push(
    `- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.`,
  );
  lines.push('');
  if (content.tell) {
    lines.push(`## The tell`);
    lines.push(content.tell);
    lines.push('');
  }
  lines.push(`## Scenario`);
  lines.push(content.scenario);
  lines.push('');
  lines.push(`## Why it works`);
  lines.push(content.whyItWorks);
  lines.push('');
  lines.push(`## Defense`);
  lines.push(content.defense.lede);
  content.defense.moves.forEach(move => lines.push(`- ${move}`));
  lines.push('');
  return lines.join('\n');
}

async function replaceMarkedBlock(filePath: string, block: string) {
  let text = '';
  try {
    text = await fs.readFile(filePath, 'utf8');
  } catch {
    console.log(`  ✗ ${filePath} missing, skipped`);
    return;
  }
  const wrapped = `${START}\n${block}\n${END}`;
  const startIdx = text.indexOf(START);
  const endIdx = text.indexOf(END);
  if (startIdx >= 0 && endIdx > startIdx) {
    text = text.slice(0, startIdx) + wrapped + text.slice(endIdx + END.length);
  } else {
    text = `${text.replace(/\n+$/, '\n')}\n${wrapped}\n`;
  }
  await fs.writeFile(filePath, text, 'utf8');
  console.log(`  ✓ ${path.basename(filePath)} block updated`);
}

async function main() {
  console.log('=== generate-offsec-llms.ts ===\n');
  await fs.mkdir(PAGES_DIR, { recursive: true });

  const indexLines: string[] = [];
  const fullLines: string[] = [];
  let written = 0;

  indexLines.push('## UX Core Offensive Cybersecurity');
  indexLines.push(
    `- [Offensive Cybersecurity in UX Core](${SITE}/uxcore/cybersecurity): The third UX Core use case. Every cognitive bias shown as a realistic social-engineering attack and its defense: the tell, the scenario, why it works, and the defender moves. English, Russian, Armenian.`,
  );

  fullLines.push('# UX Core Offensive Cybersecurity');
  fullLines.push(
    `The third UX Core use case (${SITE}/uxcore/cybersecurity): every cognitive bias in UX Core rendered as a realistic social-engineering attack and its defense.`,
  );
  fullLines.push('');

  for (const entry of [...biases].sort((a, b) => a.id - b.id)) {
    const md = buildCaseMarkdown(entry.id, entry.slug);
    if (!md) continue;
    await fs.writeFile(path.join(PAGES_DIR, `${entry.slug}.md`), md, 'utf8');
    written++;

    const content = getOffsecBiasContent(entry.id, 'en');
    const summary = firstSentence(content.tell || content.scenario);
    indexLines.push(
      `- [${slugToName(entry.slug)} (OffSec case)](${caseUrl(entry.slug)}): ${summary}`,
    );

    fullLines.push(`## ${slugToName(entry.slug)}`);
    fullLines.push(`URL: ${caseUrl(entry.slug)}`);
    if (content.tell) fullLines.push(`The tell: ${content.tell}`);
    fullLines.push(`Scenario: ${content.scenario}`);
    fullLines.push(`Why it works: ${content.whyItWorks}`);
    fullLines.push(
      `Defense: ${content.defense.lede} Moves: ${content.defense.moves.join(' • ')}`,
    );
    fullLines.push('');
  }

  console.log(`[pages] wrote ${written} case files to ${PAGES_DIR}\n`);

  await replaceMarkedBlock(
    path.join(PUBLIC_DIR, 'llms.txt'),
    indexLines.join('\n'),
  );
  await replaceMarkedBlock(
    path.join(PUBLIC_DIR, 'llms-full.txt'),
    fullLines.join('\n'),
  );

  console.log('\n[done]');
}

main().catch(err => {
  console.error(`[fatal] ${(err as Error).message || err}`);
  process.exit(1);
});
