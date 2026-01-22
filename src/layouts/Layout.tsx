import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import Header from '@components/Header';
import Hero from '@components/longevity/Hero';
import Navigation from '@components/longevity/Navigation';

import styles from './Layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLongevityProtocolPage, setIsLongevityProtocolPage] = useState(false);

  useEffect(() => {
    if (router.pathname.startsWith('/tools/longevity-protocol')) {
      setIsLongevityProtocolPage(true);
    } else {
      setIsLongevityProtocolPage(false);
    }
  }, [router.pathname]);

  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach(v => {
      if (!v) return;
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    });
  }, []);

  const setRef = (i: number) => (el: HTMLVideoElement | null) => {
    refs.current[i] = el;
  };

  return (
    <>
      <Header />
      {isLongevityProtocolPage ? (
        <>
          <Hero />
          <main className={styles.longevityMain}>
            <Navigation />
            <section className={styles.section}>
              <div className={styles.videoWrapper}>
                {[0, 1, 2, 3].map(i => (
                  <video
                    ref={setRef(i)}
                    key={i}
                    src="/keepsimple_/assets/longevity/dna.mp4"
                    muted
                    autoPlay
                    width={170}
                    loop
                    playsInline
                    preload="auto"
                    className={styles.video}
                  />
                ))}
              </div>
              <div>{children}</div>
            </section>
          </main>
        </>
      ) : (
        <main>{children}</main>
      )}
    </>
  );
}
