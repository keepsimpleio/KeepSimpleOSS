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

## Library release branch

Wolf's instruction, 2026-09-07: collect the next fixes in
`openai-astra-still-sucks-fixesv2`. Keep them on this branch while he reviews
other issues. Do not start another release from the previous approval.

## Library preference release prerequisite

The AI Shelf preference needs both the CMS boolean field and the authenticated
`api::library.library.update` route permission. A frontend build can pass while
this permission is missing: that caused the production save failure on 2026-09-07.
The CMS controller already enforces library ownership and rejects owner changes.

Before declaring a Library release ready, run
`node scripts/release/library-preference-permission.cjs prod --check`.
A failing result blocks release completion. During the authorized release, apply
`node scripts/release/library-preference-permission.cjs prod --apply --go "<owner approval>"`.
This idempotently grants the authenticated route through keepsimple-ctl and checks
it again. It does not change books or shelf contents, and never grants public writes.
Staging accepts `staging --apply`. Every run appends to the private release journal.

Permission checks alone do not prove account persistence. Save both collapse states
through the authenticated owner API, independently reload each state, and restore
the original preference. Confirm anonymous writes remain rejected and public reads
omit the private preference. Never replace this with a localStorage-only fallback.

## Public library URLs

Public links use `/library/<lowercase-username>` through `libraryPath`.
Database library ids belong in CMS requests, never in generated navigation or
copied links. Legacy numeric URLs redirect to the owner username while retaining
object paths and query strings. Do not restore numeric links to work around a
failed username lookup; fix the public lookup instead.

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

## Library info panel passages

About and Author are rich text in the editor dialect from `src/lib/library/richText.ts`:
line breaks, bold, italic, strikethrough and links. The edit modal uses RichTextField,
the panel and its dialog render the stored markup, and nothing on this path flattens
it to plain text. Strong renders at 600 on display and 700 in the editor, as the
description emphasis rule already sets. Both passages are capped at 1000
characters, counted on the writing rather than the markup; the figures live in
`createEditLibrarySchema` so the counter and the validator cannot drift apart.
The cap applies to what the owner writes from here on: a passage saved under the
old 4000/2000 limits stays valid while untouched, so it cannot block an unrelated
edit, and editing it brings it under the cap.

The panel keeps the first eight lines, clamped by line count so the cut lands on a
line boundary, and a single unbroken string wraps rather than leaving the column.
Show all opens the whole passage in the shared Modal with its existing fade; the
control appears only when the text is actually clipped, measured from the rendered
paragraph and re-measured on resize. Dialog: 518px cap, height capped to the
viewport, body scrolls behind a 12px themed scrollbar with the taupe thumb on
white-100 and a 6px thumb radius. Links keep the surrounding face with a dotted
underline that solidifies on hover and keyboard focus.

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

## Library rune loader design passport

- Palette: existing white-transparent-400 overlay, brown-100 ink and existing rune paper tokens. No new fonts.
- Geometry: seven existing rune seals spell LIBRARY on a centered horizontal rule. Scene width min(480px, calc(100% - 48px)), seven equal columns with 12px gaps. Seals fit their columns, up to 48px square. Center seal uses the existing owner treatment.
- Motion passport: 4.8s eased opacity and 8px vertical settling cycle, staggered by 160ms from the center outward. Wrapper fades in over 240ms ease-out. Reduced motion keeps a static composition. Loaded content unmounts the overlay immediately, without timers.
- Stability passport: absolute overlay preserves parent geometry; decoration is aria-hidden with a separate Loading status. No layout animation.
- Scrollbar passport: no scrollable region; overlay clips overflow.
- Scope: existing Library loader consumers only. Other product loaders are unchanged.

## Library tooltip design passport

All Library control hints use the shared Tooltip component. Native HTML title
hints are forbidden. Use asChild to keep existing button and tag geometry.
Paper background --white, text --gray-darker, border --beige, brown accent from
existing controls; Source Serif 4 at 16px, 12px by 16px padding, 300px maximum
width, existing --radius-control and --tooltip-shadow. Tooltips portal to body
with fixed positioning at layer 10000, above Library dialogs and hover cards.
Opacity enters and exits over 150ms ease; reduced motion disables transitions.
Hints wrap within the viewport and have no scrollable surface. Portals reserve
no layout space and do not change anchor size. Empty hints render no popup.

## Library copy feedback

Library URL and object Copy URL controls share CopyButtonLabel. Crossfade the
normal label and Copied over 200ms ease; reduced motion switches immediately.
Both labels occupy the same grid cell so their largest width remains reserved.
Keep the secondary button palette, existing typography and geometry throughout.
No scale, pulse or success fill. This label has no scrolling surface.

## Library release evidence gates

Read scripts/release/README.md before Library releases. The incident inventory is
scripts/release/INCIDENTS-2026-09-07.md. Frontend CI never certifies CMS deployment.
Run yarn check:library and the read-only target contract check before readiness.
Check actual owner role, feature flag and library ownership, not a substitute account.
Capture and compare protected content around deployment. Missing schema, missing
saved values or missing owner evidence must remain explicit failures or NOT TESTED.
Record frontend and CMS revisions separately. No completed release claim without
live deployment provenance and data comparison. Never silently treat deferred review
findings as fixed. Stage and prod can diverge; inspect both before claiming parity.

## Library share image passport

- Server-rendered PNG artifact: 1200 by 630, existing library illustration in a 480px right panel. Ivory #f5f1ea, text #1c1c1a, secondary #5c5650, rule #ddd7ce. No accent added.
- Source Serif 4 with Noto Sans Armenian fallback; sizes 24, 32, 48, 76. Left panel 720px, 48px padding, 24px spacing, square corners. Names wrap within reserved space.
- Motion and scrollbar passports: static artifact, no animation or scroll surfaces. Fixed geometry across names. ImageResponse requires style objects for PNG rendering; these are artifact layout instructions, not page styling.
- Personal metadata uses the public username, matching library cards. Wolf retains the approved named artwork and collection date. Anonymous CMS reads supply public shelf titles only.

## Library guest preview motion passport

Guest mode crossfades the previous and next page snapshots over 200ms ease,
without remounting the library. Browsers without view transitions fade the
updated library and sidebar in over 200ms ease. Reduced motion switches
immediately. Only an explicit mode change changes shelf visibility and geometry.

## Library description link passport

Description links inherit the surrounding font and color, with a dotted underline.
Hover and keyboard focus use a solid underline. No geometry or motion changes.
URLs keep their visible text and open in a new tab with noopener and noreferrer.

## Library mobile reading contract

Phones and tablets are read-only, including owner accounts and landscape mode.
Editing starts disabled until a viewport above 1024px with a fine hover pointer
and no coarse pointer is confirmed. Touch-capable devices remain read-only.
Owners can view private recommendations and persist their fold preference;
recommendation verdicts and regeneration remain desktop controls.
Mobile recommendation headings wrap within the existing 16px header inset;
the fold control has a 44px touch target. Existing colors, fonts and fold motion apply.

## Library tag filter

A tag is a label on books and a filter over the library. Clicking one in the
right panel gathers every book it labels into a single row, in the tag's own
order, and every shelf steps aside while it stands: the AI shelf and Favorites
with them. One tag at a time; clicking the active tag clears the filter.

- Tags are controls in the right panel only. On cards, in the hover dossier and
  in the object overview they stay labels.
- A tag says on hover what its owner wrote about it, which is what the tag form
  promises when it asks. The pill's own name leads that hint when the pill is
  too narrow to show the whole word, and the state note follows it. The
  description is capped at 180 characters at both ends, counted under the field
  as it is typed: the form used to allow 500 where the CMS refused past 150.
  The CMS side is keepsimple-cms-new commit ad1cb40, on the staging CMS since
  2026-09-09. Proved there against the live API as the library's owner: 180
  characters saved and read back at 180, 181 refused with "description must be
  at most 180 characters", and the probed tag restored.
- A tag that labels nothing the viewer can open does not answer a click: it
  carries the pointer of a label, not of a control, and says `Tag not used` on
  hover and on keyboard focus, keeping its tab stop as a control that is off.
  A visitor is not shown it at all. No tag is ever a text selection.
- The filtered view is addressable: the tag's slug rides on the library URL as
  `#deep-work`. The CMS derives that slug from the name, transliterated to
  Latin and unique inside the library; the client never sends one. A rename
  carries the address with it quietly, and a link to a tag that is gone opens
  the library unfiltered.
- Search runs inside the active tag. Clearing the search keeps the filter.
- Dragging a book in the gathered row saves the tag's own sequence through
  `POST /tags/reorder`, never a shelf's. Owner and desktop only, the same rule
  the shelves follow. A newly tagged book lands at the end.
- A tag belongs to one library. The palette in the object form is that
  library's, and the CMS refuses a tag from another one.
- A library keeps at most 13 tags. At the cap the Create control is disabled
  and says `You have reached your limit maximum 13 tags`.
- Deleting a tag asks first and says that it leaves every book that carries it.
  The books stay.

### Design passport

- Palette: the tag's own colour on its chip. Active and hover draw the existing
  `--white` and `--brown` ring, as a selected cover does. A book on a private
  shelf is veiled with `--white-transparent-400` easing into
  `--white-transparent-600` (the same paper at 78%, added with this surface)
  and marked with `--brown-100` on `--white-200` inside a `--beige` border.
- Typography: existing Library faces. The Hidden mark is Source Sans Pro at
  11px, uppercase, 0.12em tracking.
- Spacing and radius: existing shelf geometry and control radii. The gathered
  row is drawn by the Shelf component, so it keeps every measurement a shelf
  has.
- Motion passport: entering and leaving the filtered view is one 200ms ease
  crossfade, the content swapped at the trough so nothing is seen half
  replaced. Reduced motion switches immediately.
- Scrollbar passport: the gathered row uses the shelf's own themed scroller.
- Stability passport: the active ring is drawn outside the chip's box, so
  choosing a tag moves nothing in the row it stands in. The gathered row holds
  the same card geometry as a shelf, veil included.

## Library tag assignment

A tag is put on a book from the book itself. The object overview carries a tag
picker in the row with Copy URL, the star and the owner menu: one icon button
opening the library's palette as a multi-select. Each click is saved on its own
through `PUT /api/objects/:id`, the Tags row under the notes answers it, and the
panel's tag list is re-read so counts, the gathered row and the unused-tag hint
follow immediately. A failed save returns the row to the last set the server
accepted and says so; a set is never assumed saved from a click.

The picker is the owner's, on a book, on desktop, the same rule the shelves
follow. Videos and audio carry no tags on any surface. The edit form keeps its
own picker on step 2; both read `MAX_TAGS_PER_OBJECT`, and both state the whole
set on save, the empty set included, so taking the last tag off a book actually
takes it off.

### Design passport

- Palette: existing paper tokens. The button is `--white` on `--brown-border`,
  its glyph `--gray-darkest`, turning to `--brown` once the book carries a tag
  and on hover. Chips keep the tag's own colour.
- Typography: existing Library faces; the menu and the row add no size.
- Spacing and radius: 36px square button in the existing 8px action row,
  `--radius-control`. The menu is 260px wide, hung from the button's right
  edge, 4px below it, with the existing 8px by 12px option rows.
- Motion passport: the menu's existing 140ms fade in, 120ms out. Tags arrive
  and leave the row through `useAnimatedList`. Reduced motion cuts both.
- Scrollbar passport: the menu caps at 240px and scrolls behind a 12px themed
  scrollbar, taupe thumb on white-100, 6px thumb radius.
- Stability passport: the button's box never changes with the tag count, which
  is spoken rather than drawn. The owner's Tags row stands from the start, as
  tall as a pill when empty, so the first tag lands in space already held.
