import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import { confirmTwitterEmailChange } from '@api/auth';
import { getMyInfo } from '@api/strapi';

import auth from '@data/auth';

import { GlobalContext } from '@components/Context/GlobalContext';
import Spinner from '@components/Spinner';

import styles from './magic-link.module.scss';

type ConfirmState =
  | { kind: 'loading' }
  | { kind: 'success'; email: string }
  | { kind: 'invalidToken' }
  | { kind: 'notAllowed' }
  | { kind: 'emailAlreadyRegistered' }
  | { kind: 'blocked' };

const EmailChangeConfirmPage: FC = () => {
  const router = useRouter();
  const { setAccountData } = useContext(GlobalContext) as any;

  const locale = router.locale === 'ru' ? 'ru' : 'en';
  const copy = auth[locale].emailChange.confirmPage;

  const [state, setState] = useState<ConfirmState>({ kind: 'loading' });
  const startedRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (startedRef.current) return;
    startedRef.current = true;

    const token = router.query.token;
    const tokenStr = Array.isArray(token) ? token[0] : token;

    if (!tokenStr) {
      router.replace('/');
      return;
    }

    // Strip ?token= from the URL before any async work fires. Tokens are
    // single-use + 15-min TTL, but the URL would otherwise leak into the
    // Referer header of any third-party script.
    router.replace({ pathname: router.pathname, query: {} }, undefined, {
      shallow: true,
    });

    const run = async () => {
      const result = await confirmTwitterEmailChange(tokenStr);

      if ('code' in result) {
        if (
          result.code === 'INVALID_TOKEN' ||
          result.code === 'TOKEN_EXPIRED' ||
          result.code === 'TOKEN_ALREADY_USED'
        ) {
          setState({ kind: 'invalidToken' });
          return;
        }
        if (result.code === 'EMAIL_CHANGE_NOT_ALLOWED') {
          setState({ kind: 'notAllowed' });
          return;
        }
        if (
          result.code === 'EMAIL_ALREADY_REGISTERED' ||
          result.status === 409
        ) {
          setState({ kind: 'emailAlreadyRegistered' });
          return;
        }
        if (result.code === 'USER_BLOCKED') {
          setState({ kind: 'blocked' });
          return;
        }
        setState({ kind: 'invalidToken' });
        return;
      }

      // Same-device click: existing JWT is still valid, refresh /users/me so
      // the cached account picks up the new email. On a different device the
      // user isn't logged in here and getMyInfo just no-ops.
      if (
        typeof window !== 'undefined' &&
        localStorage.getItem('accessToken')
      ) {
        try {
          const data = await getMyInfo();
          if (data) setAccountData(data);
        } catch {
          // Non-fatal — the success message still applies; the user will pick
          // up the new email on next refresh.
        }
      }

      setState({ kind: 'success', email: result.data.email });
    };

    run();
  }, [router, router.isReady, router.query.token, setAccountData]);

  if (state.kind === 'loading') {
    return <Spinner visible />;
  }

  const view = (() => {
    if (state.kind === 'success') {
      return {
        cy: 'email-change-success',
        role: 'status' as const,
        title: copy.success.title,
        body: copy.success.body,
        cta: copy.success.cta,
      };
    }
    if (state.kind === 'notAllowed') {
      return {
        cy: 'email-change-not-allowed',
        role: 'alert' as const,
        title: copy.notAllowed.title,
        body: copy.notAllowed.body,
        cta: copy.notAllowed.cta,
      };
    }
    if (state.kind === 'emailAlreadyRegistered') {
      return {
        cy: 'email-change-email-taken',
        role: 'alert' as const,
        title: copy.emailAlreadyRegistered.title,
        body: copy.emailAlreadyRegistered.body,
        cta: copy.emailAlreadyRegistered.cta,
      };
    }
    if (state.kind === 'blocked') {
      return {
        cy: 'email-change-blocked',
        role: 'alert' as const,
        title: copy.blocked.title,
        body: copy.blocked.body,
        cta: copy.blocked.cta,
      };
    }
    return {
      cy: 'email-change-invalid',
      role: 'alert' as const,
      title: copy.invalidToken.title,
      body: copy.invalidToken.body,
      cta: copy.invalidToken.cta,
    };
  })();

  return (
    <div className={styles.page}>
      <div className={styles.errorCard} data-cy={view.cy} role={view.role}>
        <h1 className={styles.title}>{view.title}</h1>
        {view.body && <p className={styles.body}>{view.body}</p>}
        <button
          type="button"
          className={styles.cta}
          onClick={() => router.push('/')}
          data-cy="email-change-home"
        >
          {view.cta}
        </button>
      </div>
    </div>
  );
};

export default EmailChangeConfirmPage;
