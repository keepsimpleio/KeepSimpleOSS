import { useRouter } from 'next/router';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import Header from '@components/Header';
import Hero from '@components/longevity/Hero';
import Navigation from '@components/longevity/Navigation';
import MobileNavigation from '@components/longevity/MobileNavigation';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import styles from './Layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const probeVideoRef = useRef<HTMLVideoElement | null>(null);
  const [targetHeight, setTargetHeight] = useState(0);
  const [renderedCount, setRenderedCount] = useState(1);
  const [isLongevityProtocolPage, setIsLongevityProtocolPage] = useState(false);
  const isMobile = useIsWidthLessThan(956);

  const recalc = useCallback(() => {
    if (!isLongevityProtocolPage) return;

    const section = sectionRef.current;
    const probe = probeVideoRef.current;
    if (!section || !probe) return;

    const h = Math.ceil(section.getBoundingClientRect().height);
    const one = Math.ceil(probe.getBoundingClientRect().height);

    if (h <= 0 || one <= 0) return;

    const needed = Math.max(1, Math.ceil(h / one) + 1);

    setTargetHeight(prev => (prev === h ? prev : h));
    setRenderedCount(prev => (needed > prev ? needed : prev));
  }, [isLongevityProtocolPage]);

  useEffect(() => {
    if (router.pathname.startsWith('/tools/longevity-protocol')) {
      setIsLongevityProtocolPage(true);
    } else {
      setIsLongevityProtocolPage(false);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!isLongevityProtocolPage) {
      setTargetHeight(0);
      setRenderedCount(1);
    } else {
      requestAnimationFrame(recalc);
    }
  }, [isLongevityProtocolPage]);

  useEffect(() => {
    if (!isLongevityProtocolPage) return;

    const handleDone = () => requestAnimationFrame(recalc);
    router.events.on('routeChangeComplete', handleDone);

    return () => {
      router.events.off('routeChangeComplete', handleDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events, isLongevityProtocolPage]);

  useLayoutEffect(() => {
    if (!isLongevityProtocolPage) return;

    recalc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLongevityProtocolPage]);

  useEffect(() => {
    if (!isLongevityProtocolPage) return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(recalc);
    });

    ro.observe(section);
    window.addEventListener('resize', recalc);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLongevityProtocolPage]);

  return (
    <>
      <Header />
      {isLongevityProtocolPage ? (
        <>
          <Hero />
          <main className={styles.longevityMain}>
            {isMobile ? <MobileNavigation /> : <Navigation />}
            <section ref={sectionRef} className={styles.section}>
              <div
                className={styles.videoLayer}
                aria-hidden
                style={{ height: targetHeight }}
              >
                {Array.from({ length: renderedCount }).map((_, i) => (
                  <video
                    key={i}
                    ref={i === 0 ? probeVideoRef : undefined}
                    src="/keepsimple_/assets/longevity/dna.mp4"
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    className={styles.video}
                    onLoadedMetadata={recalc}
                  />
                ))}
              </div>
              <div className={styles.content}>{children}</div>
            </section>
          </main>
        </>
      ) : (
        <main>{children}</main>
      )}
    </>
  );
}
