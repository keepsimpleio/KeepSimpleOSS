import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import { SessionProvider } from 'next-auth/react';

import useSpinner from '@hooks/useSpinner';
import useMobile from '@hooks/useMobile';
import useGlobals from '@hooks/useGlobals';
import { useIsWidthLessThan } from '@hooks/useScreenSize';

import Layout from '@layouts/Layout';

import { GlobalContext } from '@components/Context/GlobalContext';
import Box from 'src/components/Box';

import { authenticate } from '@api/auth';
import mixpanel, { initMixpanel, trackPageView } from '../../lib/mixpanel';
import { getMyInfo } from '@api/strapi';

import '../styles/globals.scss';

type TApp = {
  Component: any;
  pageProps: any;
};

function App({ Component, pageProps: { session, ...pageProps } }: TApp) {
  const [cookieBoxIsSeen, setCookieBoxIsSeen] = useState(false);
  const [isCookieStateLoaded, setIsCookieStateLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const loadingTimer = useRef(null);
  const [accountData, setAccountData] = useState(null);
  const [token, setToken] = useState(null);

  const isIndexingOn = process.env.NEXT_PUBLIC_INDEXING === 'on';
  const isProduction = process.env.NEXT_PUBLIC_ENV === 'prod';
  const { initUseMobile } = useMobile()[0];
  const { events } = useRouter();
  const { setIsVisible } = useSpinner()[0];
  const isSmallScreen = useIsWidthLessThan(768);
  const { isDarkTheme } = useGlobals()[1];

  useEffect(() => {
    const authenticateUser = async () => {
      if (session?.user && session.accessToken) {
        try {
          await authenticate(token, setAccountData, setToken);
        } catch (error) {
          console.error('Authentication failed:', error);
        }
      }
    };

    authenticateUser();
  }, [session]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getMyInfo();
        if (data) {
          setAccountData(data);
        } else {
          console.warn('Data is null, skipping update.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  const COOKIE_NAME = 'cookieBoxIsSeen';
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

  const getCookie = (name: string) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];
  };

  function getBaseDomain(hostname: string) {
    const parts = hostname.split('.');
    if (parts.length <= 2) return hostname;
    return `.${parts.slice(-2).join('.')}`;
  }

  const handleAccept = () => {
    setCookieBoxIsSeen(true);

    const hostname = window.location.hostname;
    const shouldShareAcrossSubdomains = true;
    const cookieDomain = shouldShareAcrossSubdomains
      ? getBaseDomain(hostname)
      : null;
    let cookieString = `${COOKIE_NAME}=true; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    if (cookieDomain) cookieString += `; Domain=${cookieDomain}`;
    if (window.location.protocol === 'https:') cookieString += '; Secure';

    document.cookie = cookieString;
  };

  useEffect(() => {
    const isSeen = getCookie(COOKIE_NAME);
    if (isSeen === 'true') setCookieBoxIsSeen(true);
    setIsCookieStateLoaded(true);
  }, []);

  useEffect(() => {
    events.on('routeChangeStart', () => {
      clearTimeout(loadingTimer.current);
      loadingTimer.current = setTimeout(() => {
        setIsVisible(true);
      }, 500);
    });

    events.on('routeChangeComplete', url => {
      if (isIndexingOn && isProduction) {
        ReactGA.set({ page: url });
        ReactGA.send(url);
      }

      clearTimeout(loadingTimer.current);
      setIsVisible(false);
    });

    events.on('routeChangeError', () => {
      clearTimeout(loadingTimer.current);
      setIsVisible(false);
    });
  }, []);

  useEffect(() => {
    initUseMobile();

    if (isIndexingOn && isProduction) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
      setTimeout(() => {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.send(window.location.pathname);
      }, 0);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    html.classList.remove('scroll-style-articles');

    if (
      router.pathname === '/' ||
      router.pathname === '/articles' ||
      router.asPath.startsWith('/articles/')
    ) {
      html.classList.add('scroll-style-articles');
    }
  }, [router.pathname, router.asPath]);

  useEffect(() => {
    const isPage =
      router.pathname === '/' ||
      router.pathname === '/articles' ||
      router.pathname === '/contributors';
    document.body.classList.toggle('keepsimplePages', isPage && !isDarkTheme);
    document.body.classList.toggle(
      'keepsimplePagesDark',
      isPage && isDarkTheme,
    );
  }, [router.pathname, isDarkTheme]);

  useEffect(() => {
    initMixpanel();
    trackPageView(window.location.pathname);

    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  useEffect(() => {
    if (!accountData?.id || !accountData?.createdAt) return;

    mixpanel.identify(accountData.id);

    const isNewUser = new Date(accountData.createdAt) >= new Date('2025-06-01');

    if (isNewUser) {
      mixpanel.track('New User', {
        id: accountData.id,
        username: accountData.username,
        createdAt: accountData.createdAt,
      });

      mixpanel.people.set({
        $name: accountData.username,
        $created: accountData.createdAt,
        id: accountData.id,
      });
    }
  }, [accountData?.id, accountData?.createdAt]);

  return (
    <SessionProvider session={session}>
      <GlobalContext.Provider
        value={{
          accountData,
          setAccountData,
          showLoader,
          setShowLoader,
          videoRef,
          setToken,
        }}
      >
        {showLoader && !isSmallScreen && (
          <div className="videoWrapper">
            <div className={'mask'}>
              <video
                ref={videoRef}
                src="/keepsimple_/assets/test/ks-test.mp4"
                muted
                playsInline
                preload="auto"
                className="loadingVideo"
              />
            </div>
          </div>
        )}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {isCookieStateLoaded && !cookieBoxIsSeen && (
          <Box setIsSeen={handleAccept} />
        )}
      </GlobalContext.Provider>
    </SessionProvider>
  );
}

export default App;
