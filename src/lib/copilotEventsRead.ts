/* Read-side client for the copilot-events service. Used only by the
   DEV admin pages under /admin/copilot-sessions. Never imported by
   the visitor-facing widget code. Uses the READ token (separate from
   the writer's WRITE token) and runs only in `getServerSideProps`. */

const BASE = (process.env.COPILOT_EVENTS_URL || '').replace(/\/+$/, '');
const READ_TOKEN = process.env.COPILOT_EVENTS_READ_TOKEN || '';
const TIMEOUT_MS = 6000;

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
    return Array.isArray(j?.sessions) ? j!.sessions : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function getSessionDetail(sid: string): Promise<{
  session: SessionRow | null;
  events: EventRow[];
}> {
  if (!copilotEventsReadEnabled()) return { session: null, events: [] };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(
      `${BASE}/sessions/${encodeURIComponent(sid)}/events`,
      {
        headers: { Authorization: `Bearer ${READ_TOKEN}` },
        signal: ctrl.signal,
      },
    );
    if (!r.ok) return { session: null, events: [] };
    const j = (await r.json().catch(() => null)) as {
      session?: SessionRow;
      events?: EventRow[];
    } | null;
    return {
      session: j?.session ?? null,
      events: Array.isArray(j?.events) ? j!.events : [],
    };
  } catch {
    return { session: null, events: [] };
  } finally {
    clearTimeout(timer);
  }
}
