You are running a QA pass on keepsimple.io.

Profile: **canonical** — the desktop half of a full pass. Source of truth for desktop findings.

Scope: all sections × all locales × desktop.
Time budget: 90-120 min, 30-min hard cap per section.
Output: reports/YYYY-MM-DD.md (and rendered .html)
Diff target: previous canonical run.

Note: canonical alone is incomplete. Pair with mobile-followup for a full-matrix pass.

SETUP

1. Read .claude/keepsimple-qa/SKILL.md in full. This is your playbook for method.
2. Read qa-config.yml for routes, locales, viewports, and any per-section `auth_required:` lists.
3. Read known-issues.md — do not refile anything listed there.
4. Read .claude/keepsimple-qa/PROFILES.md and confirm the canonical profile spec matches what's above. Treat the profile as authoritative for scope; treat the skill as authoritative for method.
5. Confirm Playwright MCP is connected before proceeding. If not, stop and report what's missing.

EXECUTION

Run the pass per the skill. Honor the profile's scope exactly. Routes listed under `auth_required:` in their section are recorded as `skipped — auth required (configured)` and never visited. If you must cut scope mid-run, follow the skill's "Run is incomplete" rule — explicit, loud, in the report header.

OUTPUT

Produce the report at reports/YYYY-MM-DD.md following the skill's report structure:

- Metadata header
- Coverage report table
- Findings summary
- Diff vs prior canonical
- Routes covered
- Routes skipped with reason
- Fixed-pass checklist
- JSON finding blocks
- Out-of-scope observations

Then render HTML: `node .claude/keepsimple-qa/render-report.js reports/YYYY-MM-DD.md`.

Do NOT auto-update qa-runs/findings-register.md or any other tracking file. The user updates those manually after reviewing the report.

Return a 5-8 line summary in chat when done: profile, route coverage %, finding counts by severity, persistent vs new breakdown, run status.
