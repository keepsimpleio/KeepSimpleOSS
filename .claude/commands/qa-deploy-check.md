You are running a **post-deploy regression check** on keepsimple.io. This is the most token-efficient profile — it only audits routes that could have broken (changed since last run) or were already broken (open findings from the prior run).

Profile: **deploy-check** — surgical regression pass.

Scope:

- **Always include:** every route with an open finding in the most recent canonical / smoke / mobile-followup / full-matrix report.
- **Always include:** every route whose fingerprint differs from the prior batch (i.e. `changed` or `new` per `batch-fingerprint`).
- **Skip:** routes that are both `unchanged` AND have zero open prior findings.

Time budget: 5 min per route, 30 min hard cap total. Designed to run after every deploy.
Output: reports/YYYY-MM-DD-deploy-check.md (and rendered .html)
Diff target: most recent canonical (or full-matrix) run.

SETUP

1. Read .claude/keepsimple-qa/SKILL.md in full.
2. Read qa-config.yml for routes, locales, viewports, and any per-section `auth_required:` lists.
3. Read known-issues.md — do not refile anything listed there.
4. Read .claude/keepsimple-qa/PROFILES.md and confirm the deploy-check profile spec matches what's above.
5. Confirm Playwright MCP is connected before proceeding. If not, stop and report what's missing.

DECIDE THE SCOPE

1. Run `node .claude/keepsimple-qa/helper.mjs batch-fingerprint keepsimple --save`. This reads every route from qa-config.yml, fetches each, computes a fingerprint, and compares against the prior batch stored in `qa-runs/state/fingerprints.json`. Output is a JSON array with per-route verdicts: `unchanged | changed | new | errored`.
2. Read the most recent prior report under `reports/`. Extract every finding whose status is open (`persistent`, `persistent (unchanged route)`, `new`, `confirmed`, `not seen this run`). Note their routes.
3. Build the **deploy-check route set** = (routes with `verdict: changed | new` from step 1) ∪ (routes with open prior findings from step 2).
4. Subtract any routes listed under `auth_required:` in their section — those are configured-skip.
5. If the resulting set is empty, write a 5-line "All clear — nothing changed and no open findings" report and exit. This is the happy path post-deploy.

EXECUTION

For every route in the deploy-check route set, run the per-route checklist from the skill (snapshot, console+network, click primary elements, fill any forms without submit, scroll, resize) plus the must-work fixed-pass items for any section whose hub route is in the set. Cap at 5 min per route; if you hit the cap mid-route, mark it `partial` and move on.

For routes NOT in the deploy-check set (unchanged + no open findings), include them in the coverage table with status `unchanged-skip` and `Source: <prior report date>`.

OUTPUT

Produce the report at reports/YYYY-MM-DD-deploy-check.md following the skill's report structure:

- Metadata header (build IDs, change summary from batch-fingerprint)
- **Deploy verdict** at the top: `pass | regressions found | inconclusive` based on whether any new high/critical findings appeared or any prior open findings persisted on changed routes
- Coverage table (every route from qa-config.yml, with per-route status: deep-audited / unchanged-skip / configured-skip)
- Findings summary
- Diff vs prior canonical (status of each prior finding: refuted / persistent / changed)
- JSON finding blocks
- Out-of-scope observations

Then render HTML: `node .claude/keepsimple-qa/render-report.js reports/YYYY-MM-DD-deploy-check.md`.

Do NOT auto-update qa-runs/findings-register.md or any other tracking file. The user updates those manually after reviewing the report.

Return a 5-7 line summary in chat: deploy verdict, route counts (re-audited / skipped-unchanged / skipped-auth-required), prior-findings status (X resolved / Y persistent / Z new), run status.
