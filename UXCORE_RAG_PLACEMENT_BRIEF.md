# Ask UX Core — design spec (v2)

**Status:** product decision, 2026-05-10 evening session. Supersedes the
morning version of this file. Backend is live and indexed
(168 docs, see `UXCORE_RAG_HANDOFF.md`). The floating-button test page at
`/concierge-test` was a working spike — **do not ship it as-is**, this spec
replaces it.

---

## Concept

One sentence: a guide, not a chatbot. Every reply is short, every reply
ends with 2-3 next-step cards, every card click navigates the page under
the widget while the widget stays open and reacts.

The differentiator: the widget doesn't answer and stop — it walks the
user through the site.

## Brand

- **Name on the pill:** "Ask UX Core" + small icon. The UX Core brand
  is stronger than KeepSimple itself; it pulls curiosity.
- The widget knows the entire site (UX Core, UXCG, UXCP, Pyramids,
  articles, AI Atlas) — not only UX Core. The pill name is a doorway,
  not a scope limit.
- **Voice:** professorial, formal "вы" / formal English, but never walls
  of text. Reads like a Harvard professor who respects your time.

## Surface (desktop only for now)

- **Idle:** pill anchored bottom-right of every page. Icon + "Ask UX Core".
  Subtle pulse every few seconds (idle attention; not aggressive).
- **Open:** floating panel ~380×520 px, anchored bottom-right, hovers above
  the page. Does not compress page content (a full-height sidebar would
  smash the UX Core grid — explicitly rejected).
- **Visual style:** KeepSimple-native (paper, cream, terracotta accents,
  editorial type). Note: `/uxcore` is a sibling repo with its own design;
  the widget keeps a single identity across both surfaces — it does not
  morph per host page.
- Mobile is deferred. Will think later.

## First screen

Empty input + cursor. No suggested prompts, no greeting, no page-aware
opener (a page-aware opener was considered and rejected — on a bias page
the example is right there on the page already).

## One reply, structurally

1. **Answer text:** ≤ 2 sentences, ~200 chars. No paragraph dumps.
2. **2-3 cards** as next steps, **title only** — no preview line, no type
   chip. Clean, like Arc Search results.

If the user query is vague, the widget may answer with **a single
counter-question** before giving the answer ("the LLM decides by
confidence"). On a clear request, it answers immediately. This is the
"sometimes Socratic" mode and is the principal upgrade Wolf wanted.

## What a card click does

The page navigates beneath the widget. The widget stays open and
**reacts**: "Открыл _Anchoring_. Что дальше — пример или приём?" with
new next-step cards. This continuous reaction is what turns the widget
from a chat into a guide.

If the user navigates via the **site's own nav** (not via a card), the
widget stays silent. It does not chase the user. The next move is the
user's.

## History within a session

Conversation is a scrolling chat feed within the browser tab. Closing
the panel (× / Esc) collapses it back to the pill — history is
**preserved** until the tab closes. Reopen → continue where you left off.

No cross-session memory, no problem-map artifact, no TTS — these were
considered and explicitly cut. A well-built guide does not need them.

## Empty / not-found state

When RAG returns nothing strong, the widget says something like:
"Не нашёл точно, но вот близкое" + 1-2 nearest cards. It never goes
silent and never reaches a dead end.

## Language

The widget follows the site locale (`useRouter().locale`):
`en` / `ru` (HY falls back to EN as everywhere else on the site).
No in-widget locale selector.

## Out of scope (possible upgrades, not MVP)

- Mobile.
- Memory of what the user has already read.
- A "your problem map" shareable artifact.
- TTS / voice answers.
- First-visit tooltip onboarding ("Спросите про UX Core").
- Page-aware first-screen prompts.
- Diagnostic flow with persona generation (was the original variant #3
  in the three-options discussion; remains the natural follow-up after
  this concierge ships and is validated).

These are deliberately deferred. If the guide is built well, none of
them are needed for the feature to feel premium.

---

## Tech / deployment

- **Single source of truth:** the widget is a **standalone JS bundle**.
  Both `keepsimple-oss` and `UXCoreOSS` repos add one `<script src=...>`
  line in `<head>`. One codebase, no per-repo divergence.
- The corresponding edge-injection variant (Cloudflare Worker rewrites
  HTML to inject the script) is cleaner but harder; flagged as a
  follow-up question for **The Order** as an optional upgrade. Do not
  block on it.
- **Scope on the site:** every public page. Auth flows, checkout,
  user dashboard, Longevity Protocol, Vibesuite remain excluded
  (wrong context — that exclusion list survives from the morning
  version of this brief).
- **Backend already wired:**
  - `POST /query/concierge` at `https://keepsimple-rag.administration.ae`
  - Cloudflare Access service token in `.env.local`
    (`CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET`)
  - Proxy pattern in `UXCORE_RAG_HANDOFF.md`
  - Returns `{answer}` Markdown; strip or stylize `[KG]` / `[DC]` markers.
- **Abuse protection:** anonymous session token in a cookie, per-token
  rate limit (~20 requests / 10 min). Plus a Cloudflare-level rate limit
  on `/api/concierge`. No login wall (would lose the audience), no
  CAPTCHA (would feel hostile).
- **Analytics (Mixpanel):**
  pill-open, query-sent, card-click, panel-close. Enough to see
  whether the feature is used and whether the guide flow holds.

## Implementation discipline (non-negotiable)

1. **One mount point.** A single `<AskUxCore />` component added to the
   root layout in each repo. Never pasted into individual page files.
2. **One config file** controlling per-route visibility (the
   excluded-routes list above).
3. **One kill switch.** A single env flag
   (`NEXT_PUBLIC_ASK_UX_CORE_ENABLED`) turns the whole feature off
   site-wide. Default off until merged + Wolf flips it on.
4. **Small atomic PRs.** Each PR routed through The Order or QA for
   structural review before merge. Wolf does not read code — we
   translate.

---

## Asks routed to The Order (2026-05-10 evening) — RESOLVED in ~1h

All three landed:

1. **Corpus.** Re-indexed: 168 → 200 docs. Biases (105) + UXCG (63) +
   articles (28) + pyramids (3) + company-management (1).
   AI Atlas deferred until we hand The Order the new content path
   (his old `/home/wolf/projects/ai-atlas` was deleted from the host).
   See "AI Atlas follow-up" below.
2. **Citation URLs.** Re-emit was already correct from the morning:
   `/uxcore/<slug>`, `/uxcg/<slug>`, `/articles/<slug>`,
   `/company-management`. New endpoint
   `GET /citations/debt` returns the 5 known content-debt items
   (3 pyramids + 1 company-management single-page + AI Atlas pending).
   Widget should drop or relabel chips for those slugs.
3. **Bundle host.** `https://widget.administration.ae` is live,
   public, CORS-locked to keepsimple.io + staging + localhost.
   Deploy: `rsync ./dist/ contabo-wolf:/home/wolf/widget-bundle/`.
   Hashed assets `Cache-Control: 1y immutable`; entry HTML `no-cache`,
   so new bundles ship instantly.

Edge-injection (CF Worker HTML rewrite) flagged as a follow-up,
not blocking.

### AI Atlas follow-up — DONE

AI Atlas ingested: 32 dossiers, one doc per sector. Citations resolve
to `/ai-atlas#<sector-id>`. Corpus now 232 docs total. RU locale is
one config flip away (not yet flipped — request that as part of
"flip RU index" ask whenever we're ready).

### Content-debt chips

The Order's `GET /citations/debt` returns 4 remaining items:
3 pyramids + 1 company-management single-page. They all share the
URL `/company-management`. Widget rule: if a citation's URL is on
the debt list, **drop the chip entirely** (don't render a card). We
prefer "fewer cards" over "card that links to a generic page that
doesn't answer the question". Re-evaluate when content is added.

### Streaming + error UI

- **Streaming:** LLM answer streams word-by-word into the panel
  (no spinner replacing the answer once a token arrives). Cards render
  after the answer completes. Streaming makes ≤200-char answers feel
  instant and alive.
- **Errors:**
  - Network fail / timeout: "Не получилось дотянуться, попробуйте ещё
    раз" + retry button. No carded fallback.
  - Rate limit hit (per-token quota): "Многовато за раз. Подождите
    минуту" + auto-retry timer. No retry button.
  - Server 500: same as network fail copy.
    These are short by design — the widget's brand is concision.

---

## Suggested next moves (in order)

1. Translate this spec into 3-4 atomic engineering tickets:
   one for the bundle, one for the panel UI, one for the API
   integration + rate-limit middleware, one for analytics + kill switch.
2. Send The Order the corpus + citation + hosting asks above.
3. Build the bundle. Wire it into both repos behind the env flag.
4. QA smoke: homepage, one article, one bias page (once /ux-core
   destinations exist), one Pyramids page.
5. Flip flag in staging. Wolf eyeballs. Iterate on tone + card
   selection from real session traces.
6. Promote to production via the agreed image + brain-snapshot pattern
   (HANDOFF.md).

---

## Don't

- Don't ship `/concierge-test` as the user-facing surface.
- Don't add the widget per-page.
- Don't ship without the env kill switch.
- Don't add memory / problem-map / TTS / mobile / onboarding
  tooltips in this MVP — they were cut on purpose.
- Don't make the widget louder than the page it lives on. The whole
  point is that it walks beside the user.
