# Copilot analytics — Postgres spec (copilot-events service)

Goal: capture every Copilot session AND every visitor movement end-to-end so we can read transcripts, see who went where, watch dwell-time per page, and catch the anonymous → registered moment. Stored in the **copilot-events** sibling service (Postgres 16, sits next door, HTTP ingest at `COPILOT_EVENTS_URL`). KeepSimple side ships zero Postgres dependencies — it's a thin HTTP client.

This supersedes the deleted `copilot-analytics-strapi-spec.md`. Strapi was wrong for this: at our user base the `copilot-turn` collection would balloon past 100k rows per week, the admin panel would become unreadable, and we'd only have Q&A — no nav, no clicks, no dwell.

---

## 1. Ingest endpoint

The copilot-events service exposes a single ingest endpoint that upserts the session row and appends an event row in one shot.

```
POST /track
Authorization: Bearer ${COPILOT_EVENTS_WRITE_TOKEN}
Content-Type: application/json

{
  "sid":       string  (required, browser-side session id)
  "threadId":  string  (required, bumped on every CLEAR)
  "kind":      string  (required, see event taxonomy below)
  "env":       string  (required, dev | staging | prod)
  "ts":        string  (optional, ISO timestamp; defaults to server now())
  "lang":      string  (optional, en | ru | hy)
  "pageUrl":   string  (optional, max 500 chars)
  "pageTitle": string  (optional, max 300 chars)
  "userAgent": string  (optional, max 500 chars)
  "firstUrl":  string  (optional, max 500 chars)
  "payload":   object  (optional, event-specific fields)
}

→ 204 No Content       on success
→ 400 {error}          on missing required fields
→ 401 {error}          on bad token
→ 500 {error}          on DB insert failure
```

The service auto-creates the session row on first sighting (reads `lang`, `userAgent`, `firstUrl` from the first event), increments `event_count` on every subsequent event, and has a special case for `kind=auth` with `payload.user` — that one stamps `linked_user` + `linked_at` on the session row.

Read endpoints (`GET /sessions`, `GET /sessions/{sid}/events`) are token-gated on a separate `COPILOT_EVENTS_READ_TOKEN` — not used by the KeepSimple side.

---

## 2. Event taxonomy

| kind             | Fires when                                   | Carries in `payload`                                         |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `session_start`  | First touch from a new sid                   | —                                                            |
| `question`       | Visitor sends a Copilot message              | `query` (PII-scrubbed)                                       |
| `answer`         | Server finishes building the bot reply       | `answer`, `cardsShown`, `mode`                               |
| `clear`          | Visitor hits CLEAR (rotates thread)          | —                                                            |
| `card_click`     | Visitor clicks a Copilot card                | `cardClicked: {title, url, tier}`                            |
| `nav`            | Widget-visible nav chip (internal nav)       | —                                                            |
| `page_view`      | Every entry into a page (mount + URL change) | —                                                            |
| `dwell`          | Every exit from a page (in-app + unload)     | `dwellMs`, `pageUrl`, `pageTitle`, `sealed` (true on unload) |
| `outbound_click` | Click on an anchor to a different origin     | `href`, `anchorText`, `target`                               |
| `auth`           | NextAuth session detected on this sid        | `user` (email or sub)                                        |

New kinds are forward-compatible — the service accepts any string and stores the rest in JSONB `payload`. No schema migration needed when we add more.

---

## 3. DB schema (mirrored from copilot-events init.sql)

```
sessions
  session_id     TEXT PRIMARY KEY
  env            TEXT NOT NULL
  lang           TEXT
  user_agent     TEXT
  first_url      TEXT
  started_at     TIMESTAMPTZ NOT NULL
  last_seen_at   TIMESTAMPTZ NOT NULL
  linked_user    TEXT
  linked_at      TIMESTAMPTZ
  thread_count   INT NOT NULL DEFAULT 1
  event_count    INT NOT NULL DEFAULT 0

events
  id            BIGSERIAL PRIMARY KEY
  session_id    TEXT NOT NULL
  thread_id     TEXT NOT NULL
  env           TEXT NOT NULL
  kind          TEXT NOT NULL
  ts            TIMESTAMPTZ NOT NULL
  page_url      TEXT
  page_title    TEXT
  payload       JSONB NOT NULL DEFAULT '{}'::jsonb
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()

indices:
  events_session_ts_idx  (session_id, ts)
  events_kind_ts_idx     (kind, ts)
  events_env_ts_idx      (env, ts)
  events_payload_gin     USING GIN (payload)
  sessions_env_started_idx    (env, started_at DESC)
  sessions_linked_user_idx    (linked_user)
```

---

## 4. KeepSimple-side wiring

- **Writer**: `src/lib/copilotAnalytics.ts`. Exports `ensureSession`, `logTurn`, `markAuthLink`, `bumpThread`, `copilotAnalyticsEnabled`. Every call is fire-and-forget; failures land in `console.warn`, never bubble to the visitor.
- **Server-side Q&A fan-out**: `src/pages/api/concierge.ts` calls `logTurn({kind:'question'})` + `logTurn({kind:'answer'})` after the response is built.
- **Widget event endpoint**: `src/pages/api/copilot/event.ts` receives non-Q&A events (`clear`, `card_click`, `nav`, `page_view`, `dwell`, `outbound_click`, `auth_probe`) from the widget. Reads the `aux_sid` cookie, does the NextAuth-detection / `markAuthLink` dance, then dispatches to `logTurn` / `bumpThread`.
- **Widget emitter**: `widget/src/api.ts` → `postCopilotEvent(...)`. Uses `navigator.sendBeacon` so card_click and dwell-on-unload survive page navigation.
- **Page-movement capture**: `widget/src/AskUxCore.tsx` nav `useEffect` fires `page_view` on every page entry, `dwell` on every page exit (in-app or unload), and `outbound_click` on any anchor whose href crosses origin.

---

## 5. Environment variables

| Var                          | Where  | Notes                                                   |
| ---------------------------- | ------ | ------------------------------------------------------- |
| `COPILOT_EVENTS_URL`         | server | e.g. `http://127.0.0.1:5046` (DEV), set per environment |
| `COPILOT_EVENTS_WRITE_TOKEN` | server | Bearer token for `POST /track`. Inert when unset.       |

Both are SERVER-ONLY — never `NEXT_PUBLIC_*`. The widget never talks to the copilot-events service directly; it always goes through `/api/copilot/event` so the token stays on the server.

Local dev without the sibling container: leave both unset. The writer becomes a no-op and the rest of the widget works as normal.

---

## 6. Reading the data

For now: query Postgres directly (or hit `GET /sessions` and `GET /sessions/{sid}/events` with the read token). A dedicated dashboard / admin UI is a future epic, not v1.

---

## 7. Hard guarantees

- The KeepSimple repo has **zero** Postgres dependencies (no `pg`, no `prisma`, no `DATABASE_URL`). The DB lives in the sibling container.
- Neither endpoint is queried at Next.js build time, so a copilot-events outage cannot break a deploy.
- All writes are fire-and-forget — a 5xx, a missing token, or a timeout NEVER blocks the visitor's reply.
- PII scrub runs before any free-text field hits the wire (`scrubPii` in `src/lib/copilotSafety.ts`).
- The widget never sees the write-token. It always proxies through `/api/copilot/event`.
