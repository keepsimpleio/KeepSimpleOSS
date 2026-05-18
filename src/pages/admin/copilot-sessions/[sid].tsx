/* DEV-only admin: full transcript + nav journey for one Copilot session.
   Same env-gate as the list page. */

import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import {
  type EventRow,
  getSessionDetail,
  READ_LIB_REVISION,
  type SessionRow,
} from '@lib/copilotEventsRead';

import styles from './index.module.scss';

type Props = {
  sid: string;
  payload: string;
};

function isDevHost(): boolean {
  const v = (process.env.NEXT_PUBLIC_ENV || '').toLowerCase();
  return v === 'dev' || v === 'local';
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  if (!isDevHost()) return { notFound: true };
  const sidRaw = ctx.params?.sid;
  const sid = typeof sidRaw === 'string' ? sidRaw : '';
  if (!sid) return { notFound: true };
  const result = await getSessionDetail(sid);
  /* Bypass Next.js prop serialization entirely. We pass one string
     prop and parse it on the page. This sidesteps the issue where
     Next.js was silently dropping the session + events object props
     for reasons we couldn't pin down. */
  const payload = JSON.stringify({
    session: result.session ?? null,
    events: result.events ?? [],
    debug: result.debug ?? null,
    libRev: READ_LIB_REVISION,
  });
  return { props: { sid, payload } };
};

function fmtTs(s: string): string {
  try {
    const d = new Date(s);
    return d.toISOString().replace('T', ' ').slice(11, 19);
  } catch {
    return s;
  }
}

function fmtDate(s: string): string {
  try {
    const d = new Date(s);
    return d.toISOString().replace('T', ' ').slice(0, 19);
  } catch {
    return s;
  }
}

function fmtGap(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

function payloadGet<T = unknown>(
  p: Record<string, unknown> | null,
  key: string,
): T | undefined {
  if (!p) return undefined;
  return p[key] as T | undefined;
}

function renderEventBody(e: EventRow) {
  const p = e.payload || {};
  switch (e.kind) {
    case 'question':
      return (
        <div className={styles.eventBody}>
          <span className={styles.q}>Q:</span>{' '}
          {String(payloadGet(p, 'query') ?? '')}
        </div>
      );
    case 'answer': {
      const ans = String(payloadGet(p, 'answer') ?? '');
      const cards = payloadGet<unknown[]>(p, 'cardsShown');
      const mode = payloadGet<string>(p, 'mode');
      return (
        <div className={styles.eventBody}>
          <span className={styles.a}>A:</span> {ans}
          {(mode || Array.isArray(cards)) && (
            <div className={styles.payload}>
              {mode && <>mode={mode} </>}
              {Array.isArray(cards) && <>cards={cards.length}</>}
            </div>
          )}
        </div>
      );
    }
    case 'card_click': {
      const c = payloadGet<{ title?: string; url?: string; tier?: string }>(
        p,
        'cardClicked',
      );
      return (
        <div className={styles.eventBody}>
          clicked <strong>{c?.title ?? '—'}</strong>
          {c?.tier && <> · tier={c.tier}</>}
          {c?.url && (
            <div className={styles.payload}>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.url}
              </a>
            </div>
          )}
        </div>
      );
    }
    case 'outbound_click': {
      const href = payloadGet<string>(p, 'href');
      const anchorText = payloadGet<string>(p, 'anchorText');
      return (
        <div className={styles.eventBody}>
          left to <strong>{anchorText || '—'}</strong>
          {href && (
            <div className={styles.payload}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {href}
              </a>
            </div>
          )}
        </div>
      );
    }
    case 'page_view':
      return (
        <div className={styles.eventBody}>
          entered <strong>{e.page_title || e.page_url || '—'}</strong>
        </div>
      );
    case 'dwell': {
      /* activeMs is the new visible-only counter. dwellMs is the
         legacy wall-clock value still present in older rows. */
      const ms =
        payloadGet<number>(p, 'activeMs') ??
        payloadGet<number>(p, 'dwellMs') ??
        0;
      const pageUrl = payloadGet<string>(p, 'pageUrl');
      return (
        <div className={styles.eventBody}>
          read <strong>{(ms / 1000).toFixed(1)}s</strong> on{' '}
          {String(payloadGet(p, 'pageTitle') ?? pageUrl ?? '—')}
        </div>
      );
    }
    case 'tab_close': {
      const ms = payloadGet<number>(p, 'activeMs') ?? 0;
      const pageUrl = payloadGet<string>(p, 'pageUrl');
      return (
        <div className={styles.eventBody}>
          closed tab after <strong>{(ms / 1000).toFixed(1)}s</strong> on{' '}
          {String(payloadGet(p, 'pageTitle') ?? pageUrl ?? '—')}
        </div>
      );
    }
    case 'auth':
      return (
        <div className={styles.eventBody}>
          signed in as <strong>{String(payloadGet(p, 'user') ?? '')}</strong>
        </div>
      );
    case 'clear':
      return (
        <div className={styles.eventBody}>cleared chat (thread rotate)</div>
      );
    case 'nav':
      return (
        <div className={styles.eventBody}>
          widget nav chip → {e.page_title || e.page_url || '—'}
        </div>
      );
    default:
      return (
        <div className={styles.eventBody}>
          <div className={styles.payload}>{JSON.stringify(p)}</div>
        </div>
      );
  }
}

export default function CopilotSessionDetail({ sid, payload }: Props) {
  let parsed: {
    session: SessionRow | null;
    events: EventRow[];
    debug: string | null;
    libRev: string;
  };
  try {
    parsed = JSON.parse(payload);
  } catch {
    parsed = { session: null, events: [], debug: 'parse-error', libRev: '?' };
  }
  const { session, events: rawEvents } = parsed;
  const events = rawEvents.filter(e => e.kind !== 'session_start');

  /* A "return-after-close" gap is any pair where the visitor closed
     the tab and came back later in the same session. We surface the
     wall-clock distance between the tab_close and the next non-close
     event as a banner row. Threshold avoids flagging refresh-loops. */
  const GAP_THRESHOLD_MS = 60_000;
  type GapRow = {
    kind: 'gap';
    id: string;
    afterId: number;
    deltaMs: number;
  };
  const gaps: GapRow[] = [];
  for (let i = 0; i < events.length - 1; i += 1) {
    const a = events[i];
    const b = events[i + 1];
    if (a.kind !== 'tab_close') continue;
    const delta = new Date(b.ts).getTime() - new Date(a.ts).getTime();
    if (Number.isFinite(delta) && delta >= GAP_THRESHOLD_MS) {
      gaps.push({
        kind: 'gap',
        id: `gap-${a.id}`,
        afterId: a.id,
        deltaMs: delta,
      });
    }
  }
  const gapByAfter = new Map(gaps.map(g => [g.afterId, g] as const));

  return (
    <>
      <Head>
        <title>Copilot session — {sid.slice(0, 8)}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.wrap}>
        <p className={styles.sub}>
          <Link href="/admin/copilot-sessions">← all sessions</Link>
        </p>
        <h1 className={styles.title}>
          Session <span className={styles.mono}>{sid.slice(0, 8)}</span>
        </h1>

        {!session ? (
          <div className={styles.empty}>
            Session not found (id <code>{sid}</code>).
          </div>
        ) : (
          <>
            <dl className={styles.meta}>
              <div>
                <dt>Started</dt>
                <dd>{fmtDate(session.started_at)}</dd>
              </div>
              <div>
                <dt>Last seen</dt>
                <dd>{fmtDate(session.last_seen_at)}</dd>
              </div>
              <div>
                <dt>Env</dt>
                <dd>{session.env}</dd>
              </div>
              <div>
                <dt>Lang</dt>
                <dd>{session.lang ?? '—'}</dd>
              </div>
              <div>
                <dt>Events</dt>
                <dd>{session.event_count}</dd>
              </div>
              <div>
                <dt>Threads</dt>
                <dd>{session.thread_count}</dd>
              </div>
              <div>
                <dt>Linked user</dt>
                <dd>{session.linked_user ?? '— (anon)'}</dd>
              </div>
              <div>
                <dt>First URL</dt>
                <dd>{session.first_url ?? '—'}</dd>
              </div>
            </dl>

            {events.length === 0 ? (
              <div className={styles.empty}>No events yet.</div>
            ) : (
              <div className={styles.events}>
                {events.map(e => {
                  const gap = gapByAfter.get(e.id);
                  return (
                    <div key={e.id}>
                      <div
                        className={`${styles.event} ${styles[e.kind] ?? ''}`}
                      >
                        <div className={styles.eventHead}>
                          <span className={styles.mono}>{fmtTs(e.ts)}</span>{' '}
                          <span className={styles.kind}>{e.kind}</span>
                          {e.page_title && <span>· {e.page_title}</span>}
                        </div>
                        {renderEventBody(e)}
                      </div>
                      {gap && (
                        <div className={styles.gap}>
                          ↺ returned <strong>{fmtGap(gap.deltaMs)}</strong>{' '}
                          later
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
