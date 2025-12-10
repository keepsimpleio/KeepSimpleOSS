import { FC, useContext, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import { authenticate } from '@api/auth';

import Spinner from '@components/Spinner';
import { GlobalContext } from '@components/Context/GlobalContext';
import { deleteRedirectCookie, getRedirectCookie } from '@lib/cookies';

const Auth: FC = () => {
  const { setAccountData, setToken } = useContext(GlobalContext);
  const { data, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';

  useEffect(() => {
    if (router.query.provider) {
      authenticateAndRedirect();
    }
  }, [status, router.query.provider]);

  const isEmbeddedBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /FBAN|FBAV|Instagram|LinkedIn|Line|WhatsApp|Telegram/i.test(
      userAgent,
    );
  };

  const authenticateAndRedirect = async () => {
    if (typeof window !== 'undefined') {
      const { provider } = router.query;

      if (!provider) {
        console.error('No provider found in query');
        return;
      }

      if (isEmbeddedBrowser()) {
        if (/Android/i.test(navigator.userAgent)) {
          window.location.href = `intent://${window.location.href.replace(
            'https://',
            '',
          )}#Intent;scheme=https;package=com.android.chrome;end;`;
        } else {
          const newWindow = window.open(window.location.href, '_blank');
          if (newWindow) {
            newWindow.opener = null;
            newWindow.focus();
          } else {
            window.location.href = window.location.href;
          }
          return;
        }
      }

      if (status === 'authenticated' && !localStorage.getItem('accessToken')) {
        //@ts-ignore
        await authenticate(data.accessToken, setAccountData, setToken);
        const redirectUrl = getRedirectCookie() || '/uxcore';
        deleteRedirectCookie();
        window.location.href = redirectUrl;
      } else if (status === 'unauthenticated') {
        signIn(provider as string); // Use the provider from query
      }
    }
  };

  useEffect(() => {
    const provider = router.query.provider as string;

    if (provider) {
      localStorage.setItem('provider', provider);
    }
  }, [router.query.provider]);

  // Otherwise, show the spinner while authenticating
  return isLoading || status === 'authenticated' ? <Spinner /> : null;
};

export default Auth;
