#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low'];

const SEVERITY_LABEL = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeInline(s) {
  return marked.parseInline(escapeHtml(s || ''));
}

function extractFindings(md) {
  const findings = [];
  const placeholderMd = md.replace(
    /```json\s*\n([\s\S]*?)\n```/g,
    (match, body) => {
      try {
        const obj = JSON.parse(body);
        if (obj && obj.severity && obj.summary) {
          const idx = findings.length;
          findings.push(obj);
          return `\n\n<!--FINDING_${idx}-->\n\n`;
        }
      } catch (_) {}
      return match;
    },
  );
  return { findings, placeholderMd };
}

function extractHeaderMeta(md) {
  const meta = {};
  const titleMatch = md.match(/^#\s+(.+)$/m);
  meta.title = titleMatch ? titleMatch[1].trim() : 'QA Report';

  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^-\s+\*\*([^*]+):\*\*\s*(.+)$/);
    if (m) {
      meta[m[1].trim().toLowerCase()] = m[2].trim();
    }
    if (lines[i].startsWith('## ')) break;
  }
  return meta;
}

function renderFindingCard(f) {
  const sev = (f.severity || 'low').toLowerCase();
  const detail = f.detail ? safeInline(f.detail) : '';
  const evidence = f.evidence ? safeInline(f.evidence) : '';
  const repro = f.reproduction
    ? f.reproduction
        .split(/\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const stepMatch = line.match(/^\d+\.\s*(.+)$/);
          return stepMatch
            ? `<li>${safeInline(stepMatch[1])}</li>`
            : `<li>${safeInline(line)}</li>`;
        })
        .join('')
    : '';

  const route = f.route || '';
  const locale = f.locale || '';
  const viewport = f.viewport || '';
  const inlineMeta = [
    route &&
      `<code class="finding__route" title="Route">${escapeHtml(route)}</code>`,
    locale &&
      `<span class="finding__pill finding__pill--locale" title="Locale">${escapeHtml(locale)}</span>`,
    viewport &&
      `<span class="finding__pill finding__pill--viewport" title="Viewport">${escapeHtml(viewport)}</span>`,
  ]
    .filter(Boolean)
    .join('');

  const hasDetails = detail || evidence || repro;
  const sevLabel = SEVERITY_LABEL[sev] || sev;

  return `
<article class="finding finding--${escapeHtml(sev)}" data-sev="${escapeHtml(sev)}" data-cat="${escapeHtml((f.category || '').toLowerCase())}">
  <header class="finding__head">
    <span class="badge badge--${escapeHtml(sev)}">
      <span class="badge__dot" aria-hidden="true"></span>${escapeHtml(sevLabel)}
    </span>
    <span class="finding__id">#${escapeHtml(String(f.id ?? ''))}</span>
    ${f.category ? `<span class="finding__cat">${escapeHtml(f.category)}</span>` : ''}
  </header>
  <h3 class="finding__summary">${safeInline(f.summary || '')}</h3>
  ${inlineMeta ? `<div class="finding__inline-meta">${inlineMeta}</div>` : ''}
  ${
    hasDetails
      ? `
  <details class="finding__details">
    <summary><span class="finding__chev" aria-hidden="true"></span><span class="finding__sumtext">View details</span></summary>
    <div class="finding__sections">
      ${detail ? `<section class="finding__sec"><h4>Detail</h4><div class="finding__body">${detail}</div></section>` : ''}
      ${evidence ? `<section class="finding__sec"><h4>Evidence</h4><div class="finding__body">${evidence}</div></section>` : ''}
      ${repro ? `<section class="finding__sec"><h4>Steps to reproduce</h4><ol class="finding__repro">${repro}</ol></section>` : ''}
    </div>
  </details>`
      : ''
  }
</article>`;
}

function extractCoverageStats(md) {
  const idx = md.indexOf('## Coverage report');
  if (idx === -1) return null;
  const slice = md.slice(idx).split(/\n## /)[0];
  const tools = [];
  let totals = null;
  for (const line of slice.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('|')) continue;
    const cells = t
      .split('|')
      .slice(1, -1)
      .map(c => c.trim());
    if (cells.length < 3) continue;
    if (cells[0].toLowerCase() === 'tool' || /^[-\s]+$/.test(cells[0]))
      continue;
    const name = cells[0].replace(/\*+/g, '').trim();
    const totalRaw = cells[1].replace(/\*+/g, '').trim();
    const visitedRaw = cells[2].replace(/\*+/g, '').trim();
    const totalNum = parseInt(totalRaw, 10);
    const visitedMatch =
      visitedRaw.match(/^(\d+)\s*\/\s*(\d+)/) || visitedRaw.match(/^(\d+)/);
    if (isNaN(totalNum) || !visitedMatch) continue;
    const visitedNum = parseInt(visitedMatch[1], 10);
    if (name.toLowerCase() === 'total') {
      totals = { total: totalNum, visited: visitedNum };
    } else {
      tools.push({ name, total: totalNum, visited: visitedNum });
    }
  }
  if (!tools.length) return null;
  if (!totals) {
    totals = tools.reduce(
      (a, t) => ({ total: a.total + t.total, visited: a.visited + t.visited }),
      { total: 0, visited: 0 },
    );
  }
  return { tools, totals };
}

// Classify a diff-table status cell into one of: new, confirmed, refuted,
// persistent, scopeChanged, notSeen, superseded, notRetested, resolved.
// Order matters: the more-specific patterns are checked first so e.g.
// "persistent + scope expanded" doesn't fall through to plain "persistent".
function classifyDiffStatus(s) {
  const t = s.toLowerCase();
  if (/not[\s-]?retested|out\s+of\s+(profile|scope)/.test(t))
    return 'notRetested';
  if (/not[\s-]?seen|did\s*not\s*reproduce/.test(t)) return 'notSeen';
  if (/superseded/.test(t)) return 'superseded';
  if (/likely[\s-]?resolved|resolved/.test(t)) return 'resolved';
  if (/refuted/.test(t)) return 'refuted';
  if (/(persistent|confirmed).*(scope|expanded|shifted|partial)/.test(t))
    return 'scopeChanged';
  if (/(scope|expanded|shifted).*(persistent|confirmed)/.test(t))
    return 'scopeChanged';
  if (/^new\b|\bnew\s*\(this\s*run\)|\bnew\s+finding/.test(t)) return 'new';
  if (/persistent/.test(t)) return 'persistent';
  if (/confirmed/.test(t)) return 'confirmed';
  return null;
}

function extractDiffCounts(md) {
  const idx = md.search(/##\s+Diff vs/i);
  if (idx === -1) return null;
  const slice = md.slice(idx).split(/\n## /)[0];
  const counts = {
    confirmed: 0,
    refuted: 0,
    persistent: 0,
    scopeChanged: 0,
    new: 0,
    notRetested: 0,
    notSeen: 0,
    superseded: 0,
    resolved: 0,
  };
  let any = false;
  for (const line of slice.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('|') || /^\|\s*-+/.test(t)) continue;
    const cells = t
      .split('|')
      .slice(1, -1)
      .map(c => c.trim().replace(/\*+/g, ''));
    if (cells.length < 2 || cells[0].toLowerCase() === 'status') continue;
    any = true;
    const cls = classifyDiffStatus(cells[0]);
    if (cls && cls in counts) counts[cls]++;
  }
  return any ? counts : null;
}

function isRunIncomplete(md) {
  return /run is incomplete/i.test(md);
}

function severityCounts(findings) {
  return SEVERITY_ORDER.reduce((acc, s) => {
    acc[s] = findings.filter(
      f => (f.severity || '').toLowerCase() === s,
    ).length;
    return acc;
  }, {});
}

// Compute a 0–100 health score weighted by severity.
// Used to drive the hero gauge and "headline" copy.
function healthScore(sev) {
  const weight =
    sev.critical * 25 + sev.high * 10 + sev.medium * 4 + sev.low * 1;
  const score = Math.max(0, 100 - weight);
  return Math.round(score);
}

function healthHeadline(sev) {
  if (sev.critical > 0) {
    return {
      tone: 'crit',
      title: 'Critical issues found',
      sub: `${sev.critical} critical issue${sev.critical === 1 ? '' : 's'} need immediate attention.`,
    };
  }
  if (sev.high > 0) {
    return {
      tone: 'warn',
      title: 'Action required',
      sub: `${sev.high} high-severity issue${sev.high === 1 ? '' : 's'} to triage.`,
    };
  }
  if (sev.medium > 0 || sev.low > 0) {
    const total = sev.medium + sev.low;
    return {
      tone: 'info',
      title: 'Minor issues noted',
      sub: `${total} non-blocking issue${total === 1 ? '' : 's'} for the backlog.`,
    };
  }
  return {
    tone: 'ok',
    title: 'All clear',
    sub: 'No issues found in this run. Nice.',
  };
}

function renderDonut(sev, total) {
  // SVG donut chart for severity distribution
  if (!total) {
    return `
      <svg class="donut" viewBox="0 0 120 120" role="img" aria-label="No findings">
        <circle cx="60" cy="60" r="48" class="donut__track" />
        <text x="60" y="58" class="donut__value" text-anchor="middle">0</text>
        <text x="60" y="76" class="donut__label" text-anchor="middle">findings</text>
      </svg>`;
  }
  const r = 48;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const segs = SEVERITY_ORDER.map(s => {
    const n = sev[s];
    if (!n) return '';
    const frac = n / total;
    const len = circ * frac;
    const seg = `<circle cx="60" cy="60" r="${r}" class="donut__seg donut__seg--${s}"
      stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}"
      stroke-dashoffset="${(-offset).toFixed(2)}" />`;
    offset += len;
    return seg;
  }).join('');

  return `
    <svg class="donut" viewBox="0 0 120 120" role="img" aria-label="Severity distribution">
      <circle cx="60" cy="60" r="${r}" class="donut__track" />
      ${segs}
      <text x="60" y="58" class="donut__value" text-anchor="middle">${total}</text>
      <text x="60" y="76" class="donut__label" text-anchor="middle">finding${total === 1 ? '' : 's'}</text>
    </svg>`;
}

function renderGauge(score, tone) {
  // Half-circle gauge for the health score
  const r = 54;
  const circ = Math.PI * r; // half circle
  const fillLen = (score / 100) * circ;
  return `
    <svg class="gauge" viewBox="0 0 140 80" role="img" aria-label="Health score: ${score} out of 100">
      <path d="M 16 70 A 54 54 0 0 1 124 70" class="gauge__track" fill="none" />
      <path d="M 16 70 A 54 54 0 0 1 124 70"
        class="gauge__fill gauge__fill--${tone}"
        fill="none"
        stroke-dasharray="${fillLen.toFixed(2)} ${(circ - fillLen).toFixed(2)}" />
      <text x="70" y="58" class="gauge__value gauge__value--${tone}" text-anchor="middle">${score}</text>
      <text x="70" y="74" class="gauge__label" text-anchor="middle">/ 100</text>
    </svg>`;
}

function renderDashboard({ findings, coverage, diff, isIncomplete }) {
  const sev = severityCounts(findings);
  const total = findings.length;
  const score = healthScore(sev);
  const headline = healthHeadline(sev);
  const cov = coverage
    ? Math.round((coverage.totals.visited / coverage.totals.total) * 100)
    : null;

  const sevLegend = SEVERITY_ORDER.map(
    s => `<li class="legend__item${sev[s] ? '' : ' is-zero'}">
      <span class="legend__swatch legend__swatch--${s}"></span>
      <span class="legend__label">${SEVERITY_LABEL[s]}</span>
      <span class="legend__count">${sev[s]}</span>
    </li>`,
  ).join('');

  const toolBars = coverage
    ? coverage.tools
        .map(t => {
          const pct = t.total ? Math.round((t.visited / t.total) * 100) : 0;
          const tone = pct >= 100 ? 'full' : pct >= 60 ? 'mid' : 'low';
          return `<li class="cov-row cov-row--${tone}">
        <div class="cov-row__head">
          <span class="cov-row__name">${escapeHtml(t.name)}</span>
          <span class="cov-row__pct">${pct}%</span>
        </div>
        <div class="cov-row__bar"><span class="cov-row__fill" style="width: ${pct}%"></span></div>
        <span class="cov-row__count">${t.visited} of ${t.total} routes</span>
      </li>`;
        })
        .join('')
    : '';

  const diffPills = diff
    ? `
    <div class="diff-pills">
      ${diff.new ? `<span class="diff-pill diff-pill--new"><b>${diff.new}</b><span>new</span></span>` : ''}
      ${diff.confirmed ? `<span class="diff-pill diff-pill--confirmed"><b>${diff.confirmed}</b><span>confirmed</span></span>` : ''}
      ${diff.scopeChanged ? `<span class="diff-pill diff-pill--scope"><b>${diff.scopeChanged}</b><span>scope changed</span></span>` : ''}
      ${diff.refuted ? `<span class="diff-pill diff-pill--refuted"><b>${diff.refuted}</b><span>refuted</span></span>` : ''}
      ${diff.notSeen ? `<span class="diff-pill diff-pill--notseen"><b>${diff.notSeen}</b><span>not seen</span></span>` : ''}
      ${diff.resolved ? `<span class="diff-pill diff-pill--resolved"><b>${diff.resolved}</b><span>resolved</span></span>` : ''}
      ${diff.superseded ? `<span class="diff-pill diff-pill--superseded"><b>${diff.superseded}</b><span>superseded</span></span>` : ''}
      ${diff.persistent ? `<span class="diff-pill diff-pill--persistent"><b>${diff.persistent}</b><span>persistent</span></span>` : ''}
      ${diff.notRetested ? `<span class="diff-pill diff-pill--skip"><b>${diff.notRetested}</b><span>not retested</span></span>` : ''}
    </div>`
    : '';

  const status = isIncomplete
    ? { label: 'Partial', tone: 'warn', sub: 'Some scope was de-scoped' }
    : { label: 'Complete', tone: 'ok', sub: 'All targeted scope covered' };

  return `
<section class="hero hero--${headline.tone}" aria-label="Run summary">
  <div class="hero__body">
    <div class="hero__copy">
      <span class="hero__eyebrow">Run summary</span>
      <h2 class="hero__title">${escapeHtml(headline.title)}</h2>
      <p class="hero__sub">${escapeHtml(headline.sub)}</p>
    </div>
    <div class="hero__gauge">
      ${renderGauge(score, headline.tone)}
      <span class="hero__gauge-cap">Health score</span>
    </div>
  </div>
</section>

<section class="dashboard" aria-label="Run statistics">
  <div class="kpi-grid">
    <div class="kpi kpi--findings">
      <div class="kpi__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>
      </div>
      <div class="kpi__label">Findings</div>
      <div class="kpi__value">${total}</div>
      <div class="kpi__sub">${
        SEVERITY_ORDER.filter(s => sev[s])
          .map(
            s =>
              `<span class="kpi__chip kpi__chip--${s}" title="${SEVERITY_LABEL[s]}">${SEVERITY_LABEL[s][0]} ${sev[s]}</span>`,
          )
          .join('') || '<span class="kpi__sub-clean">No issues</span>'
      }</div>
    </div>
    ${
      cov !== null
        ? `
    <div class="kpi kpi--coverage">
      <div class="kpi__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.56"/><path d="m9 11 3 3L22 4"/></svg>
      </div>
      <div class="kpi__label">Route coverage</div>
      <div class="kpi__value">${cov}<span class="kpi__unit">%</span></div>
      <div class="kpi__sub">${coverage.totals.visited} of ${coverage.totals.total} routes visited</div>
    </div>`
        : ''
    }
    <div class="kpi kpi--status">
      <div class="kpi__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
      </div>
      <div class="kpi__label">Run status</div>
      <div class="kpi__value kpi__status--${status.tone}">${status.label}</div>
      <div class="kpi__sub">${escapeHtml(status.sub)}</div>
    </div>
    ${
      diff
        ? `
    <div class="kpi kpi--diff">
      <div class="kpi__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
      </div>
      <div class="kpi__label">Vs previous run</div>
      <div class="kpi__value">${diff.new + diff.confirmed + diff.scopeChanged + diff.refuted + diff.notSeen + diff.resolved + diff.superseded}<span class="kpi__unit">Δ</span></div>
      <div class="kpi__sub">${
        [
          diff.new && `${diff.new} new`,
          diff.scopeChanged && `${diff.scopeChanged} scope`,
          diff.confirmed && `${diff.confirmed} confirmed`,
          diff.refuted && `${diff.refuted} refuted`,
          diff.notSeen && `${diff.notSeen} not seen`,
          diff.resolved && `${diff.resolved} resolved`,
          diff.superseded && `${diff.superseded} superseded`,
        ]
          .filter(Boolean)
          .join(' · ') || `${diff.persistent} persistent`
      }</div>
    </div>`
        : ''
    }
  </div>

  <div class="dash-grid">
    ${
      total
        ? `
    <div class="dash-card">
      <h3 class="dash-h">Severity breakdown</h3>
      <div class="dash-card__donut">
        ${renderDonut(sev, total)}
        <ul class="legend">${sevLegend}</ul>
      </div>
    </div>`
        : `
    <div class="dash-card dash-card--clean">
      <div class="clean-state">
        <div class="clean-state__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        </div>
        <h3>No findings</h3>
        <p>This run came back clean. Ship it with confidence.</p>
      </div>
    </div>`
    }

    ${
      toolBars
        ? `
    <div class="dash-card">
      <h3 class="dash-h">Coverage by tool</h3>
      <ul class="cov-list">${toolBars}</ul>
    </div>`
        : ''
    }
  </div>

  ${diffPills ? `<div class="dash-card dash-card--diff"><h3 class="dash-h">Compared to previous run</h3>${diffPills}</div>` : ''}
</section>`;
}

function renderFindingsToolbar(findings) {
  if (!findings.length) return '';
  const counts = severityCounts(findings);
  const chip = (sev, label) => {
    const n = sev === 'all' ? findings.length : counts[sev] || 0;
    const pressed = sev === 'all';
    return `<button type="button" class="filter-chip filter-chip--${sev}" data-sev="${sev}" aria-pressed="${pressed}">
      ${sev !== 'all' ? `<span class="filter-chip__dot filter-chip__dot--${sev}"></span>` : ''}${label}<span class="filter-chip__count">${n}</span></button>`;
  };
  return `
<div class="findings-toolbar" role="toolbar" aria-label="Filter findings by severity">
  <span class="findings-toolbar__label">Filter:</span>
  ${chip('all', 'All')}
  ${SEVERITY_ORDER.filter(s => counts[s] > 0)
    .map(s => chip(s, SEVERITY_LABEL[s]))
    .join('')}
</div>`;
}

function slugify(s) {
  return String(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[#\w]+;/g, ' ')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

// Add stable id="..." to every <h2> and <h3> so the TOC can link to them.
// Dedupes collisions by suffixing -2, -3, etc.
function addHeadingIds(html) {
  const seen = new Set();
  return html.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (_match, tag, inner) => {
    const base = slugify(inner);
    if (!base) return `<${tag}>${inner}</${tag}>`;
    let s = base;
    let i = 1;
    while (seen.has(s)) {
      i += 1;
      s = `${base}-${i}`;
    }
    seen.add(s);
    return `<${tag} id="${s}">${inner}</${tag}>`;
  });
}

// Pull <h2 id="..."> entries (top-level sections only — h3s are within-section detail).
function extractToc(html) {
  const items = [];
  const re = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[2]
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    items.push({ id: m[1], text });
  }
  return items;
}

// Trim verbose TOC labels — H2s often have parenthetical detail (file refs,
// timestamps) that's useful in the body but blows up a narrow side rail.
function shortenTocLabel(s) {
  let out = s.replace(/\s*\([^)]*\.(md|json|html|svg|png)[^)]*\)/gi, '');
  out = out.replace(/\s*\(\s*reports?\/[^)]+\)/gi, '');
  out = out.replace(/\s+\+\s+.*$/, '');
  return out.replace(/\s+/g, ' ').trim();
}

function buildTocHtml(toc) {
  if (!toc.length) return { aside: '', mobile: '' };
  const lis = toc
    .map(t => {
      const short = shortenTocLabel(t.text) || t.text;
      const titleAttr =
        short !== t.text ? ` title="${escapeHtml(t.text)}"` : '';
      return `<li><a href="#${escapeHtml(t.id)}"${titleAttr}>${escapeHtml(short)}</a></li>`;
    })
    .join('');
  const aside = `<aside class="toc" aria-label="Table of contents">
    <div class="toc__title">On this page</div>
    <ul class="toc__list">${lis}</ul>
  </aside>`;
  const opts = toc
    .map(
      t =>
        `<option value="#${escapeHtml(t.id)}">${escapeHtml(t.text)}</option>`,
    )
    .join('');
  const mobile = `<div class="toc-mobile">
    <label class="toc-mobile__label" for="toc-jump">Jump to section</label>
    <select id="toc-jump" class="toc-mobile__select" onchange="if(this.value){location.hash=this.value}">
      <option value="">— choose —</option>
      ${opts}
    </select>
  </div>`;
  return { aside, mobile };
}

// Find the FIRST table after the "Diff vs..." h2 and wrap each row's first
// cell with a colored status class. Doesn't touch other tables (Severity
// counts, Coverage report, Fixed-pass tables) because their first cells
// don't match diff-status keywords.
function colorDiffStatuses(html) {
  return html.replace(/(<table>[\s\S]*?<\/table>)/g, tableHtml => {
    // Quick screen: does any first cell look like a diff status?
    const probe = /<tr>\s*<td>([\s\S]*?)<\/td>/i;
    const sample = tableHtml.match(/<tbody>([\s\S]*?)<\/tbody>/i) || [
      ,
      tableHtml,
    ];
    if (!probe.test(sample[1])) return tableHtml;

    let any = false;
    const out = tableHtml.replace(
      /(<tr>\s*)<td>([\s\S]*?)<\/td>/g,
      (m, openTr, cellHtml) => {
        const plain = cellHtml
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!plain) return m;
        const cls = classifyDiffStatus(plain);
        if (!cls) return m;
        any = true;
        return `${openTr}<td class="diff-status diff-status--${cls}">${cellHtml}</td>`;
      },
    );
    return any ? out : tableHtml;
  });
}

function postProcessHtml(html) {
  html = html.replace(
    /<td>(critical|high|medium|low)<\/td>\s*<td>(\d+)<\/td>/gi,
    (_match, sev, count) => {
      const s = sev.toLowerCase();
      return `<td><span class="badge badge--${s}"><span class="badge__dot" aria-hidden="true"></span>${SEVERITY_LABEL[s]}</span></td><td class="count">${count}</td>`;
    },
  );

  html = colorDiffStatuses(html);
  html = addHeadingIds(html);
  html = html
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>');

  return html;
}

function renderHtml({ meta, body, mdPath, dashboardHtml, tocHtml }) {
  const title = escapeHtml(meta.title);

  const META_ICONS = {
    'run date': 'calendar',
    profile: 'tag',
    environment: 'globe',
    browser: 'monitor',
    'scope per profile': 'target',
    'time spent': 'clock',
    'pre-flight': 'check',
    'run status': 'activity',
    'build id observed': 'hash',
  };

  const ICON_SVG = {
    calendar:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    tag: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/></svg>',
    globe:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    monitor:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    target:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
    activity:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    hash: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',
  };

  // Split meta entries into "facts" (short, single-line, scannable) and
  // "notes" (long-form, contain inline code, or have parenthetical detail).
  // Facts go in a compact horizontal chip row; notes get full-width rows.
  const isFact = v => {
    const plain = String(v || '')
      .replace(/`[^`]*`/g, '')
      .trim();
    return plain.length <= 70 && !/\n/.test(v) && !/`[^`]{20,}`/.test(v);
  };

  const entries = Object.entries(meta).filter(([k]) => k !== 'title');
  const factEntries = entries.filter(([, v]) => isFact(v));
  const noteEntries = entries.filter(([, v]) => !isFact(v));

  const factsHtml = factEntries
    .map(([k, v]) => {
      const iconKey = META_ICONS[k] || 'tag';
      return `<div class="fact">
        <span class="fact__icon" aria-hidden="true">${ICON_SVG[iconKey]}</span>
        <span class="fact__body">
          <span class="fact__label">${escapeHtml(k)}</span>
          <span class="fact__value">${marked.parseInline(v)}</span>
        </span>
      </div>`;
    })
    .join('');

  const notesHtml = noteEntries
    .map(([k, v]) => {
      const iconKey = META_ICONS[k] || 'tag';
      return `<div class="note">
        <div class="note__head">
          <span class="note__icon" aria-hidden="true">${ICON_SVG[iconKey]}</span>
          <span class="note__label">${escapeHtml(k)}</span>
        </div>
        <div class="note__body">${marked.parseInline(v)}</div>
      </div>`;
    })
    .join('');

  const metaBlockHtml = `
    ${factsHtml ? `<div class="facts">${factsHtml}</div>` : ''}
    ${notesHtml ? `<div class="notes">${notesHtml}</div>` : ''}
  `;

  const generated = new Date().toISOString();
  const sourceName = escapeHtml(path.basename(mdPath));

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  /* —————————————————————————————————————————————————————————
   * QA Report — modern dashboard styling
   * Vibrant, scannable, dashboard-first. Designed independent
   * of any host project's design system so the report reads
   * well on its own as a standalone artifact.
   * ————————————————————————————————————————————————————————— */
  :root {
    /* Surface palette */
    --bg-page: #f5f6fb;
    --bg-page-grad: radial-gradient(ellipse 1200px 600px at 50% -10%, #e9eaff 0%, #f5f6fb 60%);
    --bg-card: #ffffff;
    --bg-soft: #f7f8fc;
    --bg-soft-2: #eef0f7;

    /* Text */
    --text-1: #0f172a;       /* slate-900 */
    --text-2: #334155;       /* slate-700 */
    --text-3: #64748b;       /* slate-500 */
    --text-4: #94a3b8;       /* slate-400 */

    /* Borders */
    --border: #e5e7ef;
    --border-strong: #d1d5e0;

    /* Brand — indigo→violet */
    --brand: #6366f1;
    --brand-2: #8b5cf6;
    --brand-soft: #eef2ff;
    --brand-grad: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

    /* Severity palette — confident, modern */
    --crit:      #ef4444;   /* red-500 */
    --crit-bg:   #fef2f2;   /* red-50 */
    --crit-soft: #fee2e2;
    --crit-ink:  #991b1b;

    --high:      #f97316;   /* orange-500 */
    --high-bg:   #fff7ed;
    --high-soft: #ffedd5;
    --high-ink:  #9a3412;

    --med:       #eab308;   /* yellow-500 */
    --med-bg:    #fefce8;
    --med-soft:  #fef9c3;
    --med-ink:   #854d0e;

    --low:       #3b82f6;   /* blue-500 */
    --low-bg:    #eff6ff;
    --low-soft:  #dbeafe;
    --low-ink:   #1e40af;

    /* Status */
    --ok:        #10b981;   /* emerald-500 */
    --ok-bg:     #ecfdf5;
    --ok-soft:   #d1fae5;
    --ok-ink:    #065f46;

    --warn:      #f59e0b;
    --warn-bg:   #fffbeb;
    --warn-ink:  #92400e;

    /* Typography — system font stack, no external font fetches.
       Renders crisp on every OS without bringing in Google Fonts. */
    --font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

    /* Shadows */
    --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
    --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
    --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.06), 0 2px 4px rgba(15, 23, 42, 0.04);
    --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04);
    --shadow-glow-brand: 0 8px 24px rgba(99, 102, 241, 0.18);

    /* Radius */
    --r-xs: 4px;
    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 14px;
    --r-xl: 18px;
    --r-2xl: 24px;

    --ease: cubic-bezier(0.22, 1, 0.36, 1);
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { font-size: 16px; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: var(--font);
    font-size: 15px;
    line-height: 1.55;
    color: var(--text-1);
    background: var(--bg-page-grad);
    background-color: var(--bg-page);
    background-attachment: fixed;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .page-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 28px 96px;
  }

  /* Page heading */
  .page-heading {
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .page-heading__mark {
    width: 44px;
    height: 44px;
    border-radius: var(--r-md);
    background: var(--brand-grad);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: var(--shadow-glow-brand);
    flex-shrink: 0;
  }
  .page-title {
    font-family: var(--font);
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-1);
    margin: 0;
    line-height: 1.15;
  }
  .page-subtitle {
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-3);
    margin: 4px 0 32px 60px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .page-subtitle::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--brand);
  }

  /* Section headers */
  h2 {
    font-family: var(--font);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-1);
    margin: 48px 0 16px;
    line-height: 1.25;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  h2::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 22px;
    background: var(--brand-grad);
    border-radius: 4px;
  }
  h3 {
    font-family: var(--font);
    font-size: 17px;
    font-weight: 600;
    color: var(--text-1);
    margin: 28px 0 12px;
    line-height: 1.3;
  }

  p { margin: 12px 0; color: var(--text-2); }

  a {
    color: var(--brand);
    text-decoration: none;
    font-weight: 500;
    transition: color 160ms ease;
  }
  a:hover { color: var(--brand-2); text-decoration: underline; }

  ul, ol { padding-left: 22px; margin: 12px 0; color: var(--text-2); }
  li { margin: 4px 0; line-height: 1.6; }

  hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 40px 0;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.86em;
    background: var(--bg-soft-2);
    color: var(--text-1);
    padding: 1px 6px;
    border-radius: var(--r-xs);
    font-weight: 500;
  }
  pre {
    background: #0f172a;
    color: #e2e8f0;
    border-radius: var(--r-md);
    padding: 16px 18px;
    overflow-x: auto;
    font-size: 13px;
    margin: 16px 0;
    box-shadow: var(--shadow-sm);
  }
  pre code { background: transparent; color: inherit; padding: 0; font-size: inherit; }

  /* Run metadata — two-tier:
     1. .facts  → compact horizontal chips (short single-line values)
     2. .notes  → stacked full-width rows (long descriptions, code, etc.) */
  .meta {
    margin: 0 0 32px;
    padding: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Facts row — chips of short metadata */
  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
    background: var(--bg-card);
    padding: 14px 16px;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .fact {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    border-radius: var(--r-sm);
    min-width: 0;
    transition: background 160ms ease;
  }
  .fact:hover { background: var(--bg-soft); }
  .fact__icon {
    width: 28px;
    height: 28px;
    border-radius: var(--r-sm);
    background: var(--brand-soft);
    color: var(--brand);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .fact__body {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
    overflow: hidden;
  }
  .fact__label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
    line-height: 1.4;
  }
  .fact__value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-1);
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fact__value code {
    font-size: 12px;
    background: transparent;
    padding: 0;
    color: var(--text-1);
  }
  .fact__value a { color: var(--brand); }

  /* Notes — full-width rows for long-form metadata */
  .notes {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--border);
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .note {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 24px;
    padding: 14px 18px;
    background: var(--bg-card);
    align-items: baseline;
  }
  .note__head {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding-top: 2px;
  }
  .note__icon {
    color: var(--brand);
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }
  .note__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
    white-space: nowrap;
  }
  .note__body {
    font-size: 14px;
    color: var(--text-1);
    line-height: 1.55;
    min-width: 0;
  }
  .note__body code {
    font-size: 12px;
    background: var(--bg-soft-2);
    padding: 1px 6px;
    border-radius: var(--r-xs);
    word-break: break-word;
  }
  .note__body a { color: var(--brand); font-weight: 500; }

  /* Tables */
  .table-wrap {
    overflow-x: auto;
    margin: 16px 0 24px;
    border-radius: var(--r-lg);
    background: var(--bg-card);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    /* Subtle right-edge fade hints at scrollable content */
    background-image: linear-gradient(to right, transparent, transparent), linear-gradient(to right, transparent, rgba(15,23,42,0.06));
    background-position: right center;
    background-repeat: no-repeat;
    background-size: 100% 100%, 18px 100%;
    background-attachment: local, scroll;
  }
  table {
    /* Let wide tables grow past the container width so they scroll
       horizontally instead of compressing all columns into shreds.
       Narrow tables still fill the container via min-width:100%. */
    min-width: 100%;
    width: max-content;
    border-collapse: collapse;
    font-size: 14px;
  }
  th, td {
    padding: 12px 16px;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
    line-height: 1.55;
  }
  thead th {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
    background: var(--bg-soft);
    border-bottom: 1px solid var(--border-strong);
  }
  tbody tr:last-child td { border-bottom: 0; }
  tbody tr:hover { background: var(--bg-soft); }
  td.count {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: var(--text-1);
  }

  /* Severity badges — pill with dot */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px 3px 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 1.5;
    border-radius: 999px;
    border: 1px solid transparent;
  }
  .badge__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    background: currentColor;
  }
  .badge--critical { color: var(--crit-ink);  background: var(--crit-bg);  border-color: var(--crit-soft); }
  .badge--high     { color: var(--high-ink);  background: var(--high-bg);  border-color: var(--high-soft); }
  .badge--medium   { color: var(--med-ink);   background: var(--med-bg);   border-color: var(--med-soft); }
  .badge--low      { color: var(--low-ink);   background: var(--low-bg);   border-color: var(--low-soft); }
  .badge--critical .badge__dot { background: var(--crit); }
  .badge--high     .badge__dot { background: var(--high); }
  .badge--medium   .badge__dot { background: var(--med); }
  .badge--low      .badge__dot { background: var(--low); }

  /* —————————————————————————————————————————————————————————
   * Hero — health headline + gauge
   * ————————————————————————————————————————————————————————— */
  .hero {
    margin: 0 0 24px;
    border-radius: var(--r-2xl);
    padding: 28px 32px;
    background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero--ok::before   { background: radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, transparent 70%); }
  .hero--warn::before { background: radial-gradient(circle, rgba(245, 158, 11, 0.10) 0%, transparent 70%); }
  .hero--crit::before { background: radial-gradient(circle, rgba(239, 68, 68, 0.10) 0%, transparent 70%); }
  .hero--info::before { background: radial-gradient(circle, rgba(59, 130, 246, 0.10) 0%, transparent 70%); }

  .hero__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    position: relative;
  }
  .hero__copy { flex: 1; min-width: 0; }
  .hero__eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-3);
    display: inline-block;
    margin-bottom: 8px;
  }
  .hero__title {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 6px;
    color: var(--text-1);
    line-height: 1.2;
  }
  .hero--ok   .hero__title { color: var(--ok-ink); }
  .hero--warn .hero__title { color: var(--warn-ink); }
  .hero--crit .hero__title { color: var(--crit-ink); }
  .hero--info .hero__title { color: var(--low-ink); }
  .hero__sub {
    font-size: 15px;
    color: var(--text-2);
    margin: 0;
    max-width: 540px;
  }
  .hero__gauge {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .hero__gauge-cap {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  /* Gauge */
  .gauge { width: 160px; height: auto; }
  .gauge__track {
    stroke: var(--bg-soft-2);
    stroke-width: 10;
    stroke-linecap: round;
  }
  .gauge__fill {
    stroke-width: 10;
    stroke-linecap: round;
    transition: stroke-dasharray 1s var(--ease);
  }
  .gauge__fill--ok   { stroke: var(--ok); }
  .gauge__fill--warn { stroke: var(--warn); }
  .gauge__fill--crit { stroke: var(--crit); }
  .gauge__fill--info { stroke: var(--low); }
  .gauge__value {
    font-family: var(--font);
    font-size: 26px;
    font-weight: 800;
    fill: var(--text-1);
    font-variant-numeric: tabular-nums;
  }
  .gauge__value--ok   { fill: var(--ok); }
  .gauge__value--warn { fill: var(--warn); }
  .gauge__value--crit { fill: var(--crit); }
  .gauge__value--info { fill: var(--low); }
  .gauge__label {
    font-family: var(--font);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    fill: var(--text-3);
    text-transform: uppercase;
  }

  /* —————————————————————————————————————————————————————————
   * Dashboard
   * ————————————————————————————————————————————————————————— */
  .dashboard { margin: 0 0 32px; display: flex; flex-direction: column; gap: 16px; }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }
  .kpi {
    background: var(--bg-card);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    overflow: hidden;
    transition: transform 200ms var(--ease), box-shadow 200ms var(--ease);
  }
  .kpi:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  .kpi::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--brand-grad);
    opacity: 0.85;
  }
  .kpi--findings::before { background: linear-gradient(90deg, var(--high) 0%, var(--crit) 100%); }
  .kpi--coverage::before { background: linear-gradient(90deg, var(--ok) 0%, var(--low) 100%); }
  .kpi--status::before   { background: linear-gradient(90deg, var(--brand) 0%, var(--brand-2) 100%); }
  .kpi--diff::before     { background: linear-gradient(90deg, var(--brand-2) 0%, var(--high) 100%); }

  .kpi__icon {
    width: 32px;
    height: 32px;
    border-radius: var(--r-sm);
    background: var(--bg-soft);
    color: var(--brand);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }
  .kpi--findings .kpi__icon { color: var(--high); background: var(--high-bg); }
  .kpi--coverage .kpi__icon { color: var(--ok); background: var(--ok-bg); }
  .kpi--status   .kpi__icon { color: var(--brand); background: var(--brand-soft); }
  .kpi--diff     .kpi__icon { color: var(--brand-2); background: var(--brand-soft); }

  .kpi__label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-3);
  }
  .kpi__value {
    font-family: var(--font);
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
    color: var(--text-1);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    margin: 4px 0 2px;
  }
  .kpi__unit {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-3);
    margin-left: 4px;
  }
  .kpi__sub {
    font-size: 13px;
    color: var(--text-3);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 4px;
  }
  .kpi__sub-clean {
    color: var(--ok-ink);
    font-weight: 600;
    background: var(--ok-bg);
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
  }
  .kpi__chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    border-radius: 999px;
    line-height: 1.5;
  }
  .kpi__chip--critical { color: var(--crit-ink); background: var(--crit-bg); }
  .kpi__chip--high     { color: var(--high-ink); background: var(--high-bg); }
  .kpi__chip--medium   { color: var(--med-ink); background: var(--med-bg); }
  .kpi__chip--low      { color: var(--low-ink); background: var(--low-bg); }

  .kpi__status--ok   { color: var(--ok); }
  .kpi__status--warn { color: var(--warn); }
  .kpi__status--crit { color: var(--crit); }
  .kpi__status--info { color: var(--low); }

  /* 2-up grid */
  .dash-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 800px) {
    .dash-grid { grid-template-columns: 1fr; }
  }
  .dash-card {
    background: var(--bg-card);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    padding: 20px 22px;
  }
  .dash-card--clean {
    background: linear-gradient(135deg, var(--ok-bg) 0%, #ffffff 100%);
    border-color: var(--ok-soft);
  }
  .dash-h {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
    margin: 0 0 16px;
  }

  /* Donut + legend */
  .dash-card__donut {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .donut { width: 140px; height: 140px; flex-shrink: 0; }
  .donut__track {
    fill: none;
    stroke: var(--bg-soft-2);
    stroke-width: 14;
  }
  .donut__seg {
    fill: none;
    stroke-width: 14;
    transform: rotate(-90deg);
    transform-origin: 60px 60px;
    transition: stroke-dasharray 800ms var(--ease);
  }
  .donut__seg--critical { stroke: var(--crit); }
  .donut__seg--high     { stroke: var(--high); }
  .donut__seg--medium   { stroke: var(--med); }
  .donut__seg--low      { stroke: var(--low); }
  .donut__value {
    font-family: var(--font);
    font-size: 26px;
    font-weight: 800;
    fill: var(--text-1);
    font-variant-numeric: tabular-nums;
  }
  .donut__label {
    font-family: var(--font);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    fill: var(--text-3);
    text-transform: uppercase;
  }

  .legend {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .legend__item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-2);
  }
  .legend__item.is-zero { opacity: 0.4; }
  .legend__swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .legend__swatch--critical { background: var(--crit); }
  .legend__swatch--high     { background: var(--high); }
  .legend__swatch--medium   { background: var(--med); }
  .legend__swatch--low      { background: var(--low); }
  .legend__label {
    flex: 1;
    font-weight: 500;
    color: var(--text-1);
  }
  .legend__count {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: var(--text-1);
    background: var(--bg-soft-2);
    padding: 1px 10px;
    border-radius: 999px;
    font-size: 12px;
  }

  /* Clean state */
  .clean-state {
    text-align: center;
    padding: 24px 16px;
  }
  .clean-state__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--ok);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }
  .clean-state h3 {
    margin: 0 0 4px;
    color: var(--ok-ink);
    font-size: 18px;
    font-weight: 700;
  }
  .clean-state p {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
  }

  /* Coverage rows */
  .cov-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .cov-row { display: flex; flex-direction: column; gap: 6px; }
  .cov-row__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .cov-row__name {
    font-size: 14px;
    color: var(--text-1);
    font-weight: 600;
  }
  .cov-row__pct {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    font-size: 13px;
  }
  .cov-row--full .cov-row__pct { color: var(--ok); }
  .cov-row--mid  .cov-row__pct { color: var(--low); }
  .cov-row--low  .cov-row__pct { color: var(--high); }
  .cov-row__bar {
    position: relative;
    height: 8px;
    background: var(--bg-soft-2);
    border-radius: 999px;
    overflow: hidden;
  }
  .cov-row__fill {
    display: block;
    height: 100%;
    border-radius: 999px;
    transition: width 800ms var(--ease);
  }
  .cov-row--full .cov-row__fill { background: linear-gradient(90deg, var(--ok) 0%, #34d399 100%); }
  .cov-row--mid  .cov-row__fill { background: linear-gradient(90deg, var(--low) 0%, #60a5fa 100%); }
  .cov-row--low  .cov-row__fill { background: linear-gradient(90deg, var(--high) 0%, #fb923c 100%); }
  .cov-row__count {
    font-size: 12px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
  }

  /* Diff pills */
  .diff-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .diff-pill {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    padding: 8px 14px 8px 12px;
    font-size: 13px;
    background: var(--bg-soft);
    border-radius: var(--r-md);
    color: var(--text-2);
    border: 1px solid var(--border);
    border-left-width: 3px;
  }
  .diff-pill b {
    font-weight: 800;
    color: var(--text-1);
    font-variant-numeric: tabular-nums;
    font-size: 16px;
  }
  .diff-pill--new        { border-left-color: var(--crit); background: var(--crit-bg); }
  .diff-pill--new b      { color: var(--crit); }
  .diff-pill--confirmed  { border-left-color: var(--high); background: var(--high-bg); }
  .diff-pill--confirmed b{ color: var(--high); }
  .diff-pill--scope      { border-left-color: var(--high); background: var(--high-bg); }
  .diff-pill--scope b    { color: var(--high); }
  .diff-pill--refuted    { border-left-color: var(--ok); background: var(--ok-bg); }
  .diff-pill--refuted b  { color: var(--ok); }
  .diff-pill--notseen    { border-left-color: var(--ok); background: var(--ok-bg); }
  .diff-pill--notseen b  { color: var(--ok); }
  .diff-pill--resolved   { border-left-color: var(--ok); background: var(--ok-bg); }
  .diff-pill--resolved b { color: var(--ok); }
  .diff-pill--superseded { border-left-color: var(--low); background: var(--low-bg); }
  .diff-pill--superseded b { color: var(--low); }
  .diff-pill--persistent { border-left-color: var(--text-4); }
  .diff-pill--persistent b { color: var(--text-2); }
  .diff-pill--skip       { border-left-color: var(--border-strong); }

  /* —————————————————————————————————————————————————————————
   * Findings toolbar (sticky filter)
   * ————————————————————————————————————————————————————————— */
  .findings-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin: 12px 0 20px;
    padding: 12px 16px;
    background: var(--bg-card);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    position: sticky;
    top: 12px;
    z-index: 5;
    backdrop-filter: saturate(140%);
  }
  .findings-toolbar__label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-right: 4px;
  }
  .filter-chip {
    appearance: none;
    -webkit-appearance: none;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    background: transparent;
    color: var(--text-2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 5px 12px;
    cursor: pointer;
    line-height: 1.4;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 160ms ease;
  }
  .filter-chip:hover { background: var(--bg-soft); border-color: var(--border-strong); }
  .filter-chip__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .filter-chip__dot--critical { background: var(--crit); }
  .filter-chip__dot--high     { background: var(--high); }
  .filter-chip__dot--medium   { background: var(--med); }
  .filter-chip__dot--low      { background: var(--low); }
  .filter-chip__count {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    background: var(--bg-soft-2);
    padding: 0 7px;
    border-radius: 999px;
    font-size: 11px;
    line-height: 1.6;
  }
  .filter-chip[aria-pressed="true"] {
    background: var(--text-1);
    color: #fff;
    border-color: var(--text-1);
  }
  .filter-chip[aria-pressed="true"] .filter-chip__count {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }
  .filter-chip--critical[aria-pressed="true"] { background: var(--crit); border-color: var(--crit); }
  .filter-chip--high[aria-pressed="true"]     { background: var(--high); border-color: var(--high); }
  .filter-chip--medium[aria-pressed="true"]   { background: var(--med);  border-color: var(--med); }
  .filter-chip--low[aria-pressed="true"]      { background: var(--low);  border-color: var(--low); }

  /* —————————————————————————————————————————————————————————
   * Finding cards
   * ————————————————————————————————————————————————————————— */
  .finding {
    position: relative;
    background: var(--bg-card);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    padding: 22px 26px 20px 30px;
    margin: 14px 0;
    transition: transform 200ms var(--ease), box-shadow 200ms var(--ease);
  }
  .finding:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  /* Severity rail — left edge accent */
  .finding::before {
    content: '';
    position: absolute;
    top: 16px;
    bottom: 16px;
    left: 12px;
    width: 4px;
    border-radius: 4px;
    background: var(--text-4);
  }
  .finding--critical { border-left: 1px solid var(--crit-soft); }
  .finding--critical::before { background: var(--crit); }
  .finding--high::before     { background: var(--high); }
  .finding--medium::before   { background: var(--med); }
  .finding--low::before      { background: var(--low); }

  .finding__head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  .finding__id {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
  .finding__cat {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-2);
    padding: 3px 10px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--bg-soft);
  }
  .finding__summary {
    font-size: 17px;
    font-weight: 600;
    color: var(--text-1);
    line-height: 1.4;
    margin: 4px 0 12px;
  }

  .finding__inline-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    margin: 0 0 12px;
  }
  .finding__route {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    background: var(--brand-soft);
    border-radius: var(--r-xs);
    padding: 3px 8px;
    word-break: break-word;
    font-weight: 500;
  }
  .finding__pill {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-2);
    background: var(--bg-soft-2);
    border-radius: 999px;
    padding: 2px 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .finding__pill--locale   { background: #eef2ff; color: #4338ca; }
  .finding__pill--viewport { background: #ecfeff; color: #0e7490; }

  /* Disclosure */
  .finding__details {
    margin: 8px 0 0;
    border-top: 1px solid var(--border);
    padding-top: 10px;
  }
  .finding__details summary {
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--brand);
    padding: 6px 10px;
    user-select: none;
    list-style: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: var(--r-sm);
    background: var(--brand-soft);
    transition: background 160ms ease, color 160ms ease;
  }
  .finding__details summary::-webkit-details-marker { display: none; }
  .finding__details summary:hover { background: #e0e7ff; }
  .finding__chev {
    display: inline-block;
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid currentColor;
    transition: transform 200ms var(--ease);
  }
  .finding__details[open] .finding__chev { transform: rotate(180deg); }
  .finding__sections { display: flex; flex-direction: column; gap: 16px; padding: 14px 0 4px; }
  .finding__sec h4 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
    margin: 0 0 6px;
  }
  .finding__body {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.6;
  }
  .finding__repro {
    margin: 4px 0 0;
    padding-left: 22px;
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.7;
  }
  .finding__repro li { padding-left: 4px; }

  /* —————————————————————————————————————————————————————————
   * Prose — long-form report body (sections, lists, callouts)
   * Cozier reading rhythm than the default markdown render.
   * ————————————————————————————————————————————————————————— */
  .prose { max-width: none; }

  /* Comfortable reading measure for long-form text only — leaves
     finding cards / tables / toolbars at full page width. */
  .prose > h2,
  .prose > h3,
  .prose > h4,
  .prose > p,
  .prose > ul,
  .prose > ol,
  .prose > blockquote {
    max-width: 820px;
    margin-left: auto;
    margin-right: auto;
  }

  .prose > h2 {
    margin-top: 56px;
    margin-bottom: 18px;
  }
  .prose > h2:first-child { margin-top: 32px; }

  .prose h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-1);
    margin: 32px 0 12px;
    line-height: 1.35;
    letter-spacing: -0.005em;
    padding-left: 12px;
    border-left: 3px solid var(--brand-soft);
  }
  .prose h3 code { font-size: 14px; }

  .prose h4 {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-1);
    margin: 24px 0 8px;
    line-height: 1.4;
  }

  .prose p {
    margin: 12px 0;
    color: var(--text-2);
    font-size: 15px;
    line-height: 1.7;
  }

  /* Bold-only paragraphs read as soft subheadings — common in QA notes
     ("Why I am NOT filing this..." / "Why it's still worth investigating...") */
  .prose p > strong:only-child,
  .prose p > strong:first-child:last-child {
    color: var(--text-1);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .prose p strong { color: var(--text-1); }

  /* Lists with custom markers */
  .prose ul,
  .prose ol {
    margin: 14px 0 18px;
    padding-left: 0;
    list-style: none;
  }
  .prose ul > li,
  .prose ol > li {
    position: relative;
    padding-left: 26px;
    margin: 8px 0;
    color: var(--text-2);
    font-size: 15px;
    line-height: 1.7;
  }
  .prose ul > li::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 13px;
    width: 6px;
    height: 6px;
    border-radius: 2px;
    background: var(--brand);
    opacity: 0.7;
  }
  .prose ol {
    counter-reset: prose-counter;
  }
  .prose ol > li {
    counter-increment: prose-counter;
  }
  .prose ol > li::before {
    content: counter(prose-counter);
    position: absolute;
    left: 0;
    top: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--brand-soft);
    color: var(--brand);
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-variant-numeric: tabular-nums;
  }

  /* Nested lists tighten up */
  .prose li > ul,
  .prose li > ol { margin: 6px 0 0; }

  /* Inline code in prose — softer, brand-tinted */
  .prose code {
    background: var(--brand-soft);
    color: var(--brand);
    border: 0;
    padding: 1px 6px;
    border-radius: var(--r-xs);
    font-weight: 500;
    font-size: 0.86em;
    word-break: break-word;
  }
  .prose a code { color: inherit; }

  /* Section dividers between H2s — soft, not loud */
  .prose hr {
    border: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--border-strong) 50%, transparent 100%);
    margin: 48px 0;
  }

  /* Blockquotes — gentle callouts */
  .prose blockquote {
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--bg-soft);
    border-left: 3px solid var(--brand);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    color: var(--text-2);
    font-size: 14px;
  }
  .prose blockquote p { margin: 4px 0; }

  /* Tables inside prose keep their own styling, just give them breathing room */
  .prose .table-wrap { margin: 18px 0 28px; }

  @media (max-width: 800px) {
    .prose h3 { font-size: 16px; padding-left: 10px; }
    .prose p, .prose li { font-size: 14px; }
  }

  /* Footer */
  .doc-footer {
    margin-top: 64px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    font-size: 12px;
    color: var(--text-3);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }
  .doc-footer code {
    font-size: 12px;
    background: transparent;
    padding: 0;
    color: var(--text-3);
  }
  .doc-footer__brand {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: var(--text-2);
  }
  .doc-footer__brand-mark {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    background: var(--brand-grad);
    display: inline-block;
  }

  /* Mobile */
  @media (max-width: 800px) {
    .page-wrapper { padding: 24px 16px 64px; }
    .page-title { font-size: 22px; }
    .page-subtitle { margin-left: 0; }
    .page-heading { gap: 12px; }
    .page-heading__mark { width: 36px; height: 36px; }
    h2 { font-size: 18px; margin-top: 36px; }
    .hero { padding: 22px 20px; }
    .hero__body { flex-direction: column; align-items: flex-start; gap: 20px; }
    .hero__title { font-size: 22px; }
    .hero__sub { font-size: 14px; }
    .gauge { width: 130px; }
    .facts { padding: 10px 12px; }
    .note { grid-template-columns: 1fr; gap: 6px; padding: 12px 14px; }
    .kpi__value { font-size: 28px; }
    .dash-card { padding: 16px 18px; }
    .dash-card__donut { flex-direction: column; gap: 16px; align-items: stretch; }
    .donut { margin: 0 auto; }
    .findings-toolbar { position: static; }
    .finding { padding: 18px 16px 16px 22px; }
    .finding::before { left: 8px; }
    .finding__summary { font-size: 15px; }
  }

  /* —————————————————————————————————————————————————————————
   * Table of contents — sticky left rail on wide screens,
   * compact <select> jump-bar on narrow screens.
   * ————————————————————————————————————————————————————————— */
  .toc {
    position: fixed;
    top: 32px;
    /* Right edge sits 20px before the centered page-wrapper.
       Page-wrapper is max-width 1100px and centered, so its left edge
       is at (100vw - 1100) / 2. Width 200 + 20px gap = subtract 220. */
    left: calc((100vw - 1100px) / 2 - 220px);
    width: 200px;
    max-height: calc(100vh - 64px);
    overflow-y: auto;
    padding: 14px 10px 14px 10px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-sm);
    z-index: 10;
    font-size: 12.5px;
  }
  .toc__title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-3);
    margin: 0 0 10px;
    padding-left: 8px;
  }
  .toc__list { list-style: none; margin: 0; padding: 0; }
  .toc__list li { margin: 1px 0; }
  .toc__list a {
    display: block;
    padding: 6px 8px;
    border-radius: var(--r-xs);
    color: var(--text-2);
    text-decoration: none;
    border-left: 2px solid transparent;
    transition: background 0.12s, color 0.12s, border-color 0.12s;
    line-height: 1.35;
  }
  .toc__list a:hover { background: var(--bg-soft); color: var(--text-1); }
  .toc__list a.is-active {
    background: var(--brand-soft);
    color: var(--brand);
    border-left-color: var(--brand);
    font-weight: 600;
  }
  .toc-mobile { display: none; }
  @media (max-width: 1580px) {
    .toc { display: none; }
    .toc-mobile {
      display: block;
      margin: -8px 0 24px;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      box-shadow: var(--shadow-xs);
    }
    .toc-mobile__label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-3);
      margin-bottom: 4px;
    }
    .toc-mobile__select {
      width: 100%;
      border: 0;
      background: transparent;
      font: inherit;
      font-size: 14px;
      color: var(--text-1);
      padding: 4px 0;
    }
  }

  /* —————————————————————————————————————————————————————————
   * Diff status cells — first column of the Diff vs prior table
   * gets a colored dot + tinted text matching the dashboard pills.
   * ————————————————————————————————————————————————————————— */
  td.diff-status {
    font-weight: 600;
    font-size: 12.5px;
    letter-spacing: 0.01em;
    white-space: nowrap;
    min-width: 130px;
    color: var(--text-2);
  }
  td.diff-status::before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: 1px;
    background: currentColor;
  }
  td.diff-status strong { color: inherit; font-weight: 700; }
  td.diff-status--persistent   { color: var(--text-3); }
  td.diff-status--scopeChanged { color: var(--high-ink); background: rgba(249, 115, 22, 0.04); }
  td.diff-status--new          { color: var(--crit-ink); background: rgba(239, 68, 68, 0.05); }
  td.diff-status--confirmed    { color: var(--high-ink); }
  td.diff-status--refuted      { color: var(--ok-ink); background: rgba(16, 185, 129, 0.05); }
  td.diff-status--notSeen      { color: var(--ok-ink); }
  td.diff-status--resolved     { color: var(--ok-ink); }
  td.diff-status--superseded   { color: var(--low-ink); }
  td.diff-status--notRetested  { color: var(--text-4); }

  /* —————————————————————————————————————————————————————————
   * Table overflow — long slug paths inside <code> blew up column
   * widths. Break only inside code elements; leave plain prose alone
   * so hyphenated words like "user-account-page" don't shred apart.
   * ————————————————————————————————————————————————————————— */
  .table-wrap td code,
  .table-wrap th code {
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
    font-size: 11.5px;
    padding: 1px 5px;
  }
  /* Long inline code refs inside H2 headings (paths, file names) —
     break aggressively instead of pushing the heading across many lines */
  .prose h2 code,
  .prose h2 a code {
    font-size: 0.72em;
    word-break: break-all;
    overflow-wrap: anywhere;
    padding: 1px 6px;
  }

  /* Smooth-scroll jumps from TOC clicks */
  html { scroll-behavior: smooth; scroll-padding-top: 16px; }

  @media print {
    body { background: #fff; }
    .toc, .toc-mobile { display: none; }
    .findings-toolbar { display: none; }
    .finding, .kpi, .dash-card, .hero, .meta { box-shadow: none; border: 1px solid var(--border); }
    .finding:hover, .kpi:hover { transform: none; }
  }
</style>
</head>
<body>
${tocHtml ? tocHtml.aside : ''}
<main class="page-wrapper">
  <header class="page-heading">
    <span class="page-heading__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
    </span>
    <h1 class="page-title">${title}</h1>
  </header>
  <p class="page-subtitle">QA Report</p>
  ${tocHtml ? tocHtml.mobile : ''}
  <section class="meta" aria-label="Run metadata">${metaBlockHtml}</section>
  ${dashboardHtml || ''}
  <div class="prose">
  ${body}
  </div>
  <footer class="doc-footer">
    <span class="doc-footer__brand"><span class="doc-footer__brand-mark"></span>QA Report</span>
    <span>Source · <code>${sourceName}</code></span>
    <span>Rendered ${escapeHtml(generated)}</span>
  </footer>
</main>
<script>
(function () {
  var chips = document.querySelectorAll('.filter-chip');
  var cards = document.querySelectorAll('article.finding');
  if (chips.length && cards.length) {
    var apply = function (sev) {
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.dataset.sev === sev));
      });
      cards.forEach(function (card) {
        var match = sev === 'all' || card.dataset.sev === sev;
        card.style.display = match ? '' : 'none';
      });
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () { apply(c.dataset.sev); });
    });
  }

  // TOC active-section highlight via IntersectionObserver
  var tocLinks = document.querySelectorAll('.toc__list a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      byId[id] = a;
    });
    var headings = Array.prototype.filter.call(
      document.querySelectorAll('h2[id]'),
      function (h) { return byId[h.id]; }
    );
    var visible = new Set();
    var setActive = function () {
      // Active = first visible H2 in document order; fallback to last passed.
      var active = null;
      for (var i = 0; i < headings.length; i += 1) {
        if (visible.has(headings[i].id)) { active = headings[i].id; break; }
      }
      if (!active) {
        var passed = headings.filter(function (h) { return h.getBoundingClientRect().top < 80; });
        active = passed.length ? passed[passed.length - 1].id : (headings[0] && headings[0].id);
      }
      tocLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
      });
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id); else visible.delete(e.target.id);
      });
      setActive();
    }, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });
    headings.forEach(function (h) { io.observe(h); });
    setActive();
  }
})();
</script>
</body>
</html>
`;
}

function stripHeader(md) {
  const lines = md.split('\n');
  let i = 0;
  while (i < lines.length && !lines[i].startsWith('# ')) i++;
  if (i < lines.length) i++;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (/^-\s+\*\*[^*]+:\*\*/.test(line)) {
      i++;
      continue;
    }
    break;
  }
  return lines.slice(i).join('\n');
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node render-report.js <path/to/report.md>');
    process.exit(1);
  }
  const absPath = path.resolve(inputPath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  const md = fs.readFileSync(absPath, 'utf8');
  const meta = extractHeaderMeta(md);
  const { findings, placeholderMd } = extractFindings(md);
  const trimmedMd = stripHeader(placeholderMd);

  const coverage = extractCoverageStats(md);
  const diff = extractDiffCounts(md);
  const incomplete = isRunIncomplete(md);

  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: false,
    mangle: false,
  });
  let bodyHtml = marked.parse(trimmedMd);
  bodyHtml = postProcessHtml(bodyHtml);

  bodyHtml = bodyHtml.replace(/<!--FINDING_(\d+)-->/g, (_match, idx) => {
    const f = findings[Number(idx)];
    return f ? renderFindingCard(f) : '';
  });

  bodyHtml = bodyHtml.replace(
    /<p>\s*(<article class="finding[\s\S]*?<\/article>)\s*<\/p>/g,
    '$1',
  );

  const toolbarHtml = renderFindingsToolbar(findings);
  if (toolbarHtml) {
    const firstIdx = bodyHtml.indexOf('<article class="finding');
    if (firstIdx !== -1) {
      bodyHtml =
        bodyHtml.slice(0, firstIdx) + toolbarHtml + bodyHtml.slice(firstIdx);
    }
  }

  const dashboardHtml = renderDashboard({
    findings,
    coverage,
    diff,
    isIncomplete: incomplete,
  });
  const toc = extractToc(bodyHtml);
  const tocHtml = buildTocHtml(toc);

  const html = renderHtml({
    meta,
    body: bodyHtml,
    mdPath: absPath,
    dashboardHtml,
    tocHtml,
  });

  const outPath = absPath.replace(/\.md$/i, '.html');
  fs.writeFileSync(outPath, html);

  const counts = SEVERITY_ORDER.reduce((acc, s) => {
    acc[s] = findings.filter(
      f => (f.severity || '').toLowerCase() === s,
    ).length;
    return acc;
  }, {});

  console.log(`Rendered: ${outPath}`);
  console.log(
    `Findings parsed: ${findings.length} (${SEVERITY_ORDER.map(s => `${s}:${counts[s]}`).join(', ')})`,
  );
}

main();
