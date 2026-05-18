/* Copilot analytics — server-side writer for the copilot-events
   Postgres service (sibling container, HTTP API on COPILOT_EVENTS_URL).
   Spec: docs/copilot-analytics-spec.md.

   The service exposes a single ingest endpoint, POST /track, that
   upserts the session row on first sighting and appends an event row
   to the events table. We never query at build time, never block the
   visitor on a failure, and stay inert when COPILOT_EVENTS_URL or the
   write-token are unset (local dev without the sibling container).
*/

export type EventKind =
  | 'question'
  | 'answer'
  | 'clear'
  | 'card_click'
  | 'auth'
  | 'nav'
  | 'page_view'
  | 'dwell'
  | 'outbound_click';

type TrackInput = {
  sid: string;
  threadId: string;
  kind: EventKind;
  lang?: string;
  pageUrl?: string;
  pageTitle?: string;
  userAgent?: string;
  firstUrl?: string;
  ts?: string;
  payload?: Record<string, unknown>;
};

type LogTurn = {
  sid: string;
  threadId: string;
  ts?: string;
  kind: EventKind;
  query?: string;
  answer?: string;
  cardsShown?: unknown;
  cardClicked?: unknown;
  pageUrl?: string;
  pageTitle?: string;
  mode?: string;
  meta?: Record<string, unknown>;
  /* Optional session-row seed fields. The service does an UPSERT with
     COALESCE on these, so passing them on every event is harmless —
     the session row picks up whichever non-null arrives first. */
  lang?: string;
  userAgent?: string;
  firstUrl?: string;
};

const BASE = (process.env.COPILOT_EVENTS_URL || '').replace(/\/+$/, '');
const TOKEN = process.env.COPILOT_EVENTS_WRITE_TOKEN || '';
const ENV_TAG = (process.env.NEXT_PUBLIC_ENV || 'dev').toLowerCase();
const TIMEOUT_MS = 4000;

function enabled(): boolean {
  return Boolean(BASE && TOKEN);
}

async function track(ev: TrackInput): Promise<void> {
  if (!enabled()) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(`${BASE}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        sid: ev.sid,
        threadId: ev.threadId,
        kind: ev.kind,
        env: ENV_TAG,
        ts: ev.ts,
        lang: ev.lang,
        pageUrl: ev.pageUrl?.slice(0, 500),
        pageTitle: ev.pageTitle?.slice(0, 300),
        userAgent: ev.userAgent?.slice(0, 500),
        firstUrl: ev.firstUrl?.slice(0, 500),
        payload: ev.payload,
      }),
      signal: ctrl.signal,
    });
    if (!r.ok && r.status !== 204) {
      console.warn(`[copilotAnalytics] /track ${ev.kind} → ${r.status}`);
    }
  } catch (e) {
    console.warn(`[copilotAnalytics] /track ${ev.kind} failed:`, e);
  } finally {
    clearTimeout(timer);
  }
}

/* No-op kept as a backwards-compatible export. Session-row metadata
   (lang / userAgent / firstUrl) is now seeded by the COALESCE upsert
   inside the service on every event — no dedicated session_start
   write needed. Call sites that already pass these to logTurn get the
   same result without the timeline noise. */
export function ensureSession(_opts: {
  sid: string;
  lang: string;
  threadId: string;
  userAgent?: string;
  firstUrl?: string;
}): void {
  /* intentionally empty */
}

export function logTurn(opts: LogTurn): void {
  if (!enabled()) return;
  const payload: Record<string, unknown> = {};
  if (opts.query !== undefined) payload.query = opts.query;
  if (opts.answer !== undefined) payload.answer = opts.answer;
  if (opts.cardsShown !== undefined) payload.cardsShown = opts.cardsShown;
  if (opts.cardClicked !== undefined) payload.cardClicked = opts.cardClicked;
  if (opts.mode !== undefined) payload.mode = opts.mode;
  if (opts.meta && Object.keys(opts.meta).length > 0) {
    Object.assign(payload, opts.meta);
  }
  void track({
    sid: opts.sid,
    threadId: opts.threadId,
    kind: opts.kind,
    ts: opts.ts,
    pageUrl: opts.pageUrl,
    pageTitle: opts.pageTitle,
    lang: opts.lang,
    userAgent: opts.userAgent,
    firstUrl: opts.firstUrl,
    payload: Object.keys(payload).length > 0 ? payload : undefined,
  });
}

/* Called when we detect a NextAuth session on a sid that previously
   had no linked user. The copilot-events service has a special case
   for kind='auth' with payload.user — it stamps sessions.linked_user +
   linked_at, so we don't need a separate write to bump the row. */
export function markAuthLink(opts: {
  sid: string;
  threadId: string;
  user: string;
  pageUrl?: string;
  pageTitle?: string;
}): void {
  if (!enabled()) return;
  void track({
    sid: opts.sid,
    threadId: opts.threadId,
    kind: 'auth',
    pageUrl: opts.pageUrl,
    pageTitle: opts.pageTitle,
    payload: { user: opts.user.slice(0, 200) },
  });
}

/* Called on widget CLEAR. The service is expected to bump
   sessions.thread_count when it sees a `clear` event (or, alternately,
   when it observes a brand-new thread_id on the same sid — either way
   we just fire the event and let the service do the bookkeeping). */
export function bumpThread(opts: { sid: string; oldThreadId: string }): void {
  if (!enabled()) return;
  void track({
    sid: opts.sid,
    threadId: opts.oldThreadId,
    kind: 'clear',
  });
}

export function copilotAnalyticsEnabled(): boolean {
  return enabled();
}
