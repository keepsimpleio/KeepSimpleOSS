---
name: keepsimple-qa
description: Use when the user asks to run a QA pass, test the site, or check production for regressions on keepsimple.io. Drives a real browser via the Playwright MCP server, visits each route in the test plan, interacts with key features, and produces a structured findings report (md + html). Do NOT use for writing Playwright spec files — that's a different task.
---

# QA Agent — Method Playbook

You are running a manual QA pass on a production website. You drive a real Chromium browser via the Playwright MCP server. Your output is a structured findings report.

The **profile** that invoked you (a slash command from `.claude/commands/qa-*.md`) defines the **scope**: which routes, locales, and viewports. This skill defines the **method**: how to run any pass.

If `qa-config.yml` is missing, stop and tell the user to run `/qa-init` first. Do not invent routes.

## How to run

1. Read `qa-config.yml` for the route list, locales, viewports, and target environment (production / staging).
2. Read `known-issues.md` if it exists. Anything listed there is NOT a finding — do not report it.
3. Read the file referenced by `qa-config.yml`'s optional `design_system:` field, if set. Use it to spot design-system violations.
4. Run the **fixed pass** first (the must-work flows below), then the **exploratory pass**.
5. Output the findings report at the path defined by your invoking slash command (or by `PROFILES.md` if invoked manually). Filename patterns:
   - `reports/YYYY-MM-DD.md` for canonical
   - `reports/YYYY-MM-DD-smoke.md` for smoke
   - `reports/YYYY-MM-DD-locale-smoke.md` for locale-smoke
   - `reports/YYYY-MM-DD-mobile.md` for mobile-followup
   - `reports/YYYY-MM-DD-full-matrix.md` for full-matrix
   - `reports/YYYY-MM-DD-retest-{ids}.md` for retest (e.g. `retest-F5-F7`)
     Use the timezone in `qa-config.yml`'s `report_timezone:` field if set, otherwise UTC.
6. After writing the markdown, render an HTML version: `node .claude/keepsimple-qa/render-report.js reports/<filename>.md`. The HTML lives next to the markdown and is what humans read.

This skill is loaded by an activation prompt — typically a slash command from `.claude/commands/qa-*.md` (one per profile). The slash command tells you which profile to run; this skill tells you how to run any profile. **Profile = scope** (which routes, locales, viewports). **Skill = method** (the pre-flight, fixed pass, exploratory pass, checklists, severity rubric).

## Pre-flight (run before any pass)

1. Confirm Playwright MCP is connected. If not, stop and report what's missing.
2. Navigate to the environment URL (production or staging) once.
3. If navigation fails (MCP error, DNS, 5xx), STOP. Write a single critical finding describing the failure, with category `broken-flow`. Do not proceed to the fixed or exploratory pass.
4. Dismiss any blocking UI listed in `known-issues.md` (e.g. cookie consent banners, promo modals, GDPR overlays).
5. Confirm the page title and `<html lang>` attribute match the expected locale.
6. Capture the build ID(s) — for Next.js sites this is `window.__NEXT_DATA__.buildId`; for other frameworks it might be a meta tag, a `<script>` src hash, or a header. Log them in the report metadata. **If the site is built from multiple apps with independent deploy pipelines** (e.g. a marketing shell embedding a separately-deployed product app), capture each build ID separately — persistence of a finding can mean different things on different routes.

## Fixed pass — must-work flows

For every section in `qa-config.yml` (under `sections:`), and on every locale listed in `qa-config.yml`'s `locales:`:

- **Locale URL behavior:** verify the locale-prefix rule from `qa-config.yml`'s `locale_url_strategy:` field works (e.g. en routes unprefixed, ru routes get `/ru/` prefix). Verify by switching locale via the site's locale switcher (if one exists) and confirming both URL prefix and page text change.
- **Section's main route renders without console errors.**
- **Primary interactive element works.** Each section in `qa-config.yml` may declare a `primary_interaction:` (e.g. "open modal X", "filter by Y", "submit search"). If declared, exercise it and verify it responds. If not declared, click the most prominent button/link in the main content area and verify a non-trivial response.
- **404 page renders for an unknown route** under that section's path (try `<section_path>/this-does-not-exist-zzz`).
- **Mobile viewport (configured size, default 390×844):** page renders, no horizontal scroll, mobile navigation is present.

If any of these fail, mark the finding as **severity: high** at minimum.

## Exploratory pass — concrete requirements

The exploratory pass is the high-value part of the run. It is NOT optional and NOT to be shortened to "stay in budget." If the budget is tight, run fewer locales — but for the locales you do run, exhaustively cover every route in `qa-config.yml`.

### Coverage requirements (all must be met)

- **Every route in `qa-config.yml` is visited.** Do not silently skip routes. If a route is unreachable (auth-gated, 5xx, redirect to a route already covered), explicitly note it in the "Routes I could not reach" section of the report with the reason.
- **Routes listed under a section's `auth_required:` field are intentionally skipped.** Do not attempt to navigate to them. Record them in the coverage table with status `skipped — auth required (configured)` and source the section name. They are not coverage failures and must not be flagged as findings; the human knows they are gated.
- **Every section is tested on both desktop AND mobile viewports** (when the profile mandates mobile coverage). If you must cut, drop a locale, not a viewport.
- **Every section is tested on at least 2 locales** (the default locale + one other) when more than one locale is configured. Locale-specific bugs are common; default-only is not acceptable for a real run.

### Per-route interaction requirements

For each route, perform AT LEAST these interactions in order:

1. **Snapshot:** capture the accessibility tree.
2. **Console + network watch:** open the network panel, watch for 4xx/5xx, console errors, console warnings.
3. **Click every primary interactive element on the page:** all nav tabs, all cards in the main content area, all filter/toggle controls, all expandable sections. If there are more than 10 such elements, click at least 10 (sampled across the page, not all from one corner).
4. **Open every modal/overlay** that's reachable from the page (info popups, settings, tooltips on hover, image lightboxes).
5. **Fill at least one form** if the page has any (search box, filter input, signup field — without submitting if it would create real data; the constraint to NOT log in / submit data still applies).
6. **Switch locale once** via the site's locale switcher (if not already covered by another route's pass) and confirm the page text changes.
7. **Scroll to the bottom of the page** to check for footer rendering, lazy-loaded content failures, or layout shift.
8. **Resize once** from desktop → mobile (or vice versa) without reload, and confirm the page handles the resize gracefully (no broken layout).
9. **One "weird" interaction:** rapid double-click on a button, navigate away mid-load, open a modal then resize, hit browser back button.

### Per-page checklist

For every page visited, the agent must affirmatively report on:

- **Console errors:** count + message summary if any.
- **Network failures:** count of 4xx/5xx + offending URLs.
- **Broken images:** any `<img>` with status code != 200, missing alt text on critical images, or `naturalWidth: 0`.
- **Layout integrity:** any horizontal scroll on mobile, any text overflow, any element clipped or overlapping.
- **Interaction integrity:** all clicked elements responded (no dead buttons, no "click does nothing" cases).
- **Title and `<html lang>` consistency:** if `lang="X"`, the title and main content should be in language X. Mismatches are localization bugs.
- **SEO basics:** `<title>` non-empty, `<link rel="canonical">` present and matches the URL, JSON-LD structured-data `url` field matches the URL with locale prefix preserved, `<meta name="twitter:url">` and `<meta property="og:url">` consistent. These checks have caught real bugs in past runs and should not be skipped.

### Budget guidance

- **Soft target: 10–15 min per section.** Use it as guidance for pacing, not as permission to skip routes.
- **If you're at the soft target with routes still uncovered: keep going, but flag in the report** that the run took longer than soft target.
- **Hard cap: 30 min per section.** If you hit this, stop on the current section, document what was covered, and move to the next.

## Findings format

Each finding is a JSON object appended to the report:

```json
{
  "id": "auto-incrementing",
  "route": "/path",
  "locale": "en",
  "viewport": "desktop|mobile",
  "severity": "critical|high|medium|low",
  "category": "regression|design-system|accessibility|performance|console-error|broken-flow",
  "summary": "One sentence.",
  "detail": "What you saw, what you expected, why it matters.",
  "evidence": "Path to screenshot or trace, or a browser_evaluate result snippet.",
  "reproduction": "Numbered steps."
}
```

Severity rubric:

- **critical**: page doesn't load, or a primary flow is fully broken.
- **high**: a primary feature is degraded but not fully broken.
- **medium**: design-system violation or accessibility issue that's clearly wrong but doesn't block use.
- **low**: cosmetic, or "this could be better."

## Constraints

- Do NOT log in, sign up, or submit any form that creates real data on production.
- Do NOT report anything listed in `known-issues.md`.
- Do NOT invent severity — if uncertain, go one level lower.
- Do NOT spam findings about the same root cause across multiple routes — group them as one finding with multiple affected routes.
- If you can't tell whether something is intentional, mark it **low** with category `design-system` and let the human decide.
- Do NOT silently skip routes from `qa-config.yml`. If a route is unreachable, list it in the "Routes I could not reach" section with the reason — silence is treated as a coverage failure.
- Do NOT trim viewport coverage to stay in budget when the profile mandates a viewport. Mobile is mandatory if the profile says so. If you must cut to fit time, drop a locale, never a viewport.
- Do NOT mark a real run as complete if the Coverage report table shows <100% on routes or viewports without an explicit "**Run is incomplete**" statement at the top of the findings summary explaining what was missed and why.

## Coverage report (required in every real run)

In addition to findings, every real run must include a "Coverage report" table near the top showing, per section:

- Total routes in `qa-config.yml`
- Routes visited (per locale × viewport cell)
- Routes skipped (with reason for each)
- Locales covered
- Viewports covered

This makes coverage gaps visible and prevents the agent from quietly trimming scope. The coverage table is REQUIRED, not optional. If the table shows <100% on routes/viewports, the report is incomplete and must say so explicitly in the summary.

## Report header

Start the report with:

- Run date and time (in `report_timezone` from config, or UTC).
- Environment (production / staging).
- Profile (smoke / canonical / etc.).
- Build ID(s) observed.
- Pre-flight result.
- Routes covered.
- Total findings by severity.
- Diff vs previous report: new findings, scope-changed findings, persistent findings, not-seen-this-run findings.

## Diff against the prior run

If a prior report exists for the same profile (or a paired profile, e.g. canonical pairs with mobile-followup), include a "Diff vs prior" table classifying each open finding as:

- **persistent** — reproduces verbatim
- **persistent + scope expanded/shifted** — reproduces but on different routes/locales than before
- **new (this run)** — first observed
- **confirmed** — was tentatively flagged before, now confirmed
- **refuted** — does not reproduce, suspect fix shipped
- **not seen this run** — was open, didn't reproduce, but treat as transient (open + not-seen)
- **resolved** — confirmed fix
- **superseded** — supplanted by another finding

The renderer color-codes these in the HTML report; using these exact phrases keeps the dashboard accurate.

## Multi-app build IDs

If the project is split across multiple apps with independent deploy pipelines (e.g. a marketing shell embedding a separately-deployed product app), capture build IDs per-route on the first visit to each section, and note all build IDs in the metadata header. When two apps deploy independently, persistence of a finding can mean "fix shipped on app A but not app B" — without per-app build IDs you can't tell.

## After the run

- Render HTML: `node .claude/keepsimple-qa/render-report.js reports/<filename>.md`
- Return a 5-8 line summary in chat: profile, route coverage %, finding counts by severity, persistent vs new breakdown, run status (complete / incomplete and why).
- Do NOT auto-update any tracking file (e.g. a findings register). The user reviews the report and updates tracking manually.
