#!/usr/bin/env node
/**
 * qa-helper — token-cheap utilities for the Officer.
 *
 * All commands print a single JSON object to stdout (or a JSON array for batches).
 * Errors print to stderr; exit code 0 = success, non-zero = hard failure.
 *
 * The Officer invokes this via Bash. The model never sees the secret bytes;
 * it only sees structured results.
 *
 * Subcommands:
 *   fingerprint <url> [--auth] [--save <slug> <route-key>]
 *   diff-fingerprint <url> [--auth] <slug> <route-key>
 *   batch-fingerprint <slug> [--auth] [--save]   # reads routes from projects/<slug>/qa-config.yml
 *   axe <url> [--auth]
 *   vitals <url> [--auth] [--viewport desktop|mobile]
 *   screenshot <url> [--auth] [--viewport desktop|mobile] --out <path>
 *   visual-diff <baseline.png> <current.png> [--threshold 0.005] [--diff-out <path>]
 *   capture-baseline <slug> <route-key> <url> [--auth] [--viewport desktop|mobile]
 *   compare-baseline <slug> <route-key> <url> [--auth] [--viewport desktop|mobile]
 *   auth-setup <slug> <url>                      # storage_state capture (manual cookie paste)
 */

import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, join } from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import YAML from 'yaml';

// Single-project mode: invoked from the repo root.
// All paths live under qa-runs/. The `slug` arg in function signatures
// is accepted but ignored for path construction.
const QA_ROOT = process.cwd();
const SECRETS_PATH = `${QA_ROOT}/secrets/cf-access.env`;
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 390, height: 844 },
};

// ─── arg parsing ────────────────────────────────────────────────────────────

// Boolean-only flags (no value follows). Anything else takes the next arg.
const BOOLEAN_FLAGS = new Set(['auth', 'save']);

function parseArgs(argv) {
  const cmd = argv[2];
  const rest = argv.slice(3);
  const flags = {};
  const positional = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (BOOLEAN_FLAGS.has(k)) {
        flags[k] = true;
      } else {
        const next = rest[i + 1];
        if (next == null || next.startsWith('--')) {
          flags[k] = true;
        } else {
          flags[k] = next;
          i++;
        }
      }
    } else {
      positional.push(a);
    }
  }
  return { cmd, flags, positional };
}

function loadAuthHeaders(useAuth) {
  if (!useAuth) return {};
  if (!existsSync(SECRETS_PATH)) {
    throw new Error(`auth requested but ${SECRETS_PATH} not found`);
  }
  const env = Object.fromEntries(
    readFileSync(SECRETS_PATH, 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#') && l.includes('='))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
  );
  if (!env.QA_CF_ACCESS_CLIENT_ID || !env.QA_CF_ACCESS_CLIENT_SECRET) {
    throw new Error('cf-access.env missing client_id or client_secret');
  }
  return {
    'CF-Access-Client-Id': env.QA_CF_ACCESS_CLIENT_ID,
    'CF-Access-Client-Secret': env.QA_CF_ACCESS_CLIENT_SECRET,
  };
}

function loadStorageState(slug) {
  const path = `${QA_ROOT}/qa-runs/auth/storage_state.json`;
  if (!existsSync(path)) return null;
  return path;
}

async function newContext(headers, storageStatePath, viewportName = 'desktop') {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
  });
  const ctx = await browser.newContext({
    viewport: VIEWPORTS[viewportName] || VIEWPORTS.desktop,
    extraHTTPHeaders: headers,
    ...(storageStatePath ? { storageState: storageStatePath } : {}),
  });
  return { browser, ctx };
}

// ─── fingerprint ────────────────────────────────────────────────────────────

/**
 * Compute a stable fingerprint of a URL.
 *
 * Combines:
 *   - HTTP status
 *   - selected response headers (etag, last-modified, x-nextjs-cache,
 *     cf-cache-status, content-length)
 *   - sha256 of the rendered HTML body (after Playwright settles), with
 *     timestamps / nonces / random tokens normalized out where possible.
 *
 * The fingerprint is deliberately tolerant of CDN cache-status flips and
 * date headers, so an unchanged route gives a stable hash across hours.
 */
async function fingerprint(url, useAuth) {
  const headers = loadAuthHeaders(useAuth);
  const { browser, ctx } = await newContext(headers);
  try {
    const page = await ctx.newPage();
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = resp ? resp.status() : 0;
    const finalUrl = page.url();
    const respHeaders = resp ? resp.headers() : {};

    // Detect CF Access login redirect — fingerprint is meaningless if we hit the gate.
    const isCfLogin = finalUrl.includes('cloudflareaccess.com');
    if (isCfLogin) {
      return {
        url, status, finalUrl, fingerprint: null,
        error: 'cf_access_login', isCfLogin: true,
      };
    }

    // Capture rendered HTML. Strip volatile things: csrf tokens (next.js _csrf),
    // date stamps in known patterns, build IDs in chunk paths, runtime nonces.
    let html = await page.content();
    html = html
      // ISO timestamps
      .replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?\b/g, '__TS__')
      // Unix epochs (10/13 digit)
      .replace(/\b1[6-9]\d{8,11}\b/g, '__EPOCH__')
      // Next.js build hash in chunk URLs
      .replace(/\/_next\/static\/[a-zA-Z0-9_-]{6,}\//g, '/_next/static/__BUILD__/')
      // CSP nonces
      .replace(/nonce="[^"]+"/g, 'nonce="__N__"')
      // CSRF tokens (heuristic)
      .replace(/(name=("|')_?csrf("|')\s+value=("|'))[^"']+/gi, '$1__CSRF__')
      // Random ID suffixes in IDs/classes (heuristic)
      .replace(/[a-z]+-[a-f0-9]{6,}/g, '$&'); // keep — too aggressive otherwise

    const hash = createHash('sha256').update(html).digest('hex');

    // Pick a small set of headers that are stable for unchanged content.
    const stableHeaders = {
      etag: respHeaders.etag || null,
      'last-modified': respHeaders['last-modified'] || null,
      'content-length': respHeaders['content-length'] || null,
      'x-nextjs-cache': respHeaders['x-nextjs-cache'] || null,
    };

    return {
      url, status, finalUrl, fingerprint: hash,
      htmlBytes: html.length,
      headers: stableHeaders,
      capturedAt: new Date().toISOString(),
    };
  } finally {
    await browser.close();
  }
}

function fingerprintStorePath(slug) {
  return `${QA_ROOT}/qa-runs/state/fingerprints.json`;
}

function loadFingerprintStore(slug) {
  const path = fingerprintStorePath(slug);
  if (!existsSync(path)) return { routes: {} };
  return JSON.parse(readFileSync(path, 'utf8'));
}

function saveFingerprintStore(slug, store) {
  const path = fingerprintStorePath(slug);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(store, null, 2));
}

async function diffFingerprint(url, useAuth, slug, routeKey) {
  const store = loadFingerprintStore(slug);
  const prior = store.routes[routeKey];
  const current = await fingerprint(url, useAuth);
  const verdict = !prior
    ? 'new'
    : current.fingerprint === null
    ? 'errored'
    : current.fingerprint === prior.fingerprint
    ? 'unchanged'
    : 'changed';
  return {
    routeKey, url, verdict,
    prior: prior ? { fingerprint: prior.fingerprint, capturedAt: prior.capturedAt } : null,
    current: { fingerprint: current.fingerprint, status: current.status, capturedAt: current.capturedAt, error: current.error },
  };
}

async function batchFingerprint(slug, useAuth, save) {
  const config = loadConfig(slug);
  const baseUrl = config.environment.production.replace(/\/$/, '');
  const store = loadFingerprintStore(slug);
  const results = [];

  for (const [sectionName, section] of Object.entries(config.sections || {})) {
    for (const route of section.routes || []) {
      const routeKey = `${sectionName}::${route}`;
      const url = baseUrl + route;
      try {
        const current = await fingerprint(url, useAuth);
        const prior = store.routes[routeKey];
        const verdict = !prior
          ? 'new'
          : current.fingerprint === null
          ? 'errored'
          : current.fingerprint === prior.fingerprint
          ? 'unchanged'
          : 'changed';
        results.push({ routeKey, url, verdict, current, prior });
        if (save && current.fingerprint) {
          store.routes[routeKey] = current;
        }
      } catch (e) {
        results.push({ routeKey, url, verdict: 'errored', error: e.message });
      }
    }
  }
  if (save) {
    store.lastBatchAt = new Date().toISOString();
    saveFingerprintStore(slug, store);
  }
  return {
    slug,
    summary: {
      total: results.length,
      unchanged: results.filter(r => r.verdict === 'unchanged').length,
      changed: results.filter(r => r.verdict === 'changed').length,
      new: results.filter(r => r.verdict === 'new').length,
      errored: results.filter(r => r.verdict === 'errored').length,
    },
    results: results.map(r => ({
      routeKey: r.routeKey,
      url: r.url,
      verdict: r.verdict,
      status: r.current?.status,
      error: r.current?.error || r.error,
    })),
  };
}

function loadConfig(slug) {
  const path = `${QA_ROOT}/qa-config.yml`;
  if (!existsSync(path)) throw new Error(`no qa-config.yml at ${path}`);
  return YAML.parse(readFileSync(path, 'utf8'));
}

// ─── axe accessibility scan ──────────────────────────────────────────────────

async function runAxe(url, useAuth) {
  const headers = loadAuthHeaders(useAuth);
  const { browser, ctx } = await newContext(headers);
  try {
    const page = await ctx.newPage();
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = resp ? resp.status() : 0;
    const finalUrl = page.url();

    // Inject axe-core from local node_modules so we don't need a network fetch.
    const axePath = `${QA_ROOT}/node_modules/axe-core/axe.min.js`;
    await page.addScriptTag({ path: axePath });

    const result = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      return await axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
        resultTypes: ['violations'],
      });
    });

    return {
      url, finalUrl, status,
      summary: {
        total: result.violations.length,
        critical: result.violations.filter(v => v.impact === 'critical').length,
        serious: result.violations.filter(v => v.impact === 'serious').length,
        moderate: result.violations.filter(v => v.impact === 'moderate').length,
        minor: result.violations.filter(v => v.impact === 'minor').length,
      },
      violations: result.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodeCount: v.nodes.length,
        sample: v.nodes.slice(0, 3).map(n => ({ html: n.html.slice(0, 200), target: n.target })),
      })),
    };
  } finally {
    await browser.close();
  }
}

// ─── Web Vitals ──────────────────────────────────────────────────────────────

async function captureVitals(url, useAuth, viewportName = 'desktop') {
  const headers = loadAuthHeaders(useAuth);
  const { browser, ctx } = await newContext(headers, null, viewportName);
  try {
    const page = await ctx.newPage();

    // Set up CLS + LCP observers BEFORE any navigation. Use raw PerformanceObserver
    // (no library) so we don't depend on global-exposure quirks of web-vitals IIFE.
    await page.addInitScript(() => {
      window.__qa_vitals__ = { CLS: 0, LCP: 0, FCP: 0, TTFB: 0 };
      try {
        new PerformanceObserver(list => {
          for (const e of list.getEntries()) {
            if (!e.hadRecentInput) window.__qa_vitals__.CLS += e.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {}
      try {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) window.__qa_vitals__.LCP = last.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {}
      try {
        new PerformanceObserver(list => {
          for (const e of list.getEntries()) {
            if (e.name === 'first-contentful-paint') window.__qa_vitals__.FCP = e.startTime;
          }
        }).observe({ type: 'paint', buffered: true });
      } catch {}
    });

    const resp = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    const status = resp ? resp.status() : 0;

    // Allow time for LCP candidates and layout shifts to settle.
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(800);

    const vitals = await page.evaluate(() => {
      const v = window.__qa_vitals__ || {};
      // TTFB from navigation timing
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) v.TTFB = Math.max(0, nav.responseStart - nav.startTime);
      // Round
      for (const k of Object.keys(v)) {
        v[k] = k === 'CLS' ? Number(v[k].toFixed(4)) : Math.round(v[k]);
      }
      return v;
    });

    const thresholds = { LCP: 2500, FCP: 1800, CLS: 0.1, TTFB: 800 };
    const verdict = {};
    for (const [k, v] of Object.entries(vitals)) {
      const t = thresholds[k];
      if (t == null || v == null) { verdict[k] = 'unmeasured'; continue; }
      // CLS=0 is perfect; for LCP/FCP/TTFB treat 0 as unmeasured.
      if (v === 0 && k !== 'CLS') { verdict[k] = 'unmeasured'; continue; }
      verdict[k] = v <= t ? 'good' : v <= t * 1.5 ? 'needs-improvement' : 'poor';
    }

    return { url, status, viewport: viewportName, vitals, verdict, thresholds };
  } finally {
    await browser.close();
  }
}

// ─── Screenshot + visual diff ────────────────────────────────────────────────

async function captureScreenshot(url, useAuth, viewportName, outPath) {
  const headers = loadAuthHeaders(useAuth);
  const { browser, ctx } = await newContext(headers, null, viewportName);
  try {
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    mkdirSync(dirname(outPath), { recursive: true });
    await page.screenshot({ path: outPath, fullPage: true });
    const stat = statSync(outPath);
    return { url, viewport: viewportName, path: outPath, bytes: stat.size };
  } finally {
    await browser.close();
  }
}

function visualDiff(baselinePath, currentPath, threshold = 0.005, diffOutPath = null) {
  if (!existsSync(baselinePath)) return { hasBaseline: false };
  if (!existsSync(currentPath)) throw new Error(`current image not found: ${currentPath}`);
  const baseline = PNG.sync.read(readFileSync(baselinePath));
  const current = PNG.sync.read(readFileSync(currentPath));
  if (baseline.width !== current.width || baseline.height !== current.height) {
    return {
      hasBaseline: true,
      sizesDiffer: true,
      baselineSize: { w: baseline.width, h: baseline.height },
      currentSize: { w: current.width, h: current.height },
      diffPercent: 100,
    };
  }
  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  const pixelsDifferent = pixelmatch(baseline.data, current.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });
  const total = width * height;
  const diffPercent = (pixelsDifferent / total) * 100;
  if (diffOutPath) {
    mkdirSync(dirname(diffOutPath), { recursive: true });
    writeFileSync(diffOutPath, PNG.sync.write(diff));
  }
  return {
    hasBaseline: true,
    sizesDiffer: false,
    pixelsDifferent,
    totalPixels: total,
    diffPercent: Number(diffPercent.toFixed(4)),
    threshold,
    verdict: diffPercent / 100 > threshold ? 'regressed' : 'ok',
    diffImage: diffOutPath,
  };
}

function baselinePath(slug, routeKey, viewport) {
  const safe = routeKey.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${QA_ROOT}/qa-runs/baselines/${safe}-${viewport}.png`;
}

function currentScreenshotPath(slug, routeKey, viewport) {
  const safe = routeKey.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${QA_ROOT}/qa-runs/screenshots/${safe}-${viewport}.png`;
}

async function captureBaseline(slug, routeKey, url, useAuth, viewport) {
  const out = baselinePath(slug, routeKey, viewport);
  const r = await captureScreenshot(url, useAuth, viewport, out);
  return { ...r, role: 'baseline' };
}

async function compareBaseline(slug, routeKey, url, useAuth, viewport) {
  const baseline = baselinePath(slug, routeKey, viewport);
  const current = currentScreenshotPath(slug, routeKey, viewport);
  const cap = await captureScreenshot(url, useAuth, viewport, current);
  const diff = visualDiff(baseline, current, 0.005, current.replace(/\.png$/, '-diff.png'));
  return { url, viewport, current, baseline, ...diff, screenshotBytes: cap.bytes };
}

// ─── auth-setup (storage_state) ──────────────────────────────────────────────

async function authSetup(slug, url) {
  // Headless browser cannot do email-OTP. We need the user to provide the
  // CF_Authorization JWT cookie value (they get it from their own browser
  // devtools after a normal CF Access login). We then bake it into a Playwright
  // storage_state.json under projects/<slug>/auth/.
  //
  // Usage flow surfaced to the user by /qa-auth-setup:
  //   1. Log into <url> in your normal browser
  //   2. Open devtools → Application → Cookies → find CF_Authorization
  //   3. Run: qa-helper auth-setup <slug> <url> --cf-jwt <value>
  // (We accept --cf-jwt via flag rather than env to keep model context clean.)
  throw new Error('auth-setup is invoked indirectly by /qa-auth-setup; see that command.');
}

async function authSetupWithJwt(slug, url, cfJwt) {
  if (!cfJwt || cfJwt.length < 100) {
    throw new Error('cf-jwt looks too short; pass the full CF_Authorization cookie value');
  }
  const u = new URL(url);
  const storageState = {
    cookies: [{
      name: 'CF_Authorization',
      value: cfJwt,
      domain: u.hostname,
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7d nominal
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    }],
    origins: [],
  };
  const out = `${QA_ROOT}/qa-runs/auth/storage_state.json`;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(storageState, null, 2));
  return { slug, url, savedTo: out, expiresIn: '7 days nominal — refresh anytime via /qa-auth-setup' };
}

// ─── dispatch ────────────────────────────────────────────────────────────────

async function main() {
  const { cmd, flags, positional } = parseArgs(process.argv);
  let result;

  switch (cmd) {
    case 'fingerprint': {
      const url = positional[0];
      result = await fingerprint(url, !!flags.auth);
      if (flags.save) {
        const [slug, routeKey] = positional.slice(1);
        if (!slug || !routeKey) throw new Error('--save requires <slug> <route-key>');
        const store = loadFingerprintStore(slug);
        store.routes[routeKey] = result;
        saveFingerprintStore(slug, store);
        result.savedAs = `${slug}::${routeKey}`;
      }
      break;
    }
    case 'diff-fingerprint': {
      const [url, slug, routeKey] = positional;
      result = await diffFingerprint(url, !!flags.auth, slug, routeKey);
      break;
    }
    case 'batch-fingerprint': {
      const slug = positional[0];
      result = await batchFingerprint(slug, !!flags.auth, !!flags.save);
      break;
    }
    case 'axe': {
      result = await runAxe(positional[0], !!flags.auth);
      break;
    }
    case 'vitals': {
      result = await captureVitals(positional[0], !!flags.auth, flags.viewport || 'desktop');
      break;
    }
    case 'screenshot': {
      result = await captureScreenshot(positional[0], !!flags.auth, flags.viewport || 'desktop', flags.out);
      break;
    }
    case 'visual-diff': {
      result = visualDiff(positional[0], positional[1], parseFloat(flags.threshold || '0.005'), flags['diff-out'] || null);
      break;
    }
    case 'capture-baseline': {
      const [slug, routeKey, url] = positional;
      result = await captureBaseline(slug, routeKey, url, !!flags.auth, flags.viewport || 'desktop');
      break;
    }
    case 'compare-baseline': {
      const [slug, routeKey, url] = positional;
      result = await compareBaseline(slug, routeKey, url, !!flags.auth, flags.viewport || 'desktop');
      break;
    }
    case 'auth-setup': {
      const [slug, url] = positional;
      if (flags['cf-jwt']) {
        result = await authSetupWithJwt(slug, url, flags['cf-jwt']);
      } else {
        result = await authSetup(slug, url);
      }
      break;
    }
    default:
      console.error(`unknown command: ${cmd}`);
      console.error('see header comment in qa-helper.mjs for usage.');
      process.exit(2);
  }

  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main().catch(e => {
  console.error('FAIL:', e.message);
  if (process.env.QA_HELPER_DEBUG) console.error(e.stack);
  process.exit(1);
});
