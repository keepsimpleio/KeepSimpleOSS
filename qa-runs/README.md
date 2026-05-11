# QA Agent

Manual QA pass for keepsimple.io, driven by Claude via the Playwright
MCP server. Visits production routes, watches console + network,
interacts with key features, produces a findings report.

This is the **agent QA** system. The Playwright spec suite (in
`tests/`, see `QA_PLAN.md`) is a separate effort.

## How to run

In a fresh Claude Code session at the repo root, type a slash command:

| Command               | What it runs                                                                            | Time          |
| --------------------- | --------------------------------------------------------------------------------------- | ------------- |
| `/qa-init`            | Interactive wizard to (re-)write `qa-config.yml`.                                       | ~5 min        |
| `/qa-smoke`           | Default section × en × desktop. Fast post-deploy check.                                 | ~15 min       |
| `/qa-locale-smoke`    | Default section × all locales × desktop. Locale-routing check.                          | ~25 min       |
| `/qa-canonical`       | All sections × all locales × desktop. Source of truth for desktop findings.             | ~90-120 min   |
| `/qa-mobile-followup` | All sections × all locales × mobile. Pairs with canonical for full matrix.              | ~90 min       |
| `/qa-full-matrix`     | Everything in one pass: all sections × all locales × desktop + mobile.                  | 3-4 hours     |
| `/qa-deploy-check`    | Surgical post-deploy regression. Only audits routes that changed OR have open findings. | ~30 min       |
| `/qa-retest`          | Verify specific finding IDs after a deploy or local fix.                                | ~5 min per ID |

Always start in a **fresh** Claude Code session. Same chat ≠ same
session. Open chat memory pollutes results.

After the run finishes, the agent writes the report to `reports/` and
returns a short summary in chat. The agent renders the HTML itself
(`node .claude/keepsimple-qa/render-report.js …`) at the end of every pass — or
you can re-render manually with `yarn render-report reports/<filename>.md`.

## What the system is made of

| File                                     | Role                                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `.claude/keepsimple-qa/SKILL.md`         | The method playbook. Pre-flight, fixed pass, exploratory pass, severity rubric, finding schema. Loaded by every slash command.       |
| `.claude/keepsimple-qa/PROFILES.md`      | Profile catalogue — what each profile's scope actually covers.                                                                       |
| `.claude/keepsimple-qa/helper.mjs`       | Helper CLI: fingerprints, axe, vitals, screenshots, pixelmatch visual-diff.                                                          |
| `.claude/keepsimple-qa/render-report.js` | Markdown → HTML renderer.                                                                                                            |
| `.claude/commands/qa-*.md`               | Slash commands, one per profile. Each loads the skill and pins scope.                                                                |
| `qa-config.yml`                          | Sections, routes, locales, viewports, design-system reference, per-section `auth_required:` and `primary_interaction:` declarations. |
| `known-issues.md`                        | Suppressions. Anything listed here is intentional and not a finding.                                                                 |
| `qa-runs/findings-register.md`           | Living index of open findings. Updated manually after each run.                                                                      |
| `qa-runs/state/`                         | Helper-managed: route fingerprints from `batch-fingerprint`. Gitignored.                                                             |
| `qa-runs/baselines/` and `screenshots/`  | Helper-managed: visual-regression baseline + current PNGs. Gitignored.                                                               |
| `reports/`                               | Per-run reports (`.md` source + `.html` rendered). Source of truth for finding details.                                              |

The skill defines **how**. The profile (and slash command) defines
**what scope**. The register tracks **what's currently broken**.

## After a run

The agent does NOT auto-update the findings register. You do.

For each new finding the report surfaces:

1. Decide if it's real (cross-check against `known-issues.md` if
   you're unsure).
2. Add a row to `qa-runs/findings-register.md` under "Open
   findings" with a new `F#` ID.
3. Reference the report it came from in `last-confirmed`.

For findings the report shows as persistent: update `last-confirmed`
to today's date. Status stays the same.

For findings the report shows as refuted (after a fix and retest):
flip status `fixed-deployed` → `verified-fixed`. After one more
clean run with no regression, move the row to the Archive section.

## Fix flow

When a finding gets fixed:
open → fixed-locally → fixed-deployed → verified-fixed → archive
↑ |
| ↓
(you write the fix) (one more clean run later)

Update register status manually as it moves through the stages.
Run `/qa-retest` after a deploy to verify `fixed-deployed` →
`verified-fixed`. Or run `/qa-deploy-check` for a broader surgical
sweep that re-audits anything that changed plus all open findings.

## Constraints worth knowing

- The agent never logs in or submits forms that create real data.
- Routes listed under a section's `auth_required:` field in
  `qa-config.yml` are intentionally skipped. The agent records them
  as `skipped — auth required (configured)` in the coverage table.
- The agent will not refile anything in `known-issues.md`. If
  something there should actually be fixed, remove it from
  known-issues first.
- Reports stick around indefinitely. They're the diff chain — each
  run references prior runs by name. Don't delete old ones.

## When something's off

- Slash command shows "no matching commands" → restart Claude Code
  panel. New files don't always get picked up live.
- Agent runs but produces no report → check Playwright MCP is
  connected. Should show in available tools.
- Agent reports findings already in `known-issues.md` → known-issues
  isn't being read. Check the file path is correct from repo root.
- Report references a build ID that doesn't match current production
  → you're looking at a pre-deploy report. Check `reports/` for the
  most recent one.
- Helper command fails with `Cannot find module 'pngjs'` (or similar)
  → run `yarn install`; the kit's devDeps may not be installed yet.
