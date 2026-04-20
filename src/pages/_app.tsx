import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';

import useGlobals from '@hooks/useGlobals';
import useMobile from '@hooks/useMobile';
import { useIsWidthLessThan } from '@hooks/useScreenSize';
import useSpinner from '@hooks/useSpinner';

import { authenticate } from '@api/auth';
import { getMyInfo } from '@api/strapi';

import { GlobalContext } from '@components/Context/GlobalContext';

import Layout from '@layouts/Layout';

import { LongevityProvider, useLongevity } from '../context/LongevityContext';

import '../styles/globals.scss';
import '../styles/vibesuite.scss';
// import '../styles/tom.scss';

type TApp = {
  Component: any;
  pageProps: any;
};

function AppContent({ Component, pageProps: { session, ...pageProps } }: TApp) {
  const [showLoader, setShowLoader] = useState(false);
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

  const {
    videoRef,
    audioRef,
    isAudioPlaying,
    setIsAudioPlaying,
    videosReady,
    setVideosReady,
    heroReady,
    setHeroReady,
    routeLoading,
    longevityTransition,
    overlayOn,
  } = useLongevity();

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
      const hasAccessToken = !!localStorage.getItem('accessToken');
      if (!session?.user && !hasAccessToken) return;
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
  }, [session]);

  useEffect(() => {
    events.on('routeChangeStart', () => {
      clearTimeout(loadingTimer.current);
      loadingTimer.current = setTimeout(() => {
        setIsVisible(true);
      }, 500);
    });

    events.on('routeChangeComplete', url => {
      if (isIndexingOn && isProduction) {
        import('react-ga4').then(({ default: ReactGA }) => {
          ReactGA.set({ page: url });
          ReactGA.send(url);
        });
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
      import('react-ga4').then(({ default: ReactGA }) => {
        ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
        setTimeout(() => {
          ReactGA.set({ page: window.location.pathname });
          ReactGA.send(window.location.pathname);
        }, 0);
      });
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
      router.pathname === '/contributors' ||
      router.pathname === '/tools';

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
    const isLongevityProtocolPage = router.asPath.startsWith(
      '/tools/longevity-protocol',
    );
    if (!isLongevityProtocolPage) return;

    const imagesToPreload = [
      '/keepsimple_/assets/longevity/diet/hearts/sugar.png',
      '/keepsimple_/assets/longevity/diet/hearts/seed-oil.png',
      '/keepsimple_/assets/longevity/diet/hearts/sugary-drinks.png',
      '/keepsimple_/assets/longevity/diet/hearts/ultra-porcessed-food.png',
      '/keepsimple_/assets/longevity/diet/hearts/white-flour.png',
      '/keepsimple_/assets/longevity/diet/hearts/deceptive-food.png',
      '/keepsimple_/assets/longevity/diet/tooltip-line.png',
      '/keepsimple_/assets/longevity/diet/damage-icon.svg',
      '/keepsimple_/assets/longevity/diet/info-icon.svg',
      '/keepsimple_/assets/longevity/diet/examples-icon.svg',
      '/keepsimple_/assets/longevity/diet/diet-results-icons/borderline-ok-foods.png',
      '/keepsimple_/assets/longevity/diet/diet-results-icons/supportive-foods.png',
      '/keepsimple_/assets/longevity/diet/diet-results-icons/protective-foods.png',
      '/keepsimple_/assets/longevity/diet/diet-results-icons/clean-nutrients.png',
      '/keepsimple_/assets/longevity/diet/diet-results-icons/metabolic-gold.png',
      '/keepsimple_/assets/longevity/habits/tooltip-bg.png',
      '/keepsimple_/assets/longevity/habits/tooltip-headline-bg.png',
      '/keepsimple_/assets/longevity/habits/what-is-this-bg.webp',
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [router.asPath]);

  useEffect(() => {
    let handleRouteChange: (url: string) => void;

    import('../../lib/mixpanel').then(({ initMixpanel, trackPageView }) => {
      initMixpanel();
      trackPageView(window.location.pathname);

      handleRouteChange = (url: string) => {
        trackPageView(url);
      };

      router.events.on('routeChangeComplete', handleRouteChange);
    });

    return () => {
      if (handleRouteChange) {
        router.events.off('routeChangeComplete', handleRouteChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!accountData?.id || !accountData?.createdAt) return;

    import('../../lib/mixpanel').then(({ default: mixpanel }) => {
      mixpanel.identify(accountData.id);

      const isNewUser =
        new Date(accountData.createdAt) >= new Date('2025-06-01');

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
    });
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
      </GlobalContext.Provider>
    </SessionProvider>
  );
}

function App({ Component, pageProps }: TApp) {
  return (
    <LongevityProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </LongevityProvider>
  );
}

export default App;
