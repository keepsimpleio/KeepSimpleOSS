You are running a QA pass on keepsimple.io.

Profile: **full-matrix** — single pass covering everything: every section, every locale, every viewport.

Scope: all sections × all locales × desktop+mobile.
Time budget: 3-4 hours. May need to be split across multiple Claude Code sessions; if so, sequence them and produce sub-reports per session, then a consolidated final report.
Output: reports/YYYY-MM-DD-full-matrix.md (or reports/YYYY-MM-DD-full-matrix-part-N.md for split runs) (and rendered .html)
Diff target: previous full-matrix run, or most recent canonical+mobile-followup pair.

SETUP

1. Read .claude/keepsimple-qa/SKILL.md in full. This is your playbook for method.
2. Read qa-config.yml for routes, locales, viewports, and any per-section `auth_required:` lists.
3. Read known-issues.md — do not refile anything listed there.
4. Read .claude/keepsimple-qa/PROFILES.md and confirm the full-matrix profile spec matches what's above. Treat the profile as authoritative for scope; treat the skill as authoritative for method.
5. Confirm Playwright MCP is connected before proceeding. If not, stop and report what's missing.

EXECUTION

Run the pass per the skill. Honor the profile's scope exactly. Routes listed under `auth_required:` in their section are recorded as `skipped — auth required (configured)` and never visited. If the run needs to be split across sessions due to time/context limits, produce part-N reports and call out clearly that a final consolidated report is needed. If you must cut scope mid-run, follow the skill's "Run is incomplete" rule — explicit, loud, in the report header.

OUTPUT

Produce the report at reports/YYYY-MM-DD-full-matrix.md (or part-N variant) following the skill's report structure:

- Metadata header
- Coverage report table
- Findings summary
- Diff vs prior full-matrix or canonical+mobile-followup pair
- Routes covered
- Routes skipped with reason
- Fixed-pass checklist
- JSON finding blocks
- Out-of-scope observations

Then render HTML: `node .claude/keepsimple-qa/render-report.js reports/YYYY-MM-DD-full-matrix.md` (or the part-N variant).

Do NOT auto-update qa-runs/findings-register.md or any other tracking file. The user updates those manually after reviewing the report.

Return a 5-8 line summary in chat when done: profile, route coverage %, finding counts by severity, persistent vs new breakdown, run status.
