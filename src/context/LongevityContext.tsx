import { useRouter } from 'next/router';
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const LONGEVITY_BASE_URL = '/tools/longevity-protocol';

type LongevityContextValue = {
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  isAudioPlaying: boolean;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  videosReady: boolean;
  setVideosReady: React.Dispatch<React.SetStateAction<boolean>>;
  heroReady: boolean;
  setHeroReady: React.Dispatch<React.SetStateAction<boolean>>;
  routeLoading: boolean;
  longevityTransition: boolean;
  overlayOn: boolean;
  isLongevityUrl: (url: string) => boolean;
};

const LongevityContext = createContext<LongevityContextValue | null>(null);

export function LongevityProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [videosReady, setVideosReady] = useState(false);
  const [heroReady, setHeroReady] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [longevityTransition, setLongevityTransition] = useState(false);

  const isLongevityUrl = (url: string) => {
    const normalizedUrl = url.split('?')[0].split('#')[0].replace(/\/+$/, '');
    return normalizedUrl.startsWith(LONGEVITY_BASE_URL);
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

      if (fromLongevity && !toLongevity && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsAudioPlaying(false);
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
    <LongevityContext.Provider
      value={{
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
        isLongevityUrl,
      }}
    >
      {children}
    </LongevityContext.Provider>
  );
}

export function useLongevity(): LongevityContextValue {
  const context = useContext(LongevityContext);
  if (!context) {
    throw new Error('useLongevity must be used within a LongevityProvider');
  }
  return context;
}
