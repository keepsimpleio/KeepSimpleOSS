## Font passport

<!-- font-passport: allowed=8,9,9.14,9.5,10,10.5,11,11.5,11.52,12,12.5,13,13.5,13.6,13.76,14,14.344,14.4,15,16,17,17.6,18,18.4,20,21,22,22.4,23,24,25,26,28,30,32,34,34.56,35,36,38,40,45,48,64,76; floor=8; contrast=4.5 -->

- Allowed sizes: **8, 9, 9.14, 9.5, 10, 10.5, 11, 11.5, 11.52, 12, 12.5, 13, 13.5, 13.6, 13.76, 14, 14.344, 14.4, 15, 16, 17, 17.6, 18, 18.4, 20, 21, 22, 22.4, 23, 24, 25, 26, 28, 30, 32, 34, 34.56, 35, 36, 38, 40, 45, 48, 64, 76px**. Hard floor: **8px**.
- Contrast: **4.5:1** minimum, or **3:1** for text at 18px and above.
- If text does not fit, fix the layout. This passport outranks template and skill defaults.

# CLAUDE.md, keepsimple (for Claude Code agents)

## Release lessons (Wolf, 2026-09-07)

**The order in force, in three lines.** Nothing reaches staging or production
without Wolf's direct word in the conversation (see "Staging and production
need Wolf's word" below, 2026-09-09, which is the later and stronger rule).
Every feature collects on the one batch branch, and before any repeat build
Wolf is told why another build is needed and given the chance to batch more
into it. The lessons below are the detail behind those two gates; they explain
how a release is run, they do not soften either gate.

### Before a build is triggered

Before any repeat build, tell Wolf why another build is needed and wait for his
decision on the batch of changes. He may have other tasks to include. Do not
trigger the build implicitly through a push or merge before that decision.
Approval for an earlier release is not approval to start an additional build
without this notice and batching opportunity. This explicit instruction was
given after the Library cover correction caused another full build unannounced.
The build already running at that instruction is to finish; do not restart it.

Wolf requires faster production releases. The Library release repeated an AI
review after staging approval, rebuilt both images, waited for downloads, then
needed another build because the cover fallback's intermediate redirect had
not been exercised through the actual handler before release.

### Running the release

- Keep one agreed release branch per repository. Do not split fixes into extra
  branches or independent releases without Wolf's request.
- Before production approval, prepare the release comparison, dependency order,
  checks and rollback reference. Preserve production-only changes when merging
  an older staging base. Surface actual blockers before the approval step.
- Reuse completed AI review and checks only when the release diff and relevant
  target context are unchanged. Do not manually request another full review for
  identical code. Required GitHub checks still apply; never bypass protection.
  A workflow change to avoid duplicate automatic review must retain this guard.
- Start independent frontend/backend builds together. Order deployment only
  where the frontend depends on new backend fields. Do not leave one approved
  build idle while waiting for an unrelated review or image download.
- Validate provider fallbacks with the complete application handler from the
  production network before merging. A successful direct download that follows
  redirects does not prove our allowlisted handler accepts intermediate hosts.
  For Open Library this includes archive.org/download/l*covers*\*/ redirects.
- Treat SQL null in legacy boolean fields as unset when that is the application
  contract. Distinguish persistence failures from overly strict probe assertions
  about framework input coercion; never claim the entire probe passed if it did not.
- Measure review, build, image transfer and rollout separately in the release
  journal. Announce milestone changes; keep waiting messages short.

### CI, images and rollout

- Deploy CI queues one run per branch and ships a .dockerignore. A Docker
  layer cache was tried and removed on 2026-09-08: restoring the 2.25 GB
  node_modules layer from the Actions cache took 184s against 74s for yarn
  install, and populating it cost 411s once. Do not reintroduce it without a
  smaller layer. The builder and runner stages carry .env files and must never
  be exported to any cache. Reference prod run: cleanup 35s, build 5m29s of
  which yarn install 74s, push 3m22s, registry poll about 6 min. Image export
  and push (about 4 min) are the node_modules copy in the runner stage; only
  standalone output or a slimmer runner removes it, separate work. The rollout
  after an image push is triggered by keepsimple-ctl redeploy, not by waiting
  for the poll (scripts/release/README.md).
- Do not promote the staging image to production by retagging today: the workflow
  injects different env files and Next.js embeds NEXT_PUBLIC values at build time.
  A single promotable image requires separating runtime configuration first.
- Documentation-only lessons do not justify another production rebuild. Save
  them locally and in MemPalace; include tracked rules with the next code release.

> **Global rules apply.** Communication style and Agent Directory routing live in `~/.claude/CLAUDE.md`; read that first. This project participates in the directory; use `/send-to` to ask peers.

MemPalace wing: `keepsimple` (protocol lives in `~/.claude/CLAUDE.md`).

Human-readable agent guidelines live in `AGENTS.md` next to this file; this file is the machine-facing version. See `AGENTS.md` for repo conventions, build/test commands, and contribution rules, imported below so it loads automatically.

@AGENTS.md

## Library

Everything about the Library lives in `LIBRARY.md` at the repo root: every
passport, contract, release gate and the MCP. Read it before touching anything
under `src/*/library`, `src/pages/library`, `mcp/library` or the Library CMS
types, and write new Library rules there, never here. It is not imported into
this file on purpose: it is read when the Library is the work.

## Code search: prefer CodeGraph over Grep

Repo is indexed by **CodeGraph** (MCP `codegraph`, registered globally). Use it FIRST when you have a symbol name: `codegraph_search`, `codegraph_callers`/`callees`, `codegraph_context`, `codegraph_impact`, `codegraph_files`. Grep/Glob only when query is conceptual or CodeGraph returned nothing. Index lags writes ~500ms.

## Voice for user-facing copy

When writing copy that ships to users (microcopy, page headings, marketing blurbs, articles, error messages):

- First-person, direct, no filler.
- Let sentences breathe. Commas, semicolons, colons and parentheses carry the
  rhythm; short fragments are a deliberate accent, never the default. Em-dashes
  are banned outright by the global rules in `~/.claude/CLAUDE.md` and that ban
  outranks this section, the reference piece included: where the article uses
  one, write the sentence without it.
- Cross-disciplinary framing welcome when it actually fits (behavioral science × product × longevity × AI).
- Sparse profanity is fine when it lands; default to clean.
- No AI-isms: no "let me know if…", no "happy to help", no preamble before the answer.
- Reference piece: **"The Rise of the Choice Architect"** (article on keepsimple.io). Match its register.

## ⚠️ UX Core data is canonical

The 100+ cognitive biases in UX Core are the product of 5+ years of curation and are referenced by Duke, Harvard, MIT, Google, Yandex, Amazon, and others.

- Never fabricate bias names, slugs, citation indices, or source URLs.
- If you need structured bias data, pull from `/uxcore-api` (see AGENTS.md → Public data API). Don't scrape, don't paraphrase from memory.
- Schema changes to UX Core data require explicit approval.

## MemPalace usage (wing: `keepsimple`)

When you find yourself stuck > 10 minutes on a problem and figure it out, write a brief drawer in your wing: chronology plus fix. Next-session-you won't waste the same 10 minutes. Same when a deployment or config decision is non-obvious: capture _why_ alongside _what_.

## A-Z OWNERSHIP (KEY-72580, forced by Wolf 2026-09-07, written by The Order on his order)

I own keepsimple.io A to Z and I run it solo. Nothing about keepsimple.io goes to The Order
any more: no confirmation, no permission grant, no schema review, no migration check, no
"is this safe". The Order is reached only for what the grant names as central below, and a
message there about anything else is a defect.

What I run myself through `/data/bin/keepsimple-ctl` (spec `wolfs-server/docs/keepsimple-ctl.md`):

- Releases: before I call one live I run `keepsimple-ctl verify <sha>` and quote the verdict.
- Frontend and Strapi CMS containers on prod and staging: status, inspect, logs, ci, check,
  restart, redeploy, staging shell.
- The Strapi database on both hosts: `cms sql` (reads free, writes with `--write` on staging
  or `--go` on prod), `cms perms` / `cms grant` / `cms revoke` for users-permissions roles,
  `cms schema` for tables, `cms backup` before any schema change lands on prod, `cms env`
  for variable names.
- Content-type schema changes and their backfills: I merge them, Strapi syncs the columns on
  rollout, I backfill with `cms sql` and verify with `cms schema`. A 403 from Strapi is a
  role permission and I fix it with `cms grant`.
- My git and repos: branches, PRs, merges to dev (staging) and main (prod).

Wolf's go, quoted in `--go "<his words, dated>"` and left in the journal, is required for
prod writes: restart prod, redeploy prod, merge to main, `cms sql prod` writes, `cms grant` /
`cms revoke` on prod. I obtain it from Wolf directly and execute myself.

Central, the only asks that may go `SEND TO @TheOrder`: other containers on the two hosts,
host level, DNS, the registry and its credentials, GitHub secrets, compose files, Strapi `.env`
values, and a new subcommand for the lever (it is a `/data/bin` file). Nothing else.

## Staging and production need Wolf's word (Wolf, 2026-09-09)

Wolf's order, twice the same evening, after an unasked CMS merge to dev rolled
the staging CMS: I have no right to push anything to staging or production
until he tells me directly to do it. Nothing goes to staging or production
without Wolf's direct instruction in the conversation: no merge to `dev` or `main` in this repo or in
keepsimple-cms-new, no staging redeploy or restart, no CMS schema rollout.
DEV (this working tree) is the only surface changed freely. Prepare the pull
request, leave it unmerged, and ask for the go in one line. The A-Z grant
covers execution, never the decision. Every feature collects on the one
batch branch and reaches production as one pull request; a go that says
"everything on staging" covers the whole batch, CMS included.

## This repository is public (Wolf, 2026-09-11)

Every committed line on every pushed branch is world-readable, and a pushed
commit stays fetchable by its SHA after a force-push. On 2026-09-10 an
unstripped export from another project's tooling (source file names, line
numbers, file hashes) was committed under `public/` and pushed. Wolf's
order: never again.

- Data that comes from another project or agent (exports, guides, catalogs,
  journals) is stripped to the fields the page renders BEFORE it enters the
  tree, and the strip is a script that runs on every refresh, not a manual pass.
- Nothing describing private infrastructure goes into the tree: internal
  paths, hostnames of private services, file fingerprints, tool inventories,
  session or run records.
- `scripts/guard/no-internal-data.mjs` runs from lint-staged on every commit
  and refuses added lines that carry such data. It has no bypass; rewrite the
  line. Its journal is `.internal-data-guard.log` (gitignored).
- Public data must not sit under `public/` when the page can bundle it: a
  standalone file is an endpoint anyone can pull.
