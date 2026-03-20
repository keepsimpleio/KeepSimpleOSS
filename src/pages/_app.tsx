import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';

import useGlobals from '@hooks/useGlobals';
import useMobile from '@hooks/useMobile';
import { useIsWidthLessThan } from '@hooks/useScreenSize';
import useSpinner from '@hooks/useSpinner';

import { authenticate } from '@api/auth';
import { getMyInfo } from '@api/strapi';

import { GlobalContext } from '@components/Context/GlobalContext';

import Layout from '@layouts/Layout';

import Box from 'src/components/Box';

import mixpanel, { initMixpanel, trackPageView } from '../../lib/mixpanel';

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
  const [heroReady, setHeroReady] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [longevityTransition, setLongevityTransition] = useState(false);
  const [videosReady, setVideosReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const isIndexingOn = process.env.NEXT_PUBLIC_INDEXING === 'on';
  const isProduction = process.env.NEXT_PUBLIC_ENV === 'prod';
  const longevityBaseUrl = '/tools/longevity-protocol';
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
    html.classList.remove('scroll-style-longevity');

    if (
      router.pathname === '/' ||
      router.pathname === '/articles' ||
      router.asPath.startsWith('/articles/')
    ) {
      html.classList.add('scroll-style-articles');
    }

    if (router.asPath.startsWith('/tools/')) {
      html.classList.add('scroll-style-longevity');
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
  }, [router.pathname, isDarkTheme, router.asPath]);

  useEffect(() => {
    const isLongevityProtocolPage = router.asPath.startsWith(
      '/tools/longevity-protocol',
    );
    if (isLongevityProtocolPage) {
      document.body.classList.add('keepsimplePages');
      document.body.classList.remove('darkTheme');
      document.body.classList.remove('keepsimplePagesDark');
    }
  }, [isDarkTheme, router]);

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

  const isLongevityUrl = (url: string) => {
    const normalizedUrl = url.split('?')[0].split('#')[0].replace(/\/+$/, '');
    return normalizedUrl.startsWith(longevityBaseUrl);
  };

  useEffect(() => {
    const onStart = (url: string) => {
      const fromLongevity = isLongevityUrl(router.asPath);
      const toLongevity = isLongevityUrl(url);

      const shouldGate = fromLongevity && toLongevity;

      setLongevityTransition(shouldGate);

      if (shouldGate) {
        setHeroReady(false);
        setRouteLoading(true);
      }
    };

    const onDone = () => {
      setRouteLoading(false);
      setLongevityTransition(false);
    };

    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onDone);
    router.events.on('routeChangeError', onDone);

    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onDone);
      router.events.off('routeChangeError', onDone);
    };
  }, [router.events, router.asPath]);

  useLayoutEffect(() => {
    const initialIsLongevity = isLongevityUrl(router.asPath);
    if (!initialIsLongevity) return;

    setHeroReady(false);
    setRouteLoading(true);

    const id = requestAnimationFrame(() => setRouteLoading(false));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLongevityNow = isLongevityUrl(router.asPath);
  //TODO: Fix heroReady logic
  const overlayOn = isLongevityNow && (routeLoading || !videosReady);

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
          heroReady,
          routeLoading,
          longevityTransition,
          setHeroReady,
          setVideosReady,
          videosReady,
          overlayOn,
          audioRef,
          isAudioPlaying,
          setIsAudioPlaying,
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
        <audio
          ref={audioRef}
          src="/keepsimple_/audio/eat_mushrooms.mp3"
          preload="none"
          loop
        />
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
