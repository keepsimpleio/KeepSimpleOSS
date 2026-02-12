import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Header from '@components/Header';
import Hero from '@components/longevity/Hero';
import Navigation from '@components/longevity/Navigation';
import MobileNavigation from '@components/longevity/MobileNavigation';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import styles from './Layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isLongevityProtocolPage, setIsLongevityProtocolPage] = useState(false);
  const isMobile = useIsWidthLessThan(956);

  useEffect(() => {
    if (router.pathname.startsWith('/tools/longevity-protocol')) {
      setIsLongevityProtocolPage(true);
    } else {
      setIsLongevityProtocolPage(false);
    }
  }, [router.pathname]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoLayerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isLongevityProtocolPage) return;

    const layer = videoLayerRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!layer || !canvas || !video) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    // @ts-ignore
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = 'high';

    let raf = 0;
    let stopped = false;
    let visible = true;

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const getSizes = () => {
      const h = Math.max(1, Math.ceil(layer.getBoundingClientRect().height));
      const w = Math.max(1, Math.ceil(canvas.getBoundingClientRect().width));
      return { w, h };
    };

    const resize = () => {
      const { w, h } = getSizes();

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (stopped) return;

      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const { w, h } = getSizes();

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      if (!vw || !vh || video.paused || video.ended) {
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

    const ro = new ResizeObserver(() => resize());
    ro.observe(layer);

    const io = new IntersectionObserver(
      entries => {
        visible = entries.some(e => e.isIntersecting);
      },
      { threshold: 0.01 },
    );
    io.observe(layer);

    const onMeta = () => {
      resize();
      video.play().catch(() => {});
    };
    video.addEventListener('loadedmetadata', onMeta);

    const onVis = () => {
      if (document.visibilityState === 'visible') {
        resize();
        video.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const onRouteDone = () => requestAnimationFrame(resize);
    router.events.on('routeChangeComplete', onRouteDone);

    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      video.removeEventListener('loadedmetadata', onMeta);
      document.removeEventListener('visibilitychange', onVis);
      router.events.off('routeChangeComplete', onRouteDone);
    };
  }, [isLongevityProtocolPage, router.events]);

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
              className={`${styles.videoLayer} ${
                isLongevityProtocolPage
                  ? styles.videoLayerOn
                  : styles.videoLayerOff
              }`}
              aria-hidden
            >
              <canvas ref={canvasRef} className={styles.canvas} />
              <video
                ref={videoRef}
                src="/keepsimple_/assets/longevity/dna-1.mp4"
                muted
                playsInline
                loop
                autoPlay
                preload="auto"
                className={styles.hiddenVideo}
              />
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
