import { getOurProjects } from '@uxcore/api/our-projects';
import { GlobalContext as UXCoreGlobalContext } from '@uxcore/components/Context/GlobalContext';
import UXCoreLayoutShell from '@uxcore/layouts/Layout';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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
import '../styles/ai-atlas.css';
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
  const [uxcatUserInfo, setUxcatUserInfo] = useState<any>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [updatedUsername, setUpdatedUsername] = useState<string>('');
  const [ourProjectsModalData, setOurProjectsModalData] = useState<any>(null);

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

  // Cold-load dark-theme bootstrap: not every route calls initUseGlobals
  // on mount (e.g. /uxcore, /uxcg). Read the persisted flag once at the
  // app root so dark theme applies on any deep-link, and dispatch the
  // cross-realm sync event so both useGlobals stores see the value.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    document.body.classList.toggle('darkTheme', isDarkTheme);
    window.dispatchEvent(
      new CustomEvent('darktheme:change', { detail: { isDarkTheme } }),
    );
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
      '/keepsimple_/assets/longevity/habits/what-is-this-bg.png',
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

  const isUxcoreRoute =
    router.pathname.startsWith('/uxcore') ||
    router.pathname.startsWith('/uxcg') ||
    router.pathname.startsWith('/uxcat') ||
    router.pathname.startsWith('/uxcp') ||
    router.pathname.startsWith('/uxcore-api');

  useEffect(() => {
    document.body.classList.toggle('uxcorePage', isUxcoreRoute);
  }, [isUxcoreRoute]);

  useEffect(() => {
    if (!isUxcoreRoute) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getOurProjects(router.locale || 'en');
        if (!cancelled) setOurProjectsModalData(data || null);
      } catch (err) {
        console.warn('[our-projects] fetch failed:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isUxcoreRoute, router.locale]);

  const uxcoreContextValue = useMemo(
    () => ({
      accountData,
      setAccountData,
      setToken,
      uxcatUserInfo,
      setUxcatUserInfo,
      selectedTitle,
      setSelectedTitle,
      updatedUsername,
      setUpdatedUsername,
      ourProjectsModalData,
      setOurProjectsModalData,
      uxCoreData: null,
      uxcgLocalizedData: null,
      uxcgData: null,
    }),
    [
      accountData,
      uxcatUserInfo,
      selectedTitle,
      updatedUsername,
      ourProjectsModalData,
    ],
  );

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
                src={
                  isDarkTheme
                    ? '/keepsimple_/assets/leaves/leaves-dark.mp4'
                    : '/keepsimple_/assets/leaves/leaves.mp4'
                }
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
        {isUxcoreRoute ? (
          <UXCoreGlobalContext.Provider value={uxcoreContextValue}>
            <UXCoreLayoutShell>
              <Component {...pageProps} />
            </UXCoreLayoutShell>
          </UXCoreGlobalContext.Provider>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        {/* Global concierge widget — Vite-bundled IIFE, built by the
            `prebuild:widget` script and served from /ask-ux-core-dev.js.
            afterInteractive: load after hydration so the script does not
            block page-time-to-interactive (it is a chat widget, not
            critical path). */}
        <Script
          src={`/ask-ux-core-dev.js?v=${process.env.NEXT_PUBLIC_BUILD_ID ?? Date.now()}`}
          strategy="afterInteractive"
        />
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
