#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Optional background texture. If the host project provides a path via the
// QA_LINKS_TEXTURE env var, we'll load it; otherwise the report renders
// without a texture (cleaner default for generic projects).
const TEXTURE_PATH = process.env.QA_LINKS_TEXTURE
  ? path.resolve(process.env.QA_LINKS_TEXTURE)
  : null;
const REPORTS_DIR = path.resolve(process.cwd(), 'reports');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadTextureDataUri() {
  if (!TEXTURE_PATH) return null;
  try {
    const buf = fs.readFileSync(TEXTURE_PATH);
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

function findLatestLinksReport() {
  if (!fs.existsSync(REPORTS_DIR)) return null;
  const files = fs
    .readdirSync(REPORTS_DIR)
    .filter(f => /^links-\d{4}-\d{2}-\d{2}.*\.json$/.test(f))
    .sort();
  return files.length ? path.join(REPORTS_DIR, files[files.length - 1]) : null;
}

function severityForStatus(status, state) {
  if (state === 'SKIPPED') return 'low';
  if (state === 'OK' || (status >= 200 && status < 400)) return 'ok';
  if (status >= 500) return 'critical';
  if (status === 404 || status === 410) return 'high';
  if (status >= 400) return 'medium';
  return 'low';
}

function statusLabel(link) {
  if (link.state === 'SKIPPED') return 'skipped';
  if (link.state === 'OK') return String(link.status || 200);
  if (link.status === 0 || link.status == null) return 'error';
  return String(link.status);
}

function groupBy(arr, keyFn) {
  const out = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    if (!out.has(key)) out.set(key, []);
    out.get(key).push(item);
  }
  return out;
}

function renderLinkCard(link) {
  const sev = severityForStatus(link.status, link.state);
  const label = statusLabel(link);
  const failureDetail =
    Array.isArray(link.failureDetails) && link.failureDetails.length
      ? link.failureDetails
          .map(d => {
            if (typeof d === 'string') return d;
            if (d && d.message) return d.message;
            if (d && d.headers && d.responseUrl)
              return `responseUrl: ${d.responseUrl}`;
            try {
              return JSON.stringify(d);
            } catch {
              return String(d);
            }
          })
          .join('\n')
      : '';
  const parentList = Array.isArray(link.parent)
    ? link.parent
    : link.parent
      ? [link.parent]
      : [];

  return `
<article class="finding finding--${escapeHtml(sev)}">
  <header class="finding__head">
    <span class="badge badge--${escapeHtml(sev)}">${escapeHtml(label)}</span>
    <span class="finding__cat">${escapeHtml(link.state || '')}</span>
  </header>
  <h3 class="finding__summary"><a href="${escapeHtml(link.url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(link.url)}</a></h3>
  <dl class="finding__meta">
    <dt>Status</dt><dd>${escapeHtml(label)}</dd>
    <dt>State</dt><dd>${escapeHtml(link.state || '')}</dd>
    ${parentList.length ? `<dt>Found on</dt><dd>${parentList.map(p => `<code>${escapeHtml(p)}</code>`).join('<br>')}</dd>` : ''}
  </dl>
  ${failureDetail ? `<details class="finding__details" open><summary>Failure detail</summary><pre class="finding__body">${escapeHtml(failureDetail)}</pre></details>` : ''}
</article>`;
}

function renderSummaryTable(stats) {
  const rows = [
    ['ok', stats.ok],
    ['broken (4xx)', stats.broken4xx],
    ['broken (5xx)', stats.broken5xx],
    ['error / network', stats.error],
    ['skipped', stats.skipped],
    ['total', stats.total],
  ];
  return `
<div class="table-wrap">
<table>
  <thead><tr><th>Bucket</th><th>Count</th></tr></thead>
  <tbody>
    ${rows
      .map(([label, count]) => {
        const cls =
          label === 'ok'
            ? 'badge--ok'
            : label.startsWith('broken (5')
              ? 'badge--critical'
              : label.startsWith('broken (4')
                ? 'badge--high'
                : label.startsWith('error')
                  ? 'badge--medium'
                  : label === 'skipped'
                    ? 'badge--low'
                    : '';
        const cell = cls
          ? `<span class="badge ${cls}">${escapeHtml(label)}</span>`
          : escapeHtml(label);
        return `<tr><td>${cell}</td><td class="count">${escapeHtml(String(count))}</td></tr>`;
      })
      .join('')}
  </tbody>
</table>
</div>`;
}

function renderStatusBreakdown(byStatus) {
  if (!byStatus.size) return '';
  const sorted = Array.from(byStatus.entries()).sort(
    (a, b) => Number(b[0]) - Number(a[0]),
  );
  return `
<div class="table-wrap">
<table>
  <thead><tr><th>Status</th><th>Count</th></tr></thead>
  <tbody>
    ${sorted
      .map(
        ([status, links]) =>
          `<tr><td><code>${escapeHtml(String(status))}</code></td><td class="count">${links.length}</td></tr>`,
      )
      .join('')}
  </tbody>
</table>
</div>`;
}

function renderParentBreakdown(byParent, brokenSet) {
  if (!byParent.size) return '';
  const rows = Array.from(byParent.entries())
    .map(([parent, links]) => {
      const brokenHere = links.filter(l => brokenSet.has(l)).length;
      return { parent, total: links.length, broken: brokenHere };
    })
    .filter(r => r.broken > 0)
    .sort((a, b) => b.broken - a.broken);

  if (!rows.length) return '<p>No pages contained broken links.</p>';

  return `
<div class="table-wrap">
<table>
  <thead><tr><th>Page</th><th>Broken links</th><th>Total links checked</th></tr></thead>
  <tbody>
    ${rows.map(r => `<tr><td><code>${escapeHtml(r.parent || '(root)')}</code></td><td class="count">${r.broken}</td><td class="count">${r.total}</td></tr>`).join('')}
  </tbody>
</table>
</div>`;
}

function renderHtml({ data, sourceName, textureUri, generated }) {
  const links = Array.isArray(data.links) ? data.links : [];
  const broken = links.filter(l => l.state === 'BROKEN');
  const skipped = links.filter(l => l.state === 'SKIPPED');
  const ok = links.filter(l => l.state === 'OK');

  const stats = {
    total: links.length,
    ok: ok.length,
    skipped: skipped.length,
    broken4xx: broken.filter(l => l.status >= 400 && l.status < 500).length,
    broken5xx: broken.filter(l => l.status >= 500).length,
    error: broken.filter(l => !l.status || l.status < 400).length,
    broken: broken.length,
  };

  const byStatus = groupBy(
    broken.filter(l => l.status),
    l => l.status,
  );
  const byParent = groupBy(
    links,
    l => (Array.isArray(l.parent) ? l.parent[0] : l.parent) || '(root)',
  );
  const brokenSet = new Set(broken);

  const passed = data.passed === true;
  const overallSev = passed
    ? 'ok'
    : stats.broken5xx
      ? 'critical'
      : stats.broken4xx
        ? 'high'
        : 'medium';
  const overallLabel = passed
    ? 'all links ok'
    : `${stats.broken} broken link${stats.broken === 1 ? '' : 's'}`;

  const cardsHtml = broken.length
    ? broken
        .sort((a, b) => (b.status || 0) - (a.status || 0))
        .map(renderLinkCard)
        .join('\n')
    : '<p>No broken links — all reachable URLs returned 2xx/3xx.</p>';

  const skippedHtml = skipped.length
    ? `
<div class="table-wrap">
<table>
  <thead><tr><th>Skipped URL</th></tr></thead>
  <tbody>
    ${skipped
      .slice(0, 200)
      .map(l => `<tr><td><code>${escapeHtml(l.url)}</code></td></tr>`)
      .join('')}
  </tbody>
</table>
</div>
${skipped.length > 200 ? `<p class="muted">Showing first 200 of ${skipped.length} skipped URLs.</p>` : ''}`
    : '<p>No URLs were skipped by the configured patterns.</p>';

  // Optional page texture (loaded from QA_LINKS_TEXTURE env var if set)
  const pageTextureCss = textureUri
    ? `body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url('${textureUri}');
    background-repeat: repeat;
    background-size: 400px auto;
    pointer-events: none;
    z-index: 1;
  }`
    : '';

  // Card-level texture at 0.75 opacity (same rule as render-report.js)
  const cardTextureCss = textureUri
    ? `.finding::after, .summary-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('${textureUri}');
    background-repeat: repeat;
    background-size: 400px auto;
    pointer-events: none;
    z-index: 0;
    opacity: 0.75;
  }`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Link Check Report</title>
<style>
  :root {
    --bg-base: #ede8df;
    --bg-card: #f5f1ea;
    --bg-card-active: #faf6ef;

    --text-primary: #1c1c1a;
    --text-secondary: #5c5650;
    --text-tertiary: #8a8480;

    --accent: #b83232;
    --accent-light: #d4504a;

    --border: #ddd7ce;
    --border-strong: #c8c0b5;

    /* Severity / status palette */
    --sev-crit-fg:  #8a1f1f;
    --sev-crit-bg:  #f3dcd7;
    --sev-crit-bd:  #d49b94;
    --sev-high-fg:  #a73a1f;
    --sev-high-bg:  #f3e1d3;
    --sev-high-bd:  #d4a487;
    --sev-med-fg:   #8a6d2c;
    --sev-med-bg:   #ece2c8;
    --sev-med-bd:   #c9b884;
    --sev-low-fg:   #5c5650;
    --sev-low-bg:   #e6dfd2;
    --sev-low-bd:   #c0b8a8;
    --sev-ok-fg:    #355a3a;
    --sev-ok-bg:    #d8e4d2;
    --sev-ok-bd:    #94a98a;

    --font-display: Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, 'URW Palladio L', serif;
    --font-body: Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, serif;
    --font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, 'Helvetica Neue', Arial, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;

    --text-base: 1rem;
    --text-sm: 0.875rem;
    --text-caps: 0.75rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: clamp(1.75rem, 3vw, 2.5rem);
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { font-size: 16px; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-base);
    line-height: 1.7;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  ${pageTextureCss}

  .page-wrapper {
    position: relative;
    z-index: 2;
    max-width: 900px;
    margin: 0 auto;
    padding: 64px 32px 96px;
  }

  .page-heading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
    text-align: center;
  }
  .page-heading .diamond { color: var(--accent); font-size: 1.25rem; line-height: 1; }
  .page-title {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.2;
  }
  .page-subtitle {
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    text-align: center;
    margin: 0 0 2.5rem;
  }

  .accent-rule { width: 2.5rem; height: 2px; background: var(--accent); margin: 3rem 0 0.75rem; }
  h2 {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-primary);
    margin: 0 0 1rem;
    line-height: 1.3;
  }
  h3 {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-primary);
    margin: 1.5rem 0 0.6rem;
  }

  p { margin: 0.6rem 0; color: var(--text-secondary); font-size: var(--text-base); }
  p.muted { color: var(--text-tertiary); font-size: var(--text-sm); }
  a { color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--accent); word-break: break-all; }
  a:hover { color: var(--accent-light); border-bottom-color: var(--accent-light); }

  code {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 1px 6px;
    border: 1px solid var(--border);
    border-radius: 2px;
    word-break: break-all;
  }
  pre {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 14px 16px;
    overflow-x: auto;
    font-size: var(--text-sm);
    margin: 1rem 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  pre code { background: transparent; border: 0; padding: 0; font-size: inherit; }

  .meta {
    margin: 0 auto 2.25rem;
    padding: 1.5rem 1.75rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem 2rem;
    position: relative;
  }
  .meta__item { display: flex; flex-direction: column; gap: 0.25rem; margin: 0; }
  .meta__item dt {
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .meta__item dd {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--text-primary);
    line-height: 1.5;
  }

  .table-wrap {
    overflow-x: auto;
    margin: 1rem 0 1.5rem;
    border: 1px solid var(--border);
    background: var(--bg-card);
  }
  table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); font-family: var(--font-ui); }
  th, td {
    padding: 0.7rem 1rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
  }
  thead th {
    background: var(--bg-card-active);
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-strong);
  }
  tbody tr:last-child td { border-bottom: 0; }
  td.count {
    font-family: var(--font-display);
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    color: var(--text-primary);
    font-size: var(--text-base);
  }

  .badge {
    display: inline-block;
    padding: 0.15rem 0.65rem;
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    line-height: 1.5;
    border: 1px solid transparent;
    background: transparent;
  }
  .badge--critical { background: var(--sev-crit-bg); color: var(--sev-crit-fg); border-color: var(--sev-crit-bd); }
  .badge--high     { background: var(--sev-high-bg); color: var(--sev-high-fg); border-color: var(--sev-high-bd); }
  .badge--medium   { background: var(--sev-med-bg);  color: var(--sev-med-fg);  border-color: var(--sev-med-bd); }
  .badge--low      { background: var(--sev-low-bg);  color: var(--sev-low-fg);  border-color: var(--sev-low-bd); }
  .badge--ok       { background: var(--sev-ok-bg);   color: var(--sev-ok-fg);   border-color: var(--sev-ok-bd); }

  .finding {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--text-tertiary);
    padding: 1.5rem 1.75rem 1.25rem;
    margin: 1.25rem 0;
    overflow: hidden;
    z-index: 2;
  }
  ${cardTextureCss}
  .finding > * { position: relative; z-index: 1; }
  .finding--critical { border-left-color: var(--accent); }
  .finding--high     { border-left-color: var(--accent-light); }
  .finding--medium   { border-left-color: var(--sev-med-fg); }
  .finding--low      { border-left-color: var(--sev-low-fg); }
  .finding--ok       { border-left-color: var(--sev-ok-fg); }

  .finding__head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
  .finding__cat {
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-secondary);
    padding: 0.15rem 0.55rem;
    border: 1px solid var(--border-strong);
    background: var(--bg-base);
  }
  .finding__summary {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--text-primary);
    line-height: 1.4;
    margin: 0.4rem 0 0.9rem;
    word-break: break-all;
  }
  .finding__summary a { border-bottom-color: transparent; }
  .finding__summary a:hover { border-bottom-color: var(--accent-light); }

  .finding__meta {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem 1.25rem;
    margin: 0 0 0.9rem;
    padding: 0.75rem 1rem;
    background: var(--bg-base);
    border: 1px solid var(--border);
    font-size: var(--text-sm);
  }
  .finding__meta dt {
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    align-self: center;
  }
  .finding__meta dd { margin: 0; font-family: var(--font-body); color: var(--text-primary); }

  .finding__details { margin: 0.5rem 0; border-top: 1px solid var(--border); padding-top: 0.5rem; }
  .finding__details summary {
    cursor: pointer;
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    padding: 0.25rem 0;
    user-select: none;
    list-style: none;
  }
  .finding__details summary::-webkit-details-marker { display: none; }
  .finding__details summary::before { content: '◇'; color: var(--accent); margin-right: 0.5rem; font-size: 0.9em; }
  .finding__details[open] summary::before { content: '◆'; }
  .finding__details summary:hover { color: var(--accent-light); }
  .finding__body {
    padding: 0.5rem 0 0.25rem;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .doc-footer {
    margin-top: 4.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border-strong);
    font-family: var(--font-ui);
    font-size: var(--text-caps);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .doc-footer code { font-family: var(--font-mono); text-transform: none; letter-spacing: 0; }

  @media (max-width: 600px) {
    .page-wrapper { padding: 36px 18px 64px; }
    .page-title { letter-spacing: 0.12em; }
  }
</style>
</head>
<body>
<main class="page-wrapper">
  <div class="page-heading">
    <span class="diamond" aria-hidden="true">◇</span>
    <h1 class="page-title">Link Check Report</h1>
    <span class="diamond" aria-hidden="true">◇</span>
  </div>
  <p class="page-subtitle">linkinator</p>
  <dl class="meta">
    <div class="meta__item"><dt>Source</dt><dd><code>${escapeHtml(sourceName)}</code></dd></div>
    <div class="meta__item"><dt>Generated</dt><dd>${escapeHtml(generated)}</dd></div>
    <div class="meta__item"><dt>Overall</dt><dd><span class="badge badge--${overallSev}">${escapeHtml(overallLabel)}</span></dd></div>
    <div class="meta__item"><dt>Total links</dt><dd>${stats.total}</dd></div>
  </dl>

  <div class="accent-rule"></div><h2>Summary</h2>
  ${renderSummaryTable(stats)}

  <div class="accent-rule"></div><h2>Status code breakdown (broken)</h2>
  ${byStatus.size ? renderStatusBreakdown(byStatus) : '<p>No broken links recorded.</p>'}

  <div class="accent-rule"></div><h2>Pages with broken links</h2>
  ${renderParentBreakdown(byParent, brokenSet)}

  <div class="accent-rule"></div><h2>Broken links</h2>
  ${cardsHtml}

  <div class="accent-rule"></div><h2>Skipped URLs</h2>
  ${skippedHtml}

  <footer class="doc-footer">
    <span>Source · <code>${escapeHtml(sourceName)}</code></span>
    <span>Rendered ${escapeHtml(generated)}</span>
  </footer>
</main>
</body>
</html>
`;
}

function main() {
  const inputPath = process.argv[2] || findLatestLinksReport();
  if (!inputPath) {
    console.error(
      'Usage: node render-links-report.js [path/to/links-YYYY-MM-DD.json]',
    );
    console.error('No path supplied and no reports/links-*.json found.');
    process.exit(1);
  }
  const absPath = path.resolve(inputPath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch (err) {
    console.error(`Could not parse JSON: ${err.message}`);
    process.exit(1);
  }

  const textureUri = loadTextureDataUri();
  const generated = new Date().toISOString();
  const sourceName = path.basename(absPath);

  const html = renderHtml({ data, sourceName, textureUri, generated });

  const outPath = absPath.replace(/\.json$/i, '.html');
  fs.writeFileSync(outPath, html);

  const links = Array.isArray(data.links) ? data.links : [];
  const broken = links.filter(l => l.state === 'BROKEN').length;
  const skipped = links.filter(l => l.state === 'SKIPPED').length;
  const ok = links.filter(l => l.state === 'OK').length;

  console.log(`Rendered: ${outPath}`);
  console.log(
    `Links parsed: ${links.length} (ok:${ok}, broken:${broken}, skipped:${skipped})`,
  );
  console.log(
    `Texture: ${textureUri ? 'embedded (data URI)' : 'not found — solid background only'}`,
  );
}

main();
