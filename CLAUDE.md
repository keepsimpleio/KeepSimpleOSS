## Font passport

<!-- font-passport: allowed=8,9,9.14,9.5,10,10.5,11,11.5,11.52,12,12.5,13,13.5,13.6,13.76,14,14.344,14.4,15,16,17,17.6,18,18.4,20,21,22,22.4,23,24,25,26,28,30,32,34,34.56,35,36,38,40,45,48,64,76; floor=8; contrast=4.5 -->

- Allowed sizes: **8, 9, 9.14, 9.5, 10, 10.5, 11, 11.5, 11.52, 12, 12.5, 13, 13.5, 13.6, 13.76, 14, 14.344, 14.4, 15, 16, 17, 17.6, 18, 18.4, 20, 21, 22, 22.4, 23, 24, 25, 26, 28, 30, 32, 34, 34.56, 35, 36, 38, 40, 45, 48, 64, 76px**. Hard floor: **8px**.
- Contrast: **4.5:1** minimum, or **3:1** for text at 18px and above.
- If text does not fit, fix the layout. This passport outranks template and skill defaults.

# CLAUDE.md — keepsimple (for Claude Code agents)

## Release lessons (Wolf, 2026-09-07)

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
- Engineering follow-up: cache Docker dependency/build layers and reduce runtime
  image size. Current CI uses fresh runners and docker build without a registry
  cache. Check these costs before redesigning deployment.
- Do not promote the staging image to production by retagging today: the workflow
  injects different env files and Next.js embeds NEXT_PUBLIC values at build time.
  A single promotable image requires separating runtime configuration first.
- Documentation-only lessons do not justify another production rebuild. Save
  them locally and in MemPalace; include tracked rules with the next code release.

## Library release branch

Wolf's instruction, 2026-09-07: all current Library work ships together through
`library-ai-shelf-v2`. Use this branch name in both frontend and CMS repositories.
Favorites persistence belongs to this release. Do not create separate feature or
hotfix branches or PRs for parts of this work. CMS PR #399 was closed.

## Library calendar layout

The calendar reserves separate rows for the month/year selectors and navigation.
Keep the existing calendar width and 44px navigation row; dropdown spacing is 8px.
Year and month menus center the selected option on opening by scrolling only the
menu. An empty date opens the current month. Caption menus retain the 240px cap,
12px themed scrollbar, taupe thumb, white-100 track and 6px thumb radius. Existing
popover and dropdown fades and reduced-motion behavior remain in effect.

## Library cover availability

Production Google Books cover downloads returned HTTP 403 for automated traffic
on 2026-09-07 while title search still worked. Keep an Open Library ISBN cover as
the same-edition fallback in both autocomplete thumbnails and selected-cover
downloads. The proxy accepts Open Library and its Internet Archive cover CDN,
validates each redirect before following it, and bounds download time and size.
Open Library requests use default=false so missing covers return an error.
Cover request outcomes are logged as library.autofill.cover JSON records.
Wolf directed KeepSimple to handle its own production diagnosis on 2026-09-07;
inspect its frontend and proxy directly instead of handing diagnosis to The Order.

## Library description emphasis

Descriptions use the existing static Source Serif 4 Semibold face at weight 600
for strong/b markup in the dossier and overview. The editor uses standard Bold
at weight 700 so formatting is visible and native editing commands recognize it.
Do not use a separate variable-font alias or override the wght axis for notes.
Toolbar and keyboard shortcuts share one handler and emit semantic tags.

## Library AI Shelf design passport

- Palette: Library paper and wood neutrals from `src/styles/library/variables.scss`. One accent: `--purple-100` for controls and `--purple-400` for light effects. Book artwork retains its own colors. Placeholder covers use the existing paper gradient.
- Typography: Source Serif 4 and Source Sans Pro. Existing font passport applies; this surface uses 11, 12, 14 and 16px.
- Spacing: 4px grid for additions. Existing shelf geometry is retained: 342px content minimum, 65px bottom padding, 80px carousel inset, 38px book gap. The board uses the same image and positioning as Shelf.
- Radius: `--radius-control` and `--radius-icon-chip` (0); scrollbar radius 6px.
- Motion passport: fold to the content's ResizeObserver-measured height over 320ms with cubic-bezier(0.2, 0, 0, 1); opacity over 200ms ease. The board and books float together between -4px and -10px over 8s ease-in-out; hover or keyboard focus pauses both. A detached shadow breathes beneath the board, with paper-colored mist drifting 8px over 16s, blurred 8px. Mist occupies the existing bottom 80px; the shadow is 16px tall with 4px blur. Cover light remains a 12s ease-in-out effect. Card lift remains 250ms. Reduced motion disables transitions and decorative animation. Hidden content is inert and its animation is paused.
- Scrollbar passport: 12px themed track, `--taupe` thumb on `--white-100`; its space is taken from bottom padding so books stay seated.
- Stability passport: the header remains visible when folded; its action space is retained, notices are overlaid, and book dimensions stay fixed. Only an explicit fold changes the shelf height. Saved state is supplied with library data before the shelf mounts.

## AI Shelf account preference contract

`library.aiShelfCollapsed`: boolean, default false, nullable legacy values read as false.
The existing `PUT /api/libraries/:id` accepts `{ data: { aiShelfCollapsed: boolean } }`
only from the library owner. The mutation response and the owner's populated
`GET /api/libraries/:id` include the stored boolean. Public and other-user reads
omit it. Reject non-boolean input and writes to another owner's library.
Record each write with UTC timestamp, owner/library IDs, outcome and boolean;
never include authentication credentials in the journal.

The preference lasts until the owner changes it, including after logout and on
another device. The last successful write wins. Search and guest preview do not
change it. Lock/Ban/Re-Generate remain session-only mock controls.
The frontend checks the mutation response. A failed save keeps the user's chosen
view and reports the sync failure. Background data refreshes must not overwrite
an unsaved choice. Account persistence is confirmed only by a successful response.
Backend verification: owner writes true, a separate authenticated read returns
true; repeat for false; another owner cannot write it and public reads omit it.
Implemented in keepsimple-cms-new commit 32a50ce and deployed to the DEV/staging
CMS on 2026-09-07. Live owner writes and independent reads passed for both boolean
values; public reads omit the field, anonymous writes and invalid values are
rejected. The probe restored the original preference. Production rollout remains
separate from this DEV release.

> **Global rules apply.** Communication style + Agent Directory routing live in `~/.claude/CLAUDE.md` — read that first. This project participates in the directory; use `/send-to` to ask peers.

MemPalace wing: `keepsimple` (protocol lives in `~/.claude/CLAUDE.md`).

Human-readable agent guidelines live in `AGENTS.md` next to this file; this file is the machine-facing version. See `AGENTS.md` for repo conventions, build/test commands, and contribution rules — imported below so it loads automatically.

@AGENTS.md

## Code search — prefer CodeGraph over Grep

Repo is indexed by **CodeGraph** (MCP `codegraph`, registered globally). Use it FIRST when you have a symbol name: `codegraph_search`, `codegraph_callers`/`callees`, `codegraph_context`, `codegraph_impact`, `codegraph_files`. Grep/Glob only when query is conceptual or CodeGraph returned nothing. Index lags writes ~500ms.

## Voice for user-facing copy

When writing copy that ships to users (microcopy, page headings, marketing blurbs, articles, error messages):

- First-person, direct, no filler.
- Em-dashes and semicolons over staccato fragments — let sentences breathe; reserve short fragments for deliberate punctuation, never as default rhythm.
- Cross-disciplinary framing welcome when it actually fits (behavioral science × product × longevity × AI).
- Sparse profanity is fine when it lands; default to clean.
- No AI-isms — no "let me know if…", no "happy to help", no preamble before the answer.
- Reference piece: **"The Rise of the Choice Architect"** (article on keepsimple.io). Match its register.

## ⚠️ UX Core data is canonical

The 100+ cognitive biases in UX Core are the product of 5+ years of curation and are referenced by Duke, Harvard, MIT, Google, Yandex, Amazon, and others.

- Never fabricate bias names, slugs, citation indices, or source URLs.
- If you need structured bias data, pull from `/uxcore-api` (see AGENTS.md → Public data API). Don't scrape, don't paraphrase from memory.
- Schema changes to UX Core data require explicit approval.

## MemPalace usage (wing: `keepsimple`)

When you find yourself stuck > 10 minutes on a problem and figure it out, write a brief drawer in your wing — chronology + fix. Next-session-you won't waste the same 10 minutes. Same when a deployment/config decision is non-obvious — capture _why_ alongside _what_.

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

## Library switcher design passport

- Palette: existing paper and wood tokens; brown is the accent.
- Typography: Source Serif 4 at 16px for names, Source Sans Pro at 12px for uppercase ownership labels.
- Spacing: 4px grid; rows 56px minimum, padding 12px 16px, gap 12px. Rune seals are 40px square; SVG viewBox is 48 units, with a 1-unit frame and 2-unit glyph strokes.
- Rune seals: original angular Latin initial alphabet, cut-corner frame and diamond terminals. Use the owner username initial, never the library title. Other scripts retain their initial in the existing serif face at 24px. Paper seals use brown-100 strokes over white-200 and panel-tab ruling; the owner seal reverses to white-warm on brown-100.
- Radius: existing zero-radius control token.
- Motion passport: existing menu fade; background and border transitions 200ms ease, disabled under reduced motion.
- Scrollbar passport: menu cap 360px or 60dvh, stable gutter, 12px track in white-100, taupe thumb with 6px radius.
- Stability passport: fixed rune seals, clipped names, reserved ownership-label line; selection changes color and inset marker without changing geometry.
- Own library sorts first, matched by authenticated account ID to owner ID independently of the open route.

## Library root loader design passport

- Palette: existing white-transparent-400 overlay. Roots retain photographic walnut and umber bark tones, like book-cover artwork, at 0.9 opacity; no new UI accent or font.
- Geometry: full parent-size scene, 1536 by 1024 SVG viewBox with centered crop. Photorealistic transparent WebP root specimen. Invisible reveal masks follow the actual crown and root axes with 100 to 240-unit brush widths and 8-unit softened edges. The mask reveals bark and fibers; no line-art roots remain.
- Motion passport: one synchronized 10s growth cycle, crown revealed first, followed by primary roots and fibers through 76 percent, held through 86 percent, fading by 100 percent. Growth uses cubic-bezier(0.22, 0.61, 0.36, 1); scene appears over 240ms ease-out. Reduced motion shows the full static root network. No timers delay loaded content; existing parent unmount ends the scene immediately.
- Stability passport: absolute overlay retains the existing parent geometry; SVG is decorative, status text is screen-reader-only. No layout animation or new scrollable region.
- Asset fallback: if the artwork fails to load, show Loading in existing Source Serif 4 at 14px, centered in the reserved scene. Reveal waits for the image load event.
- Scrollbar passport: none added; scene overflow is clipped.
- Scope: Library loading and shelf creation only. Global route and other product loaders retain their current behavior.
