/* Copilot analytics — server-side Strapi writer.
   Spec: docs/copilot-analytics-strapi-spec.md.
   Two collections in our existing Strapi:
     - copilot-sessions  (one row per visitor session)
     - copilot-turns     (one row per event inside a session)
   Token (`STRAPI_COPILOT_TOKEN`) is scoped write-only to these two
   collections — see spec for the exact Strapi-side setup.
   Every write is fire-and-forget: a Strapi 5xx, missing token, or
   bad schema NEVER blocks the visitor's reply. Failures land in
   stderr via console.warn so we can spot misconfig in Vercel logs.
*/

type TurnKind = 'question' | 'answer' | 'clear' | 'card_click' | 'auth' | 'nav';

type LogTurn = {
  sid: string;
  threadId: string;
  ts?: string;
  kind: TurnKind;
  query?: string;
  answer?: string;
  cardsShown?: unknown;
  cardClicked?: unknown;
  pageUrl?: string;
  pageTitle?: string;
  mode?: string;
  meta?: Record<string, unknown>;
};

type EnsureSession = {
  sid: string;
  lang: string;
  threadId: string;
  userAgent?: string;
  firstUrl?: string;
};

const STRAPI_BASE = (process.env.NEXT_PUBLIC_STRAPI || '').replace(/\/+$/, '');
const TOKEN = process.env.STRAPI_COPILOT_TOKEN || '';
const ENV_TAG = (process.env.NEXT_PUBLIC_ENV || 'dev').toLowerCase();
const TIMEOUT_MS = 4000;

function enabled(): boolean {
  return Boolean(STRAPI_BASE && TOKEN);
}

async function postStrapi(
  collection: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!enabled()) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(`${STRAPI_BASE}/api/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ data }),
      signal: ctrl.signal,
    });
    if (!r.ok) {
      console.warn(
        `[copilotAnalytics] strapi POST ${collection} → ${r.status}`,
      );
    }
  } catch (e) {
    console.warn(`[copilotAnalytics] strapi POST ${collection} failed:`, e);
  } finally {
    clearTimeout(timer);
  }
}

async function patchStrapi(
  collection: string,
  documentId: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!enabled()) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(
      `${STRAPI_BASE}/api/${collection}/${encodeURIComponent(documentId)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ data }),
        signal: ctrl.signal,
      },
    );
    if (!r.ok) {
      console.warn(`[copilotAnalytics] strapi PUT ${collection} → ${r.status}`);
    }
  } catch (e) {
    console.warn(`[copilotAnalytics] strapi PUT ${collection} failed:`, e);
  } finally {
    clearTimeout(timer);
  }
}

async function findSessionRow(sid: string): Promise<{
  documentId: string;
  threadCount: number;
  linkedUser?: string | null;
} | null> {
  if (!enabled()) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const url =
      `${STRAPI_BASE}/api/copilot-sessions` +
      `?filters[sessionId][$eq]=${encodeURIComponent(sid)}` +
      `&pagination[pageSize]=1`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      signal: ctrl.signal,
    });
    if (!r.ok) return null;
    const j = (await r.json().catch(() => null)) as {
      data?: Array<
        { documentId?: string; id?: number } & Record<string, unknown>
      >;
    } | null;
    const row = j?.data?.[0];
    if (!row) return null;
    const documentId =
      typeof row.documentId === 'string'
        ? row.documentId
        : String(row.id ?? '');
    if (!documentId) return null;
    return {
      documentId,
      threadCount: Number(row.threadCount ?? 1),
      linkedUser: typeof row.linkedUser === 'string' ? row.linkedUser : null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* Idempotent: looks up by sessionId; creates a row only on first
   sighting. Returns silently when token/STRAPI not configured. */
export function ensureSession(opts: EnsureSession): void {
  if (!enabled()) return;
  void (async () => {
    try {
      const existing = await findSessionRow(opts.sid);
      if (existing) return;
      await postStrapi('copilot-sessions', {
        sessionId: opts.sid,
        env: ENV_TAG,
        lang: opts.lang,
        userAgent: opts.userAgent?.slice(0, 500) || undefined,
        startedAt: new Date().toISOString(),
        firstUrl: opts.firstUrl?.slice(0, 500) || undefined,
        threadCount: 1,
      });
    } catch (e) {
      console.warn('[copilotAnalytics] ensureSession failed:', e);
    }
  })();
}

export function logTurn(opts: LogTurn): void {
  if (!enabled()) return;
  void postStrapi('copilot-turns', {
    sessionId: opts.sid,
    threadId: opts.threadId,
    env: ENV_TAG,
    ts: opts.ts ?? new Date().toISOString(),
    kind: opts.kind,
    query: opts.query,
    answer: opts.answer,
    cardsShown: opts.cardsShown,
    cardClicked: opts.cardClicked,
    pageUrl: opts.pageUrl?.slice(0, 500),
    pageTitle: opts.pageTitle?.slice(0, 300),
    mode: opts.mode,
    meta: opts.meta,
  });
}

/* Called when we detect a NextAuth session on a sid that previously
   had no linked user. Fires a kind=auth turn AND updates the session
   row's linkedUser/linkedAt so the admin filter on "signed up
   mid-session" is one click. */
export function markAuthLink(opts: {
  sid: string;
  threadId: string;
  user: string;
  pageUrl?: string;
  pageTitle?: string;
}): void {
  if (!enabled()) return;
  void (async () => {
    try {
      const row = await findSessionRow(opts.sid);
      if (!row) return;
      if (row.linkedUser === opts.user) return;
      await patchStrapi('copilot-sessions', row.documentId, {
        linkedUser: opts.user,
        linkedAt: new Date().toISOString(),
      });
      logTurn({
        sid: opts.sid,
        threadId: opts.threadId,
        kind: 'auth',
        pageUrl: opts.pageUrl,
        pageTitle: opts.pageTitle,
        meta: { user: opts.user },
      });
    } catch (e) {
      console.warn('[copilotAnalytics] markAuthLink failed:', e);
    }
  })();
}

/* Called on widget CLEAR. Bumps threadCount on the session row so
   the admin can see how many times this visitor cleared the chat. */
export function bumpThread(opts: { sid: string; oldThreadId: string }): void {
  if (!enabled()) return;
  void (async () => {
    try {
      const row = await findSessionRow(opts.sid);
      if (!row) return;
      await patchStrapi('copilot-sessions', row.documentId, {
        threadCount: row.threadCount + 1,
      });
      logTurn({
        sid: opts.sid,
        threadId: opts.oldThreadId,
        kind: 'clear',
      });
    } catch (e) {
      console.warn('[copilotAnalytics] bumpThread failed:', e);
    }
  })();
}

export function copilotAnalyticsEnabled(): boolean {
  return enabled();
}
