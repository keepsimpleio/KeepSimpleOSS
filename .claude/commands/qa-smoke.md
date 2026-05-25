You are running a QA pass on keepsimple.io.

Profile: **smoke** — fastest possible signal, does the site render at all?

Scope: one section × default locale × desktop. Default section is the one marked `default: true` in `qa-config.yml` (or the first section if none is marked). Routes from `qa-config.yml`.
Time budget: 15 min hard cap.
Output: reports/YYYY-MM-DD-smoke.md (and rendered .html)
Diff target: most recent canonical run, if any.

SETUP

1. Read .claude/keepsimple-qa/SKILL.md in full. This is your playbook for method.
2. Read qa-config.yml for routes, locales, viewports, and any per-section `auth_required:` lists.
3. Read known-issues.md — do not refile anything listed there.
4. Read .claude/keepsimple-qa/PROFILES.md and confirm the smoke profile spec matches what's above. Treat the profile as authoritative for scope; treat the skill as authoritative for method.
5. Confirm Playwright MCP is connected before proceeding. If not, stop and report what's missing.

EXECUTION

Run the pass per the skill. Honor the profile's scope exactly. Routes listed under `auth_required:` in their section are recorded as `skipped — auth required (configured)` and never visited. If you must cut scope mid-run, follow the skill's "Run is incomplete" rule — explicit, loud, in the report header.

OUTPUT

Produce the report at reports/YYYY-MM-DD-smoke.md following the skill's report structure:

- Metadata header
- Coverage report table (auth_required routes appear as `skipped — auth required (configured)`)
- Findings summary
- Diff vs prior canonical
- Routes covered
- Routes skipped with reason
- Fixed-pass checklist
- JSON finding blocks
- Out-of-scope observations

Then render HTML: `node .claude/keepsimple-qa/render-report.js reports/YYYY-MM-DD-smoke.md`.

Do NOT auto-update qa-runs/findings-register.md or any other tracking file. The user updates those manually after reviewing the report.

Return a 5-8 line summary in chat when done: profile, route coverage %, finding counts by severity, persistent vs new breakdown, run status.
