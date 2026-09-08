#!/usr/bin/env node
/**
 * Builds the self-hosted web fonts under public/fonts.
 *
 * Two jobs:
 *
 * 1. convert: lossless TTF -> WOFF2 written next to the source file. The TTF
 *    stays on disk because server code (the Library share thumbnail) reads it
 *    directly; only the CSS points at the WOFF2.
 *
 * 2. slice: split a large font into unicode-range slices so the browser only
 *    downloads the pieces a page renders. One "hot" slice carries every
 *    character the site is known to use (hot file + hot ranges); the rest of
 *    the font is chunked by code point, so a character added later costs one
 *    small extra download instead of the whole font. File names carry a
 *    content hash, so a rebuild never collides with long-lived caches.
 *    Output per font: <outDir>/<name>.<part>.<hash>.woff2, manifest.json and
 *    the SCSS partial with the @font-face rules.
 *
 * Usage:
 *   node scripts/fonts/build-webfonts.cjs          build everything
 *   node scripts/fonts/build-webfonts.cjs --check  verify outputs are current
 *
 * Tooling (wawoff2, subset-font, fontkit) is installed on first run into
 * $FONT_TOOLS_DIR (default: <tmpdir>/keepsimple-font-tools) so the app's
 * package.json stays free of build-only dependencies.
 *
 * Every run appends one line to scripts/fonts/journal.log (UTC).
 */

const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const JOURNAL = path.join(__dirname, 'journal.log');
const TOOLS_DIR =
  process.env.FONT_TOOLS_DIR || path.join(os.tmpdir(), 'keepsimple-font-tools');
const TOOLS = {
  wawoff2: 'wawoff2@2',
  'subset-font': 'subset-font@2',
  fontkit: 'fontkit@2',
};

/** TTFs that only need a lossless WOFF2 twin next to them. */
const CONVERT = [
  'public/fonts/Aldrich-Regular.ttf',
  'public/fonts/Tomorrow/Tomorrow-Light.ttf',
  'public/fonts/Tomorrow/Tomorrow-Regular.ttf',
  'public/fonts/Tomorrow/Tomorrow-Medium.ttf',
  'public/fonts/Jost/Jost-Regular.ttf',
  'public/fonts/Jost/Jost-Medium.ttf',
  'public/fonts/IBMPlexSans-Regular.ttf',
  'public/fonts/IBMPlexSans-SemiBold.ttf',
  'public/fonts/Aboreto-Regular.ttf',
  'public/fonts/Cormorant_Garamond/static/CormorantGaramond-Regular.ttf',
  'public/fonts/Cormorant_Garamond/static/CormorantGaramond-Medium.ttf',
  'public/fonts/Source-Serif-4/static/SourceSerif4-Regular.ttf',
  'public/fonts/Source-Serif-4/static/SourceSerif4-SemiBold.ttf',
  'public/fonts/Source-Serif-4/static/SourceSerif4-Bold.ttf',
  'public/fonts/biases/IBMPlexMono-Regular.ttf',
  'public/fonts/biases/RedHatDisplay.ttf',
  'public/fonts/Oswald-Bold.ttf',
  'public/fonts/Manrope-ExtraLight.ttf',
  'public/fonts/NotoSansArmenian/NotoSansArmenian-Regular.ttf',
];

/** Large fonts served as unicode-range slices. */
const SLICE = [
  {
    src: 'public/fonts/YujiSyuku-Regular.ttf',
    name: 'YujiSyuku-Regular',
    family: 'YujiSyuku-Regular',
    outDir: 'public/fonts/YujiSyuku',
    scss: 'src/styles/fonts/_yuji-syuku.scss',
    // Characters currently rendered with this face: tool names on the home
    // page, contributor letters and the Longevity page titles (Strapi field
    // "japanese title"). Regenerate with scripts/fonts/collect-hot-chars.md
    // when new Japanese copy lands; an unknown character still renders, it
    // just pulls one extra slice.
    hotFile: 'scripts/fonts/yuji-syuku.hot.txt',
    // CJK punctuation. Kana stay in the code-point slices: the current copy
    // is kanji, and a kana title would pull one slice rather than weigh down
    // every page with the whole syllabaries.
    hotRanges: [[0x3000, 0x303f]],
    sliceSize: 128,
  },
  {
    src: 'public/fonts/DelaGothicOne-Regular.ttf',
    name: 'DelaGothicOne-Regular',
    family: 'DelaGothicOne-Regular',
    outDir: 'public/fonts/DelaGothicOne',
    scss: 'src/styles/fonts/_dela-gothic-one.scss',
    // Renders the UX Core rank word (EN/RU) and "#<position>".
    hotRanges: [
      [0x20, 0x7e],
      [0xa0, 0xff],
      [0x400, 0x45f],
      [0x2000, 0x206f],
      [0x2116, 0x2116],
      [0x20ac, 0x20ac],
    ],
    sliceSize: 128,
  },
];

function loadTool(name) {
  const resolve = () => require(require.resolve(name, { paths: [TOOLS_DIR] }));
  try {
    return resolve();
  } catch (error) {
    fs.mkdirSync(TOOLS_DIR, { recursive: true });
    const specs = Object.values(TOOLS).join(' ');
    console.log(`installing font tooling into ${TOOLS_DIR}`);
    execSync(
      `npm install --prefix "${TOOLS_DIR}" --no-audit --no-fund --silent ${specs}`,
      { stdio: 'inherit' },
    );
    return resolve();
  }
}

const sha256 = buffer =>
  crypto.createHash('sha256').update(buffer).digest('hex');
const abs = rel => path.join(ROOT, rel);
const kb = bytes => `${(bytes / 1024).toFixed(1)} KB`;

function codePointsToRanges(codePoints) {
  const sorted = [...codePoints].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (const cp of sorted.slice(1)) {
    if (cp === prev + 1) {
      prev = cp;
      continue;
    }
    ranges.push([start, prev]);
    start = cp;
    prev = cp;
  }
  if (start !== undefined) ranges.push([start, prev]);
  const hex = cp => cp.toString(16).toUpperCase().padStart(4, '0');
  return ranges
    .map(([a, b]) => (a === b ? `U+${hex(a)}` : `U+${hex(a)}-${hex(b)}`))
    .join(', ');
}

async function convertAll(wawoff2, check) {
  const results = [];
  for (const rel of CONVERT) {
    const src = abs(rel);
    const out = src.replace(/\.ttf$/i, '.woff2');
    if (check) {
      if (!fs.existsSync(out)) throw new Error(`missing ${out}`);
      results.push({ rel, bytes: fs.statSync(out).size });
      continue;
    }
    const ttf = fs.readFileSync(src);
    const woff2 = Buffer.from(await wawoff2.compress(ttf));
    fs.writeFileSync(out, woff2);
    results.push({ rel, ttfBytes: ttf.length, bytes: woff2.length });
    console.log(
      `convert ${rel}: ${kb(ttf.length)} -> ${kb(woff2.length)} (${path.basename(out)})`,
    );
  }
  return results;
}

function readHotSet(spec) {
  const hot = new Set();
  if (spec.hotFile) {
    const text = fs.readFileSync(abs(spec.hotFile), 'utf8');
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      if (cp > 0x20) hot.add(cp);
    }
  }
  for (const [a, b] of spec.hotRanges || []) {
    for (let cp = a; cp <= b; cp += 1) hot.add(cp);
  }
  return hot;
}

async function sliceOne(spec, { fontkit, subsetFont }, check) {
  const src = abs(spec.src);
  const outDir = abs(spec.outDir);
  const manifestPath = path.join(outDir, 'manifest.json');
  const buffer = fs.readFileSync(src);
  const sourceHash = sha256(buffer);

  if (check) {
    if (!fs.existsSync(manifestPath))
      throw new Error(`missing ${manifestPath}`);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.sourceSha256 !== sourceHash) {
      throw new Error(`${spec.name}: source changed since the last build`);
    }
    for (const slice of manifest.slices) {
      if (!fs.existsSync(path.join(outDir, slice.file))) {
        throw new Error(`missing ${slice.file}`);
      }
    }
    if (!fs.existsSync(abs(spec.scss))) throw new Error(`missing ${spec.scss}`);
    return { name: spec.name, slices: manifest.slices.length };
  }

  const font = fontkit.create(buffer);
  const available = new Set(font.characterSet);
  const hotSet = readHotSet(spec);
  const hot = [...hotSet].filter(cp => available.has(cp)).sort((a, b) => a - b);
  const rest = [...available]
    .filter(cp => !hotSet.has(cp) && cp > 0x20)
    .sort((a, b) => a - b);

  const parts = [{ part: 'hot', codePoints: hot }];
  for (let i = 0; i < rest.length; i += spec.sliceSize) {
    parts.push({
      part: String(parts.length).padStart(2, '0'),
      codePoints: rest.slice(i, i + spec.sliceSize),
    });
  }

  fs.mkdirSync(outDir, { recursive: true });
  for (const stale of fs.readdirSync(outDir)) {
    if (stale.endsWith('.woff2')) fs.unlinkSync(path.join(outDir, stale));
  }

  const slices = [];
  let total = 0;
  for (const { part, codePoints } of parts) {
    const text = codePoints.map(cp => String.fromCodePoint(cp)).join('');
    const woff2 = await subsetFont(buffer, text, { targetFormat: 'woff2' });
    const hash = sha256(woff2).slice(0, 8);
    const file = `${spec.name}.${part}.${hash}.woff2`;
    fs.writeFileSync(path.join(outDir, file), woff2);
    total += woff2.length;
    slices.push({
      part,
      file,
      bytes: woff2.length,
      chars: codePoints.length,
      unicodeRange: codePointsToRanges(codePoints),
    });
  }

  const publicDir = `/${spec.outDir.replace(/^public\//, '')}`;
  const scss = [
    `// GENERATED by scripts/fonts/build-webfonts.cjs. Do not edit by hand.`,
    `// Source ${spec.src} (sha256 ${sourceHash.slice(0, 12)}), ${slices.length} slices,`,
    `// ${kb(total)} in total; a page downloads only the slices whose`,
    `// unicode-range it renders.`,
    '',
    ...slices.flatMap(slice => [
      '@font-face {',
      `  font-family: '${spec.family}';`,
      `  src: url('${publicDir}/${slice.file}') format('woff2');`,
      '  font-weight: 400;',
      '  font-style: normal;',
      '  font-display: swap;',
      `  unicode-range: ${slice.unicodeRange};`,
      '}',
      '',
    ]),
  ].join('\n');
  fs.mkdirSync(path.dirname(abs(spec.scss)), { recursive: true });
  fs.writeFileSync(abs(spec.scss), scss);

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: spec.src,
    sourceSha256: sourceHash,
    sourceBytes: buffer.length,
    family: spec.family,
    sliceSize: spec.sliceSize,
    totalBytes: total,
    slices,
  };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(
    `slice ${spec.name}: ${kb(buffer.length)} -> ${slices.length} slices, ${kb(total)} total, hot ${kb(slices[0].bytes)} (${slices[0].chars} chars)`,
  );
  return { name: spec.name, slices: slices.length, hotBytes: slices[0].bytes };
}

async function main() {
  const check = process.argv.includes('--check');
  const startedAt = new Date();
  const wawoff2 = check ? null : loadTool('wawoff2');
  const tools = check
    ? {}
    : { fontkit: loadTool('fontkit'), subsetFont: loadTool('subset-font') };

  let outcome = 'ok';
  let summary = '';
  try {
    const converted = await convertAll(wawoff2, check);
    const sliced = [];
    for (const spec of SLICE) sliced.push(await sliceOne(spec, tools, check));
    summary = `convert=${converted.length} slice=${sliced
      .map(s => `${s.name}:${s.slices}`)
      .join(',')}`;
  } catch (error) {
    outcome = `error ${error.message}`;
    throw error;
  } finally {
    const line = `${startedAt.toISOString()} mode=${check ? 'check' : 'build'} outcome=${outcome} ${summary} durationMs=${Date.now() - startedAt.getTime()}\n`;
    fs.appendFileSync(JOURNAL, line);
  }
  console.log(check ? 'web fonts are current' : 'web fonts built');
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
