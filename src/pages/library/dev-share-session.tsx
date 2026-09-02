import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import { getAccessToken } from '@lib/library/cookie';
import { donateDevSession, isDevSessionHost } from '@lib/library/devSession';

import styles from './dev-share-session.module.scss';

/**
 * DEV-only: the owner opens this once while logged in, and their session
 * becomes the one every reviewer behind the Access gate lands in. Background
 * and rationale live in `@lib/library/devSession`.
 */

type ShareState =
  | { kind: 'working' }
  | { kind: 'shared' }
  | { kind: 'noSession' }
  | { kind: 'failed'; message?: string };

const DevShareSessionPage: NextPage = () => {
  const [state, setState] = useState<ShareState>({ kind: 'working' });

  useEffect(() => {
    const jwt = getAccessToken();

    if (!jwt) {
      setState({ kind: 'noSession' });
      return;
    }

    void donateDevSession(jwt).then(result => {
      setState(
        result.ok
          ? { kind: 'shared' }
          : { kind: 'failed', message: result.message },
      );
    });
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Shared review session</h1>

        {state.kind === 'working' && (
          <p className={styles.body}>Sharing this session…</p>
        )}

        {state.kind === 'shared' && (
          <p className={styles.body}>
            Done. Anyone opening the library on this preview host now arrives
            logged in as you, until you revoke it or log out.
          </p>
        )}

        {state.kind === 'noSession' && (
          <p className={styles.body}>
            This browser is not logged in, so there is nothing to share. Sign in
            first, then open this page again.
          </p>
        )}

        {state.kind === 'failed' && (
          <p className={styles.body}>
            Sharing failed{state.message ? `: ${state.message}` : '.'}
          </p>
        )}
      </div>
    </main>
  );
};

export default DevShareSessionPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const host = (req.headers.host ?? '').split(':')[0];

  if (!isDevSessionHost(host)) {
    return { notFound: true };
  }

  return { props: {} };
};
