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
  session: SessionRow | null;
  events: EventRow[];
  sid: string;
  debug?: string | null;
  libKeys?: string;
  libRev?: string;
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
  const { session, events, debug } = result;
  const libKeys = Object.keys(result).join(',');
  return {
    props: {
      session,
      events,
      sid,
      debug: debug ?? null,
      libKeys,
      libRev: READ_LIB_REVISION,
    },
  };
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
      const ms = payloadGet<number>(p, 'dwellMs') ?? 0;
      const sealed = payloadGet<boolean>(p, 'sealed');
      const pageUrl = payloadGet<string>(p, 'pageUrl');
      return (
        <div className={styles.eventBody}>
          spent <strong>{(ms / 1000).toFixed(1)}s</strong> on{' '}
          {String(payloadGet(p, 'pageTitle') ?? pageUrl ?? '—')}
          {sealed && <> · sealed (tab close)</>}
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
    case 'session_start':
      return null;
    default:
      return (
        <div className={styles.eventBody}>
          <div className={styles.payload}>{JSON.stringify(p)}</div>
        </div>
      );
  }
}

export default function CopilotSessionDetail({
  session,
  events,
  sid,
  debug,
  libKeys,
  libRev,
}: Props) {
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
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              DBG-v4 — Session not found (id <code>{sid}</code>)
            </div>
            <pre
              style={{
                marginTop: 16,
                textAlign: 'left',
                fontSize: 11,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                color: '#222',
                background: '#fff7f0',
                border: '1px solid #d8a368',
                padding: 10,
                borderRadius: 6,
              }}
            >
              libRev = {libRev ?? '(undefined — STALE LIB MODULE)'}
              {'\n'}libKeys = {libKeys ?? '(undefined)'}
              {'\n'}debug ={' '}
              {debug ?? '(undefined — old lib without debug field)'}
            </pre>
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
                {events.map(e => (
                  <div
                    key={e.id}
                    className={`${styles.event} ${styles[e.kind] ?? ''}`}
                  >
                    <div className={styles.eventHead}>
                      <span className={styles.mono}>{fmtTs(e.ts)}</span>{' '}
                      <span className={styles.kind}>{e.kind}</span>
                      {e.page_title && <span>· {e.page_title}</span>}
                    </div>
                    {renderEventBody(e)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
