import { useRouter } from 'next/router';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { GlobalContext } from '@components/Context/GlobalContext';

import Header from '@components/Header';
import Hero from '@components/longevity/Hero';
import Navigation from '@components/longevity/Navigation';
import MobileNavigation from '@components/longevity/MobileNavigation';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import styles from './Layout.module.scss';

type LayerKey = 'default' | 'red' | 'blue' | 'red-and-blue';

const SOURCES: Record<LayerKey, string> = {
  default: '/keepsimple_/assets/longevity/dna/default.mp4',
  red: '/keepsimple_/assets/longevity/dna/red.mp4',
  blue: '/keepsimple_/assets/longevity/dna/blue.mp4',
  'red-and-blue': '/keepsimple_/assets/longevity/dna/red-and-blue.mp4',
};

function pickLayer(pathname: string): LayerKey {
  const base = '/tools/longevity-protocol';
  if (!pathname.startsWith(base)) return 'default';

  const rest = pathname.slice(base.length);
  if (rest === '/about-project' || rest === '' || rest === '/')
    return 'default';
  if (rest === '/environment') return 'blue';
  if (rest === '/results') return 'red-and-blue';
  if (rest === '/habits' || rest.startsWith('/habits/')) return 'red';
  return 'default';
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setVideosReady, videosReady } = useContext(GlobalContext);

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoLayerRef = useRef<HTMLDivElement | null>(null);

  const videosRef = useRef<Partial<Record<LayerKey, HTMLVideoElement | null>>>(
    {},
  );

  const [isLongevityProtocolPage, setIsLongevityProtocolPage] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerKey>('default');

  const [transitionsOn, setTransitionsOn] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);

  const isMobile = useIsWidthLessThan(956);

  useEffect(() => {
    if (router.pathname.startsWith('/tools/longevity-protocol')) {
      setIsLongevityProtocolPage(true);
    } else {
      setIsLongevityProtocolPage(false);
    }
  }, [router.pathname]);

  useLayoutEffect(() => {
    if (!router.pathname.startsWith('/tools/longevity-protocol')) return;

    const initial = pickLayer(router.pathname);
    setTransitionsOn(false);
    setCanvasVisible(true);
    setActiveLayer(initial);

    const id = requestAnimationFrame(() => setTransitionsOn(true));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!isLongevityProtocolPage) return;

    const next = pickLayer(router.pathname);
    if (next === activeLayer) return;

    setCanvasVisible(false);

    const FADE_MS = 250;
    const t = window.setTimeout(() => {
      setActiveLayer(next);
      setCanvasVisible(true);
    }, FADE_MS);

    return () => window.clearTimeout(t);
  }, [router.pathname, isLongevityProtocolPage, activeLayer]);

  useEffect(() => {
    if (!isLongevityProtocolPage) return;

    const layer = videoLayerRef.current;
    const canvas = canvasRef.current;
    if (!layer || !canvas) return;

    const getActiveVideo = () => videosRef.current[activeLayer] ?? null;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    // @ts-ignore
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = 'high';

    let raf = 0;
    let stopped = false;
    let visible = true;

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const canvasCSS = 175;
    const getSizes = () => {
      const rect = layer.getBoundingClientRect();
      const h = Math.max(1, Math.ceil(rect.height));
      const w = canvasCSS;
      return { w, h };
    };

    let needsResize = true;
    const scheduleResize = () => {
      needsResize = true;
    };

    const applyResizeIfNeeded = () => {
      if (!needsResize) return;
      needsResize = false;

      const rect = layer.getBoundingClientRect();
      if (rect.height <= 2 || layer.offsetParent === null) {
        needsResize = true;
        return;
      }

      const w = canvasCSS;
      const h = Math.max(1, Math.ceil(rect.height));

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const bw = Math.max(1, Math.round(w * dpr));
      const bh = Math.max(1, Math.round(h * dpr));

      if (canvas.width !== bw) canvas.width = bw;
      if (canvas.height !== bh) canvas.height = bh;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (stopped) return;

      if (!visible || layer.offsetParent === null) {
        raf = requestAnimationFrame(draw);
        return;
      }

      applyResizeIfNeeded();

      const { w, h } = getSizes();
      const video = getActiveVideo();

      if (!video) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      if (!vw || !vh || video.paused) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const scale = w / vw;
      const tileH = Math.max(1, Math.round(vh * scale));

      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < h + tileH; y += tileH) {
        ctx.drawImage(video, 0, y, w, tileH);
      }

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => scheduleResize());
    ro.observe(layer);

    const io = new IntersectionObserver(
      entries => {
        visible = entries.some(e => e.isIntersecting);
      },
      { threshold: 0.01 },
    );
    io.observe(layer);

    const onVis = () => {
      if (document.visibilityState === 'visible') scheduleResize();
    };
    document.addEventListener('visibilitychange', onVis);

    scheduleResize();
    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [isLongevityProtocolPage, activeLayer]);

  useEffect(() => {
    if (!isLongevityProtocolPage) return;

    (Object.keys(SOURCES) as LayerKey[]).forEach(k => {
      const v = videosRef.current[k];
      v?.play?.().catch(() => {});
    });
  }, [isLongevityProtocolPage]);

  useEffect(() => {
    if (!isLongevityProtocolPage) return;

    let cancelled = false;
    setVideosReady(false);

    const keys = Object.keys(SOURCES) as LayerKey[];

    const readyByKey: Record<string, boolean> = {};
    keys.forEach(k => (readyByKey[k] = false));

    const checkAll = () => {
      if (cancelled) return;
      const allReady = keys.every(k => readyByKey[k]);
      if (allReady) setVideosReady(true);
    };

    const cleanupFns: Array<() => void> = [];

    keys.forEach(k => {
      const v = videosRef.current[k];
      if (!v) return;

      const markReady = () => {
        readyByKey[k] = true;
        checkAll();
      };

      if (v.readyState >= 2) {
        markReady();
        return;
      }

      const onCanPlay = () => markReady();
      const onError = () => markReady(); // don't deadlock if one fails

      v.addEventListener('canplay', onCanPlay, { once: true });
      v.addEventListener('error', onError, { once: true });

      v.load?.();
      v.play?.().catch(() => {});

      cleanupFns.push(() => {
        v.removeEventListener('canplay', onCanPlay);
        v.removeEventListener('error', onError);
      });
    });

    const t = window.setTimeout(() => {
      if (!cancelled) setVideosReady(true);
    }, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      cleanupFns.forEach(fn => fn());
    };
  }, [isLongevityProtocolPage, setVideosReady]);

  useEffect(() => {
    if (!videosReady) return;
    const base = videosRef.current['default'];
    if (!base) return;

    const t = base.currentTime || 0;
    (Object.keys(SOURCES) as LayerKey[]).forEach(k => {
      const v = videosRef.current[k];
      if (!v) return;
      try {
        if (v.duration) v.currentTime = t % v.duration;
      } catch {}
    });
  }, [videosReady]);

  return (
    <>
      <Header />
      {isLongevityProtocolPage && <Hero />}
      <main
        className={isLongevityProtocolPage ? styles.longevityMain : undefined}
      >
        {isLongevityProtocolPage ? (
          isMobile ? (
            <MobileNavigation />
          ) : (
            <Navigation />
          )
        ) : null}

        {isLongevityProtocolPage ? (
          <section ref={sectionRef} className={styles.section}>
            <div
              ref={videoLayerRef}
              className={`${styles.videoLayer} ${styles.videoLayerOn}`}
              aria-hidden
            >
              <canvas
                ref={canvasRef}
                className={[
                  styles.canvas,
                  transitionsOn
                    ? styles.canvasTransitionOn
                    : styles.canvasTransitionOff,
                  canvasVisible ? styles.canvasOn : styles.canvasOff,
                ].join(' ')}
              />
              {(Object.keys(SOURCES) as LayerKey[]).map(k => (
                <video
                  key={k}
                  ref={el => {
                    videosRef.current[k] = el;
                  }}
                  src={SOURCES[k]}
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="auto"
                  className={styles.hiddenVideo}
                />
              ))}
            </div>
            <div className={styles.content}>{children}</div>
          </section>
        ) : (
          <section>{children}</section>
        )}
      </main>
    </>
  );
}
