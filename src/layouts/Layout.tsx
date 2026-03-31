import cn from 'classnames';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import useCookieBox from '@hooks/useCookieBox';
import { useIsWidthLessThan } from '@hooks/useScreenSize';

import Box from '@components/Box';
import { GlobalContext } from '@components/Context/GlobalContext';
import Header from '@components/Header';
import DNACanvas from '@components/longevity/DNACanvas';
import Hero from '@components/longevity/Hero';
import Loader from '@components/longevity/Loader';
import MobileNavigation from '@components/longevity/MobileNavigation';
import Navigation from '@components/longevity/Navigation';

import styles from './Layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { overlayOn } = useContext(GlobalContext);
  const { isCookieStateLoaded, cookieBoxIsSeen, handleAccept } = useCookieBox();

  const [isLongevityProtocolPage, setIsLongevityProtocolPage] = useState(false);

  const isMobile = useIsWidthLessThan(956);

  useEffect(() => {
    if (router.pathname.startsWith('/tools/longevity-protocol')) {
      setIsLongevityProtocolPage(true);
    } else {
      setIsLongevityProtocolPage(false);
    }
  }, [router.pathname]);

  return (
    <>
      <Header />
      {isLongevityProtocolPage && <Hero />}
      {isCookieStateLoaded && !cookieBoxIsSeen && (
        <Box setIsSeen={handleAccept} />
      )}
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
          <section className={styles.section}>
            <DNACanvas />
            <div
              className={cn(styles.content, {
                [styles.contentBlur]: overlayOn,
              })}
            >
              {children}
            </div>
            {overlayOn && <Loader />}
          </section>
        ) : (
          <section>{children}</section>
        )}
      </main>
    </>
  );
}
