# QA Run Profiles

Each profile defines scope for a single QA pass. The skill (`SKILL.md`) defines method; profiles define scope. Always run profiles in a fresh Claude Code session for the cleanest context.

The defaults below are starting points — `qa-config.yml` overrides everything. If your project has only one locale and one viewport, the locale-smoke and mobile-followup profiles are no-ops; just run smoke / canonical / full-matrix.

---

## smoke

**Purpose:** fastest possible signal — does the site render at all?
**Scope:** one section × default locale × desktop. The default section is the homepage `/` plus whatever section is marked `default: true` in `qa-config.yml`. If none is marked, use the first section.
**Time budget:** 15 min hard cap.
**Output:** `reports/YYYY-MM-DD-smoke.md` (+ rendered `.html`).
**Diff target:** most recent canonical run, if any.
**When to use:** post-deploy verification; confirming the site isn't catastrophically broken before a longer run.

## locale-smoke

**Purpose:** confirm locale-prefix routing works across all configured locales.
**Scope:** one section × all locales × desktop.
**Default section:** the one marked `default: true`, or the first section.
**Time budget:** 25 min hard cap.
**Output:** `reports/YYYY-MM-DD-locale-smoke.md` (+ `.html`).
**Diff target:** most recent canonical run.
**When to use:** after i18n-related changes, or to validate locale infrastructure before a multi-locale follow-up run. Skip this profile if the project is single-locale.

## canonical

**Purpose:** the desktop half of a full pass. Source of truth for desktop findings.
**Scope:** all sections × all locales × desktop.
**Time budget:** 90–120 min, 30-min hard cap per section.
**Output:** `reports/YYYY-MM-DD.md` (+ `.html`).
**Diff target:** previous canonical run.
**When to use:** against a fresh build; primary baseline for findings tracking. Pair with mobile-followup for a complete matrix pass.

## mobile-followup

**Purpose:** the mobile half of a full pass. Pairs with canonical to close the full matrix (locales × 2 viewports = 2N combinations).
**Scope:** all sections × all locales × mobile.
**Time budget:** 90 min, 30-min hard cap per section.
**Output:** `reports/YYYY-MM-DD-mobile.md` (+ `.html`).
**Diff target:** paired canonical run from the same day or build.
**When to use:** paired with each canonical run. Canonical alone is incomplete — mobile-followup makes the pass full-matrix.

## full-matrix

**Purpose:** a single pass covering everything — every section, every locale, every viewport. Use when you want one report rather than a canonical + mobile-followup pair.
**Scope:** all sections × all locales × desktop + mobile.
**Time budget:** 3–4 hours. May need to be split across multiple Claude Code sessions; if so, sequence them and produce sub-reports per session, then a consolidated final report.
**Output:** `reports/YYYY-MM-DD-full-matrix.md` (or `reports/YYYY-MM-DD-full-matrix-part-N.md` for split runs) (+ `.html`).
**Diff target:** previous full-matrix run, or most recent canonical+mobile-followup pair.
**When to use:** major releases; quarterly baselines; when you want the cleanest single artifact rather than a pair.

## retest

**Purpose:** verify specific findings by ID after a deploy or local fix.
**Scope:** only the routes referenced by the named finding IDs (provided by the user).
**Time budget:** 5 min per finding ID, 30 min cap.
**Output:** `reports/YYYY-MM-DD-retest-{ids}.md` (+ `.html`).
**Diff target:** report where each finding was last confirmed.
**When to use:** after deploys, to confirm fixes shipped or regressions persist.

---

## Profile vs scope

The profile is fixed — `smoke` always means "fastest signal," `canonical` always means "all sections × all locales × desktop." But the _content_ of those scopes (which sections, which locales) comes from `qa-config.yml`. So a single project's `/qa-canonical` covers a different surface area than another project's `/qa-canonical`, and that's the point.

If `qa-config.yml` doesn't exist, the profile commands will tell the user to run `/qa-init` first.
