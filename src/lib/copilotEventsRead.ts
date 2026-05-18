/* Read-side client for the copilot-events service. Used only by the
   DEV admin pages under /admin/copilot-sessions. Never imported by
   the visitor-facing widget code. Uses the READ token (separate from
   the writer's WRITE token) and runs only in `getServerSideProps`. */

const BASE = (process.env.COPILOT_EVENTS_URL || '').replace(/\/+$/, '');
const READ_TOKEN = process.env.COPILOT_EVENTS_READ_TOKEN || '';
const TIMEOUT_MS = 6000;

/* Bump this when the lib changes to force the Next.js dev cache to
   re-resolve. Exported so the admin page can render it as a sanity
   check that the module it imports really is the latest. */
export const READ_LIB_REVISION = 'v4';

export type SessionRow = {
  session_id: string;
  env: string;
  lang: string | null;
  user_agent: string | null;
  first_url: string | null;
  started_at: string;
  last_seen_at: string;
  linked_user: string | null;
  linked_at: string | null;
  thread_count: number;
  event_count: number;
};

export type EventRow = {
  id: number;
  session_id: string;
  thread_id: string;
  env: string;
  kind: string;
  ts: string;
  page_url: string | null;
  page_title: string | null;
  payload: Record<string, unknown> | null;
};

export function copilotEventsReadEnabled(): boolean {
  return Boolean(BASE && READ_TOKEN);
}

export async function listSessions(
  env: string,
  limit = 100,
): Promise<SessionRow[]> {
  if (!copilotEventsReadEnabled()) return [];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(
      `${BASE}/sessions?env=${encodeURIComponent(env)}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${READ_TOKEN}` },
        signal: ctrl.signal,
      },
    );
    if (!r.ok) return [];
    const j = (await r.json().catch(() => null)) as {
      sessions?: SessionRow[];
    } | null;
    return Array.isArray(j?.sessions) ? j!.sessions! : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function getSessionDetail(sid: string): Promise<{
  session: SessionRow | null;
  events: EventRow[];
  debug?: string;
}> {
  if (!copilotEventsReadEnabled()) {
    return {
      session: null,
      events: [],
      debug: 'env not configured (BASE or READ_TOKEN missing)',
    };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const reqUrl = `${BASE}/sessions/${encodeURIComponent(sid)}/events`;
  try {
    const r = await fetch(reqUrl, {
      headers: { Authorization: `Bearer ${READ_TOKEN}` },
      signal: ctrl.signal,
    });
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      return {
        session: null,
        events: [],
        debug: `GET ${reqUrl} → ${r.status} ${r.statusText} body=${body.slice(0, 200)}`,
      };
    }
    const raw = await r.text();
    let j: { session?: SessionRow; events?: EventRow[] } | null = null;
    try {
      j = JSON.parse(raw);
    } catch {
      return {
        session: null,
        events: [],
        debug: `GET ${reqUrl} → 200 but non-JSON body=${raw.slice(0, 200)}`,
      };
    }
    const session = j?.session ?? null;
    const events = Array.isArray(j?.events) ? j!.events! : [];
    return {
      session,
      events,
      debug: session
        ? undefined
        : `GET ${reqUrl} → 200 but session=null; events=${events.length}; raw=${raw.slice(0, 200)}`,
    };
  } catch (e) {
    return {
      session: null,
      events: [],
      debug: `GET ${reqUrl} threw: ${String(e).slice(0, 200)}`,
    };
  } finally {
    clearTimeout(timer);
  }
}
