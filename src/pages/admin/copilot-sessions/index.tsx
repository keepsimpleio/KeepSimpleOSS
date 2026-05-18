/* DEV-only admin: list recent Copilot sessions. Gated by NEXT_PUBLIC_ENV
   so it 404s on staging / prod. Reads via the copilot-events READ token
   server-side; no token ever reaches the browser. */

import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  copilotEventsReadEnabled,
  listSessions,
  type SessionRow,
} from '@lib/copilotEventsRead';

import styles from './index.module.scss';

const VALID_ENVS = ['dev', 'staging', 'prod'] as const;
type EnvTab = (typeof VALID_ENVS)[number];

type Props = {
  envTab: EnvTab;
  sessions: SessionRow[];
  enabled: boolean;
};

function isDevHost(): boolean {
  const v = (process.env.NEXT_PUBLIC_ENV || '').toLowerCase();
  return v === 'dev' || v === 'local';
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  if (!isDevHost()) return { notFound: true };
  const q = ctx.query.env;
  const envTab: EnvTab =
    typeof q === 'string' && (VALID_ENVS as readonly string[]).includes(q)
      ? (q as EnvTab)
      : 'dev';
  const sessions = await listSessions(envTab, 100);
  return {
    props: {
      envTab,
      sessions,
      enabled: copilotEventsReadEnabled(),
    },
  };
};

function fmtTs(s: string): string {
  try {
    const d = new Date(s);
    return d.toISOString().replace('T', ' ').slice(0, 19);
  } catch {
    return s;
  }
}

function shortSid(sid: string): string {
  return sid.length > 8 ? `${sid.slice(0, 8)}…` : sid;
}

export default function CopilotSessionsIndex({
  envTab,
  sessions,
  enabled,
}: Props) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Copilot sessions — admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Copilot sessions</h1>
        <p className={styles.sub}>
          Visitor sessions logged by the copilot-events service. DEV preview
          only — this page is gated by environment and never ships to staging or
          prod.
        </p>

        <div className={styles.toolbar}>
          <span className={styles.envChip}>showing: {envTab}</span>
          {!enabled && (
            <span className={styles.muted}>
              read token not configured — set{' '}
              <code>COPILOT_EVENTS_READ_TOKEN</code>
            </span>
          )}
          <div className={styles.envPick}>
            {VALID_ENVS.map(e => (
              <Link
                key={e}
                href={{ pathname: router.pathname, query: { env: e } }}
                className={e === envTab ? styles.active : ''}
              >
                {e}
              </Link>
            ))}
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className={styles.empty}>
            No sessions found for env=<strong>{envTab}</strong>.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Started</th>
                <th>Sid</th>
                <th>Lang</th>
                <th>Events</th>
                <th>Threads</th>
                <th>Linked user</th>
                <th>First URL</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.session_id}>
                  <td className={styles.mono}>{fmtTs(s.started_at)}</td>
                  <td className={styles.mono}>
                    <Link
                      href={`/admin/copilot-sessions/${encodeURIComponent(
                        s.session_id,
                      )}`}
                    >
                      {shortSid(s.session_id)}
                    </Link>
                  </td>
                  <td>{s.lang ?? '—'}</td>
                  <td>{s.event_count}</td>
                  <td>{s.thread_count}</td>
                  <td>
                    {s.linked_user ? (
                      <span className={styles.mono}>{s.linked_user}</span>
                    ) : (
                      <span className={styles.muted}>anon</span>
                    )}
                  </td>
                  <td className={styles.mono}>{s.first_url ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
