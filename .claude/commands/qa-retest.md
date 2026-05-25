You are running a targeted retest on keepsimple.io.

Profile: **retest** — verify specific findings by ID after a deploy or local fix.

Scope: only the routes referenced by the named finding IDs (provided by the user in the next message).
Time budget: 5 min per finding ID, 30 min cap.
Output: reports/YYYY-MM-DD-retest-{ids}.md (and rendered .html)
Diff target: report where each finding was last confirmed.

Before proceeding, ask the user which finding IDs to retest (e.g. "F#7, F#11"). Do not begin browser work until the IDs are confirmed.

SETUP

1. Read .claude/keepsimple-qa/SKILL.md in full. This is your playbook for method.
2. Read qa-config.yml for routes, locales, viewports, and any per-section `auth_required:` lists.
3. Read known-issues.md — do not refile anything listed there.
4. Read .claude/keepsimple-qa/PROFILES.md and qa-runs/findings-register.md — the register tells you where each finding was last confirmed.
5. Confirm Playwright MCP is connected before proceeding. If not, stop and report what's missing.

RETEST METHOD

For each finding ID provided:

1. Read the prior report where the finding was last confirmed to understand original reproduction steps, affected routes, and evidence.
2. Reproduce the verification steps on the current production build.
3. Classify the result as one of:
   - confirmed (still reproduces, same root cause)
   - refuted (no longer reproduces, fix appears to have shipped)
   - persistent (reproduces with same signature but you suspect environmental rather than code factors)
   - changed (reproduces but with a different signature — note the drift)

Visit ONLY the routes referenced by the finding IDs. Do not perform broader exploratory testing. This is a focused verification pass, not a coverage pass. If a finding's route is in an `auth_required:` list, mark its retest as `skipped — auth required (configured)` and move on.

OUTPUT

Produce the report at reports/YYYY-MM-DD-retest-{ids}.md (replace {ids} with IDs separated by hyphens, e.g. "F5-F7-F11"). The retest report follows a simplified structure:

- Metadata header (date, build ID, scope as "retest of {ids}")
- Per-finding verification table: ID, last-confirmed report, current status, brief evidence
- Routes touched
- JSON finding blocks ONLY for findings whose status changed (refuted, persistent-with-new-info, changed)
- Build ID note (current vs the build the finding was last confirmed against)

Then render HTML: `node .claude/keepsimple-qa/render-report.js reports/YYYY-MM-DD-retest-{ids}.md`.

Do NOT auto-update qa-runs/findings-register.md or any other tracking file. The user updates those manually after reviewing the report.

Return a 3-5 line summary in chat when done: finding IDs retested, status counts (X confirmed / Y refuted / Z changed), build ID delta if any, anything unexpected.
