# LIBRARY.md — the Library, for Claude Code agents

The Library section of keepsimple.io: `/library/<username>` and everything
under it. This file is the machine-facing charter for that surface and is
read when the Library is the work; `CLAUDE.md` at the root points here and
carries nothing of it. Global rules in `~/.claude/CLAUDE.md` and the repo
conventions in `AGENTS.md` apply on top. New Library rules, passports,
contracts and release gates are written here.

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

## Library access: who creates, who gets the AI, what an operator hides

Wolf opened library creation on 2026-09-12. Any account signed in through the
site's own auth may create one library, from its own address
(`/library/<username>`): the first shelf creates it, as before. The CMS asks
for no feature flag on library, shelf, object or tag writes any more; the
`can-create-library` flag still exists as a row and gates nothing. The Library
home offers [Create Library] to a visitor (it opens the header's sign-in
dialog through AUTH_OPEN_LOGIN_EVENT) and to a signed-in member without a
library (it sends them to their address); a member with a library gets
[Open my library]. The "What is this place?" modal ends on the same button.
The account dropdown's "My Library" and "Create library" both lead to the
owner's address. Phones and tablets stay read-only, so a signed-in owner
without a library reads "Use a desktop to create your library" there. A
visitor at an address no library answers to reads "No such library".

The AI shelf and the magic books are behind the `library-ai` account flag,
read from `GET /api/users/me` as `featureNames` (LIBRARY_AI_FLAG). The page
draws neither surface without it, and `/api/library/ai-shelf` and
`/api/library/magic-book` answer 403 without it through `ownerOfLibrary`, so
the hidden shelf is not the gate. Both surfaces are the owner's alone on
every account: a visitor never sees them. An operator hands the flag out in
the CMS admin panel (the user's Feature Flags relation) or ahead of signup
through the Mail Permission List; it takes effect on the account's next page
load, no new sign-in. Wolf names the accounts, one at a time, to the agent;
on 2026-09-12 they are Alina, Mary, Lemongrass and Wolf. Cover, video and
audio autofill stay open to everyone: they cost no model call.

A library carries `hidden`, set only in the CMS admin panel (the content API
refuses it on update). Hidden, it leaves the home list and
`/library-sitemap.xml`, answers 404 at its address and on its share links to
everyone but its owner, who sees it whole under the line "This library is
hidden: only you can see it." Wolf says which library to hide; the agent
flips the switch. Objects read by id straight from the CMS are not covered.

A library holds at most 300 objects across all its shelves, on top of 50 per
shelf (MAX_OBJECTS_PER_LIBRARY). The object lifecycle in the CMS rejects the
301st; every Add control on the page disables together at the cap with
LIBRARY_OBJECTS_FULL_MESSAGE, and the Add form shows the same line when the
CMS says no first (isLibraryFullError).

Known limit: the home grid reads the first 100 libraries in one request
(Strapi's page ceiling) and pages client-side. Past 100 libraries it needs
server-side paging; separate work. The address lookup already walks every
page, so the 101st library's own page resolves.

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

## Library info panel: the fold and its shortcut

The panel folds to its spine through the tab at the toolbar's right edge and
through **Ctrl+\\** (Meta+\\ answers too), `usePanelHotkey`, called once by
`LibraryTemplate`. Desktop only above 1025px, where the tab itself lives; on
a phone the panel is a drawer with its own opener. The binding stands down
while the caret is in an input, a textarea, a select or a rich-text editor,
so it can never eat a keystroke meant for text, and it reads `event.code`
so a layout that prints another character on that key still answers. The
choice is per account and survives a refresh, as the tab's already does.

## Library content counts

A kind the library does not hold is not written as a zero: neither its icon
nor its number stands in the panel's Content line (Wolf, 2026-09-10). With
no books, videos or audio at all the Content heading goes with them.

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
So does Clear, a word in brown ink beside the row's one pill on the toolbar
(Wolf, 2026-09-10).

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
- Search runs inside the active tag. Clearing the search keeps the filter,
  and clearing the tag hands the library back exactly as the search left it:
  the shelves it excluded do not return with the tag.
- Dragging a book in the gathered row saves the tag's own sequence through
  `POST /tags/reorder`, never a shelf's. Owner and desktop only, the same rule
  the shelves follow. A newly tagged book lands at the end.
- A tag's name is the owner's own word, written the way they write it:
  spaces, accents, punctuation, any script, up to `MAX_TAG_NAME_LENGTH`.
  Nothing about it has to be URL-safe, since the CMS derives the address from
  the name and never takes one from the client. The form is not to hold the
  name to a character class again.
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
through `PUT /api/objects/:id`, the Tags row under the author answers it, and the
panel's tag list is re-read so counts, the gathered row and the unused-tag hint
follow immediately. A failed save returns the row to the last set the server
accepted and says so; a set is never assumed saved from a click. Every pill
inside the book, in the row and in the picker's menu, says on hover what its
owner wrote about it, the same sentence the panel gives; the pill itself stays
a label there.

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
  is spoken rather than drawn. The owner's Tags row stands from the start under
  the author and above Published, as tall as a pill when empty, so the first tag
  lands in space already held.

## Library shared memory: member books in the title search

Books on the public shelves of the shared libraries are offered while a member
types a title in the Add book wizard, ahead of Google Books and Open Library.
The shared owners are listed in `src/constants/library/sharedLibraries.ts`,
Wolf's library alone for now (Wolf, 2026-09-09); widening it is one entry there.
The book route reads the CMS anonymously, exactly as a visitor sees the
library, so a private shelf never reaches the wizard. A member row carries
title, author, publication date, source URL and the owner's uploaded cover in
the largest rendition under the upload cap, served through the cover proxy,
which admits the CMS upload folder for that. It never carries the owner's
notes, rating, difficulty, tags or shelf: those are the owner's own. Provider
rows repeating a member title are dropped. Every lookup leaves a
`library.autofill.member` JSON line.

### Design passport

- Palette: the member ring is the existing `--blue-500`, `--blue-400` on hover
  and keyboard selection. No other color on this surface changes.
- Typography: existing autocomplete faces; the hint uses the shared Tooltip at
  its own size. The origin is also read out with the row for screen readers.
- Spacing and radius: existing option row; the ring is drawn inset.
- Motion passport: the Tooltip's existing 150ms opacity; the ring is static.
  Reduced motion follows the Tooltip.
- Scrollbar passport: no new scrollable surface.
- Stability passport: the ring lives inside the row's box, so a member row is
  exactly as tall and wide as a provider row and hover costs no space.

## Library shelf description

A shelf may carry a description, written by the owner in the Add shelf form
and in the shelf's Edit shelf form under the name, 180 characters at most,
counted under the field; the cap is `MAX_SHELF_DESCRIPTION_LENGTH`, mirroring
the CMS `single-shelf.description` field (keepsimple-cms-new #412). When a
description is set, a (?) mark stands right after the shelf name for owner
and visitor alike and says it on hover and keyboard focus through the shared
Tooltip. With nothing written there is no mark at all. Saving sends only what
changed; an emptied description clears the hint.

The Favorites shelf carries one too, as `library.favoritesDescription`
(keepsimple-cms-new #413, unmerged until Wolf says so): the owner opens it
from the shelf name, the form shows the description alone since the name is
fixed, and the save goes through the library like its privacy does. The same
(?) mark and hint follow.

### Design passport

- Palette: the mark is `--white` inside a `--brown-border` ring, its glyph
  `--gray-darkest`, both turning `--brown` on hover and focus. The hint is the
  shared Tooltip's paper.
- Typography: the glyph is Source Sans Pro at 12px, weight 600. The hint is
  the Tooltip's Source Serif 4 at 16px.
- Spacing and radius: 20px round mark, 2px after the name inside the header's
  existing 6px gap. Form fields keep the 6px label gap and 24px between fields.
- Motion passport: the Tooltip's 150ms opacity in and out; the mark's color
  and ring ease over 200ms. Reduced motion disables both.
- Scrollbar passport: no scrollable surface; the hint wraps within 300px.
- Stability passport: the mark exists only with a description, so a shelf
  without one is drawn exactly as before; hover changes color only. The hint
  is portaled and reserves no space.

## Library dark mode design passport

The Library reads in two lights, and the switch is the site's own: keepsimple's
navbar toggle (`useGlobals`, persisted in localStorage, applied app-wide by
`_app` on cold load) puts `darkTheme` on `<body>`, and every Library surface
reads it from there. The Library ships no control of its own and must not grow
one: a second switch for one section is a second answer to the same question.
Components know nothing of the theme either: every token in `variables.scss`
has a night value in `themes.scss` under `body.darkTheme .library`, which also
covers surfaces portaled to `<body>` since they carry the `.library` class. A
component that hardcodes a colour is off passport in both lights.

- Palette: night paper is warm, never grey: page `#191614`, surfaces
  `#1f1c19` to `#2b2724`, borders `#3b3530`, ink `#efe7dc`, secondary ink
  `#a39b91`. The one accent lifts to `#c98a52` (`#dca46f` on hover) so it
  clears 4.5:1 on night paper. Book artwork keeps its own colors; the wood
  plank photograph is dimmed to brightness 0.5, saturation 0.85. New light
  tokens for former hardcoded values: `--white-400`, `--gray-300`,
  `--gray-400`, `--sand-100/200/300`, `--panel-tab-shadow-hover`.
- Typography: unchanged in both lights.
- Spacing and radius: unchanged in both lights. The theme adds no control and
  takes no space.
- Motion passport: page and ink cross over in 200ms ease; the plank dims in
  200ms. Reduced motion switches at once.
- Scrollbar passport: themed scrollbars read `--taupe` and `--white-100`, so
  they follow the theme; `color-scheme: dark` themes the native ones.
- Stability passport: the theme changes colour only, never geometry.

## Library tag usage chart

In the tag's edit form, `Where this tag is used` is a ring rather than a list:
one slice per shelf, the shelves the tag actually reaches, biggest share
first. The share is spoken in percent beside each shelf name, worked out by
largest remainder so the column adds up to a hundred; a share under half a
percent reads `<1%` rather than rounding away to nothing. The ring's eye
holds the total. Resting on a slice, or on its row in the list, or reaching
either by keyboard, names that shelf and the books it holds under this tag in
the shelf's own sequence, ten of them before the hint says how many more
remain: the hint has no scrolling surface, so the list ends where the paper
does. A tag on nothing still says so in words. The chart is drawn from the
library on screen, so no request is made for it, and it follows the colour
being picked in the form as it is picked.

### Design passport

- Palette: the tag's own colour, and nothing else. Slices fall from full
  strength to 0.35 by rank, the paper showing through, so the ring reads the
  same in both lights. The hovered shelf holds its strength while the others
  step back to 0.35 of theirs, slice and legend row by the same amount; the
  hovered row itself takes the existing `--off-white`. Text is `--black` with `--gray-darker` for the figures, and
  the hint's shelf name is `--brown`.
- Typography: the total is Source Serif 4 at 24px over an 11px uppercase
  Source Sans Pro label; shelf names and percentages are the existing 14px
  small text; the hint runs at 14px with a 12px uppercase heading and a 12px
  footer line.
- Spacing and radius: the ring is 132px square, drawn in a 120-unit box with a
  44 radius and an 18 stroke; slices are parted by 1.2 units of paper. The
  chart and its legend sit 20px apart, legend rows 4px by 6px on
  `--radius-control`, swatches 10px round on `--radius-tag`.
- Motion passport: strength and row background ease over 200ms; the hint keeps
  the shared Tooltip's 150ms opacity. Reduced motion disables all three.
- Scrollbar passport: the legend caps at 240px behind a 12px themed scrollbar,
  taupe thumb on white-100, 6px thumb radius, its gutter held from the start.
- Stability passport: the ring's box never changes with the shelf count, the
  total is laid over it rather than in the flow, and the percentage column is
  sized for its widest reading. Hover changes colour only.

## Library server rendering and its addresses

A library is written into the response, not fetched after it. Until 2026-09-10
`/library/wolf` answered with a shell: the title, the description and the
schema.org list were in the first HTML and everything a reader could actually
read arrived later by script, so a crawler that runs no scripts, which is most
of them and every AI one, indexed `Loading`, `0 Books` and `No tags yet` on a
page linked from elea.co, the CV and LinkedIn as proof of 165 read books.

`getPublicLibraryView` makes that read once, on the request, always
anonymously: the same read a visitor's browser would make, so a private shelf
never reaches the page source even on the owner's own request. Its answer
seeds `GlobalStateProvider`, `DashboardProvider` and `LibraryTemplate`, which
is why the panel's About, counts, Author and tags stand in the first paint
rather than a beat later. The browser still re-reads on mount, silently, so
the owner's own view arrives without the shelves blinking out.

- Book notes do not travel with the list. They are the longest thing a library
  holds and no shelf draws them; the note rides with the one object the URL
  names, in full, and lives on that book's own page.
- Covers are trimmed to the fields the cards read. A cover carries six
  renditions of metadata that nothing on this page opens.
- Every object address carries its own metadata through `objectSeo`: its own
  title, a description drawn from the owner's note, its cover as the shared
  image, and a `Book`, `VideoObject` or `AudioObject` entry whose `review`
  holds the note and the rating. Before this, 165 addresses answered with the
  library's own title and picture, which reads as one page repeated.
- A dialog cannot be server-rendered: `Modal` returns null where there is no
  document, and the browser opens it on arrival. Any new portal follows that
  rule or it takes the whole response down at an object's address.
- `/library-sitemap.xml` lists every public library and every object on a
  public shelf. Strapi's own sitemap plugin does not know these URLs: on
  2026-09-10 not one of them was in it. `public/robots.txt` names both
  sitemaps, but the file served on keepsimple.io is not this one (it carries a
  line the repo never had), so a robots change reaches production only through
  The Order.
- `/llms.txt` and `/llms-full.txt` carry the Library the same way: the hub's
  line, and one line per public library, expanded from the same anonymous
  read the sitemap makes. Individual objects are left out on purpose. They
  are a reader's own notes, they change daily, and the file is committed to a
  public repository. Both files are written by `scripts/generate-llms.ts`,
  which reads the live CMS and names production addresses regardless of the
  env file the run picked up; `LLMS_STRAPI_URL` and `LLMS_BASE_URL` override
  both when a run has to point elsewhere.

### Library object article design passport

- Palette: existing paper tokens. `--white-200` page, `--beige` border,
  `--black` ink, `--gray-darker` for the secondary line, `--brown` for links.
  Night values come from the theme sheet; the component names no colour.
- Typography: Source Serif 4 at 24px for the title and 16px for the author and
  the note; Source Sans Pro at 12px, uppercase, 0.12em for the metadata line
  and the tags; 14px for links.
- Spacing and radius: 24px padding, 24px between cover and text, 720px cap,
  132px cover, `--radius-control` throughout. 16px padding under 768px.
- Motion passport: the link's underline solidifies over 200ms ease, disabled
  under reduced motion. Nothing else moves.
- Scrollbar passport: no scrollable surface.
- Stability passport: the article is drawn once from the server and never
  changes shape; hover changes colour only.

## Library magic book and AI accuracy

Owner-only, signed in, desktop: the same rule every editing control on a
shelf follows. A visitor, a guest preview and a phone see neither.

### The magic book

One slot stands at the end of every book shelf. Nothing is chosen unasked
(Wolf, 2026-09-10): the empty slot is blank paper with a Roll, and the roll
is the owner's click, one shelf at a time. Arriving at the library reads the
store only and costs no model call. A pick is dressed as a shelved book: the
same 180 by 208 cell, the same mockup, a "Magic" mark at the head of the
cover, the chance the owner likes it on a slip at the foot. Under the
pointer the dossier says why in the owner's own terms, with the match and
the source that confirmed the book. A click opens the brief: the cover, the
title, author and year, the chance as a number with the rubric that made it
(five dots per dimension the library carries), the reason, the source link,
and Re-roll, which runs the engine for that shelf again and swaps the brief
in place. A pick whose shelf has since changed is not offered as current;
the slot goes back to Roll. It is not a shelved object: it cannot be
dragged, dropped on, selected or shared, and it steps aside while a search
narrows the row. The Favorites shelf and a tag's row carry none, being views
of other shelves' books.

The algorithm, agreed with Wolf on 2026-09-10 and kept in
`src/lib/library/magic`:

1. The library is digested with every field the owner wrote and none they
   did not: title, author, year, tags, rating, difficulty, the note as plain
   text cut at 900 characters, the shelf description, and the shelf name only
   when it carries a subject (`isTopicalShelfName`: stage words such as
   "Reading now", "Favorites", "Misc", bare years, and names under three
   letters are dropped). Absence is never defaulted.
2. Ratings are labels: 5s define what the owner likes, 1s and 2s are negative
   examples and matter as much. Notes say why, and the pick runs along the
   axis they praise rather than along genre. Tags are the owner's ontology.
   Difficulty is calibration: the pick lands in the band the owner rates
   highest. The shelf name sets the subject; its books set level and style;
   when they disagree the name wins on subject and the books on the rest.
3. Eligibility: a shelf without books gets no pick. A percent is shown only
   once the library holds three rated books (`MAGIC_MIN_RATED_FOR_MATCH`).
4. One model call per batch of up to ten shelves, Opus 5 at high effort on
   Wolf's subscriptions through `claude-relay` (below), asking for one JSON
   object with five ranked candidates per shelf, each with a rubric of five integers 0..5: theme, notes, tags,
   difficulty, distance from the negative examples. Every candidate carries two
   separate texts and neither may do the other's work: `about`, what the
   book is, two or three sentences in the third person, and `reason`, why
   this owner is being given it, addressed to them and grounded in their own
   notes. The same two on the AI shelf. A card shows the short one and opens
   to a brief that cuts nothing (Wolf, 2026-09-11). Books in the library,
   titles the owner rolled past on that shelf and banned titles are excluded
   in the prompt and again on the way out.
5. Every candidate is verified, in rank order, against Google Books and then
   Open Library by title overlap and author surname. The first confirmed one
   stands, with the source's own title, author, year and cover through the
   cover proxy. Candidates nothing confirms are listed to the model in one
   second pass; a shelf still empty after that stands empty until the next
   roll.
6. The percent is the weighted mean of the rubric (notes 30, theme 20, tags
   20, difficulty 15, distance 15, over 5), with any dimension the library
   carries no data for dropped and the rest renormalised, moved by a
   calibration offset: up to five rated books are held out of the prompt
   with their ratings withheld, the model predicts them, and the mean signed
   error at eight percent per rating point, clamped to sixteen, shifts the
   scale. Clamped to 5..97, whole percent. The model never writes the number.
7. Picks persist per shelf in `logs/library-magic/store.json` beside the
   journal, and are made only when the owner rolls. A pick stands until the
   owner rolls it away (Wolf, 2026-09-11): editing the shelf, renaming it,
   rating or annotating its books never unseats it and never spends a model
   call unasked. It gives up its place for two reasons only, both free: the
   owner now owns that book, or has banned it. A roll adds the standing
   pick, if any, to that shelf's exclusions. Sixty model calls per library per UTC day,
   after which what stands stays and the rest waits. Every request leaves a
   `library.magic-book` line in `logs/library-magic/journal.jsonl` and on
   stdout: outcome, shelves run, ready and empty counts, model calls,
   calibration, unverified count, duration and the picks by normalised title.
   Never the token or the key.

### Paid for by the subscriptions, never an API key

Wolf's rule (2026-09-10): everything AI in the Library, for every owner,
runs on his Claude subscriptions, the Terminal's tracks t1, t2 and t3, in
that order, and the owner never notices which. No paid API. The tokens never
enter this app: `src/lib/library/magic/relay.ts` sends an Anthropic Messages
request to `claude-relay` (The Order's container on the `wolf-shared`
network, `wolfs-server/docs/claude-relay.md`), which holds the tracks,
tries t1 first, moves to t2 and then t3 on a rate limit or a dead token, and
names the track that served in `x-relay-slot`. Opus runs through the real
Claude Code CLI inside the relay, one turn, no tools, so the schema is asked
for in the prompt and the JSON is read out of the text. Every journal line
carries `served` (track, model, transport); `tracksExhausted` marks a run
where no track answered or the relay was out of reach, and the owner reads
"The engine is out of reach right now" on the card. Runtime values, both
provisioned by The Order per container: `CLAUDE_RELAY_URL` (default
`http://claude-relay:8080/v1/messages`) and `CLAUDE_RELAY_TOKEN`. The
`ANTHROPIC_API_KEY` and `OPENAI_API_KEY` on this host are not read by the
Library.

Route: `POST /api/library/magic-book` with the owner's Strapi session as a
Bearer token and `{ libraryId, action: 'load' | 'roll', shelfId? }`: load
reads the store for every book shelf and makes no model call; roll runs the
engine for one shelf. The
route asks Strapi who is calling, reads the library with that session and
refuses anyone but the library's owner. The store is a DEV stand-in: moving
picks and exclusions into the CMS is a schema change and its own release.

### AI accuracy

Where the AI Librarian opener stood on the toolbar, the owner reads
`AI accuracy NN%`: how much of what the engine reads is written into the
library. It is a coverage score computed from the library on screen by
`scoreLibraryAccuracy`, no request made, books only. Weights agreed with
Wolf on 2026-09-10, 100 points:

| #   | Component           | Points | Measure                                                                    |
| --- | ------------------- | ------ | -------------------------------------------------------------------------- |
| 1   | Notes and takeaways | 25     | share of books with a note of 40 words or more                             |
| 2   | Ratings             | 20     | 15 for the share rated, 5 once three books are rated 1 or 2                |
| 3   | Rated volume        | 20     | log curve on the count of rated books, full at 30                          |
| 4   | Tags                | 15     | 12 for the share tagged, 3 for the share of tags used on two books or more |
| 5   | Difficulty          | 10     | share of books with a difficulty set                                       |
| 6   | Themed shelves      | 10     | share of book shelves whose name carries a subject                         |

Clicking the status opens the ledger: the total with one line under it, then
six quiet lines, each a name, a meter and earned over maximum, and at the
foot the one step that buys the most per book touched with its gain in whole
percent. The counts behind a line and its own cheapest step are said on
hover and keyboard focus through the shared Tooltip, not drawn (Wolf,
2026-09-10: the first cut was too noisy). A step is sized to move the total
by a whole percent, so a large library is asked for seven notes rather than
four and never reads "Full" on a row that is not. The number measures data
coverage, not model accuracy; calibration from held-out ratings feeds the
magic book's percent, not this one.

### Design passport

- Palette: Library paper and wood neutrals; the AI accent `--purple-100`
  for the Magic mark, the meters, the Re-roll and Done hovers, with
  `--purple-400` in the cover light. Nothing else changes colour.
- Typography: Source Serif 4 and Source Sans Pro. The status label is Source
  Sans Pro 13px uppercase 0.08em as the Librarian label was, the value
  Source Serif 4 16px semibold tabular. The ledger: total at 34px, lines and
  the foot at 14px. The card: title 16px, author 14px, slip 11px, mark 12px,
  Roll 14px, blank paper 14px. The brief: title in the existing
  subtitle-secondary-semi variant, byline 14px, the chance at 34px with its
  label at 14px, rubric 12px, reason 16px over 24px, source 12px, buttons
  14px.
- Spacing and radius: 4px grid; the status keeps the Librarian's 300 by 44px
  box, 2px `--beige` border and 16px padding; the ledger is 400px wide with
  20px by 32px body padding, 36px lines on a 148px, meter, 64px grid; the
  brief is 560px wide, cover column 146px, 24px gaps, 36px buttons; meters
  are 6px and 4px tall, rubric dots 8px round. `--radius-control`
  throughout.
- Motion passport: the card lifts 6px over 250ms as every shelved book does;
  pick and blank paper crossfade over 300ms ease; the slip, the mark and the
  Roll fade over 200ms; the cover light runs 1.6s while the engine works, on
  the card and in the brief, and 12s under the pointer; meters fill by scaleX
  over 600ms with cubic-bezier(0.2, 0, 0, 1); ledger lines and rubric dots
  colour over 200ms; the ledger and the brief use the shared Modal fade.
  Reduced motion disables every transition and animation and leaves the
  light at a still 0.1.
- Scrollbar passport: no new scrollable surface. The ledger is capped by the
  Modal and its six rows fit.
- Stability passport: the magic slot is one card wide in every state, idle,
  loading, ready, empty and ineligible, so the row never changes length; the
  slip, the mark and the Roll are held in the DOM and shown by opacity; the
  status value is sized for 100% and the meter fill is scaled, not resized;
  hover changes colour and lift only. The ledger's lines are fixed columns
  and hold their geometry as the numbers change. The brief's cover column is
  fixed and its foot note is held in the row, so a re-roll swaps the words
  without moving the buttons.

## Library MCP

An agent keeps a library in order through `mcp/library`: five tools over one
library, and nothing else. It lists books with their notes, creates and edits
tags, puts a tag on a book or takes it off, sets the order the tag's books
stand in, and writes a book's note, rating and difficulty. It deletes nothing:
removing a book, a shelf or a tag asks the owner first, in the Library.

The key is not a second authority. Every Library controller decides who may
write by reading the authenticated user, so the key is exchanged at
`POST /api/auth/library-agent/session` for the ordinary two-hour session that
library's owner holds, and the same ownership checks, feature flag and limits
decide every write afterwards. The CMS holds only `<label>:<sha256>:<library
id>` in `LIBRARY_AGENT_KEYS`, so that configuration leaking hands nobody a
session; the key itself lives with the agent that holds it. A key belongs to
one target, because prod and staging number their libraries separately.

Every call leaves a line in `logs/library-mcp.jsonl`: tool, arguments cut to
120 characters, outcome, duration, UTC. Never the key, never the session.
Before any release of this surface run `mcp/library/probe.mjs` against a
library you may touch: it exercises all five tools and takes back every write.
Setup and wiring live in `mcp/library/README.md`.
