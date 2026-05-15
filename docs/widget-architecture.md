# Ask UX Core widget — how it works, layer by layer

A visitor types a question. Five layers stand between that and the answer.

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. HOST PAGE  (any keepsimple.io / uxcore.io page)                 │
│     Visitor lands. A single <script> tag injects the widget.        │
│     Widget can read the page (title, H1, links, visible text)       │
│     and highlight matching elements on it.                          │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. WIDGET UI   (pill in the corner, panel when opened)             │
│     • Pill — always there, breathes idle.                           │
│     • Panel — transcript above, input below.                        │
│     • Cards — the bot's pointers ("PROJECT: UX Core", "ARTICLE: …").│
│       Each card carries a one-line "why this" written by the LLM    │
│       for the visitor ("the canonical anchoring entry"). Renders    │
│       italic under the title; absent when the LLM didn't supply one.│
│     • Host highlight — when a card lands, the matching element on   │
│       the page glows; clears when the visitor hovers it.            │
│     • Card hover-prefetch — after ~80ms hover, injects a            │
│       <link rel="prefetch"> so navigation feels instant. De-duped   │
│       per URL per session, same-origin only.                        │
│     • Recommended-question chip — on pages that ship a              │
│       "recommended questions" section (e.g. UX Core bias cards),    │
│       the widget DOM-harvests one at random and prepends it to the  │
│       empty-state suggestion chips. Pure client-side, no server.    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. WIDGET BRAIN  (runs in the visitor's browser)                   │
│     Knows:                                                          │
│     • Which page they're on (URL slug first, then title + H1).      │
│       Slug wins for UX Core biases / UXCG cases — those are modal   │
│       overlays whose H1 stays on the project home.                  │
│     • The full conversation so far.                                 │
│     • Whether they just navigated (drops a "Now viewing: X" line).  │
│     • The last card they clicked + its relevance tier               │
│       (high/mid/low) — sent so the LLM's follow-up-question rule    │
│       can fire on a soft pick.                                      │
│     Sends each question + recent history + page identity            │
│     + last pick to the server.                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼  POST /api/concierge
┌─────────────────────────────────────────────────────────────────────┐
│  4. CONCIERGE SERVER  (Next.js API, the orchestrator)               │
│     For each turn it:                                               │
│     a) Resolves canonical page identity                             │
│        ("you're on UX Core / a bias page / Articles" — never        │
│        guessed, always derived from the URL).                       │
│     b) Tags visitor intent — GLOBAL (wants a different section)     │
│        or SPATIAL (about here). Pure keyword pass, no LLM call.     │
│     c) Builds the candidate pool: evergreen surface cards           │
│        (UX Core, UXCG, UXCP, UXCAT, AI Atlas, Longevity, Articles,  │
│        Pyramids) + library hits from retrieval.                     │
│     d) Asks the LLM to write the answer and pick 2–3 cards.         │
│     e) Streams the answer back token-by-token.                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐
│ 5a. LightRAG     │ │ 5b. LLM          │ │ 5c. Curated knowledge    │
│   (uxcore-rag)   │ │   (Claude Sonnet)│ │  • Surface cards         │
│ Two retrieves:   │ │ Single call per  │ │  • About-keepsimple      │
│  • by question   │ │ turn. Receives   │ │  • Voice / hard-bans     │
│  • by current    │ │ identity + page  │ │  • Intent rule           │
│    page          │ │ content + history│ │    (visitor wins)        │
│ Returns:         │ │ + candidates +   │ │                          │
│  • snippets      │ │ intent tag.      │ │                          │
│  • cited URLs    │ │ Returns JSON:    │ │                          │
│    with scores   │ │ {answer, used[], │ │                          │
│                  │ │  whys[]}         │ │                          │
└──────────────────┘ └──────────────────┘ └──────────────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                  Final payload back to widget:
                  • Answer text
                  • 2–3 cards (title + blurb + "why this" + dots)
                  • Optional suggestions
```

## Flow in one sentence

The widget watches where the visitor is, sends their question with that context to the concierge, which retrieves what's relevant, asks the LLM to weave an answer and nominate cards, and streams it back — the widget then renders cards and lights up matching elements on the host page until the visitor interacts with them.

## What's NOT in here

- No vector DB owned by the widget. Retrieval lives in `uxcore-rag` (LightRAG over Strapi content).
- No per-user account. Session is anonymous, transcript is in browser localStorage.
- No background polling. Everything is request/response, one round-trip per turn.

## Adjacent: keeping the graph DB fresh

The widget never indexes content itself; it queries whatever the RAG
graph currently holds. Today the graph is re-built manually by the
RAG owner when content drifts too far.

A delta-indexing path (Strapi webhooks + GitHub Action + ingest
endpoint + safety-net cron) has been designed but is **currently
deferred** — see `docs/delta-indexing-proposal.md` for the agreed
direction when we resume.

## Carve-out: homepage first-touch starters

The homepage empty-state chips and the answers + cards they produce are **not** served by the concierge pipeline above. They live entirely on the client, in `HOMEPAGE_STARTERS` inside `widget/src/AskUxCore.tsx`.

Three hand-crafted Q&A objects (en + ru), one per starter chip:

1. _What does keepsimple actually make?_
2. _How is this project completely free?_
3. _Where do I start if I'm new here?_

When the visitor clicks one of those chips on the homepage, `runStarter()` synthesizes a finished Turn locally — the answer text and the 3–4 hand-picked cards render immediately, no LLM call, no LightRAG retrieval, no `/api/concierge` round-trip.

The carve-out only fires when:

- the panel is in the empty state (no transcript yet), **and**
- the visitor is on the homepage (`/`, `/ru`, `/hy`), **and**
- they click one of the three starter chips.

Anything else — free-form questions on the homepage, follow-ups after a starter, every non-homepage page — goes through the normal pipeline.

**Why this trade-off:** the first impression is the highest-leverage moment in the whole funnel. Pristine brand copy, zero latency, zero hallucination risk on those three questions outweighs the cost of keeping their copy in code (and re-deploying when it changes).

## Carve-out: widget UXCAT begin-test auth-gate

When the widget's in-panel "Begin Test" CTA (rendered on `/uxcat` only) is clicked by an anonymous visitor, it does **not** navigate to `/uxcat/start-test`. Instead, it dispatches a `ks-aux-request-login` `CustomEvent` on the window.

`UXCatLayout` listens for that event and opens its `LogInModal` — the same modal the in-page begin-test CTA opens. After a successful login the visitor can start the test from there. Logged-in visitors get navigated to `/uxcat/start-test` directly.

Reason: matching the in-page CTA behavior so the widget never sends a fresh visitor to a guarded URL that just bounces them back.
