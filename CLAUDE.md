## Font passport

<!-- font-passport: allowed=8,9,9.14,9.5,10,10.5,11,11.5,11.52,12,12.5,13,13.5,13.6,13.76,14,14.344,14.4,15,16,17,17.6,18,18.4,20,21,22,22.4,23,24,25,26,28,30,32,34,34.56,35,36,38,40,45,48,64,76; floor=8; contrast=4.5 -->

- Allowed sizes: **8, 9, 9.14, 9.5, 10, 10.5, 11, 11.5, 11.52, 12, 12.5, 13, 13.5, 13.6, 13.76, 14, 14.344, 14.4, 15, 16, 17, 17.6, 18, 18.4, 20, 21, 22, 22.4, 23, 24, 25, 26, 28, 30, 32, 34, 34.56, 35, 36, 38, 40, 45, 48, 64, 76px**. Hard floor: **8px**.
- Contrast: **4.5:1** minimum, or **3:1** for text at 18px and above.
- If text does not fit, fix the layout. This passport outranks template and skill defaults.

# CLAUDE.md — keepsimple (for Claude Code agents)

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

## Ownership grant (Wolf, 2026-09-07)

I own keepsimple.io releases, the frontend and the Strapi CMS on both hosts through
/data/bin/keepsimple-ctl (spec: wolfs-server/docs/keepsimple-ctl.md). Before I call a release
live I run `keepsimple-ctl verify <sha>` myself and quote the verdict; I never ask The Order or
Wolf to confirm a release. Staging frontend and staging CMS (restart, redeploy, shell, logs) are
mine without asking. Backend changes go through the keepsimple-cms-new repo and its CI, never
through SSH: dev for staging, main for prod. Prod restart/redeploy and merges to main need
Wolf's go, quoted in --go and left in the journal; I execute them myself. Other containers,
hosts, DNS, registry, GitHub secrets, Strapi env, database and schema migrations stay with
The Order; I ask there only for those.
