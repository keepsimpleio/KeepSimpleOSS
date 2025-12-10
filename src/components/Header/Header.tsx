import React, { FC, Fragment, useCallback, useContext } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { flushSync } from 'react-dom';

import Navbar from '@components/Navbar';
import Link from '@components/NextLink';
import { GlobalContext } from '@components/Context/GlobalContext';

import type { TRouter } from '@local-types/global';

import useGlobals from '@hooks/useGlobals';
import { useIsWidthLessThan } from '@hooks/useScreenSize';

import styles from './Header.module.scss';

const Header: FC = () => {
  const router = useRouter();
  const { locale, locales } = router as TRouter;
  const { setShowLoader, videoRef } = useContext(GlobalContext);
  const isSmallScreen = useIsWidthLessThan(1141);

  const [
    { toggleIsDarkTheme, toggleSidebar },
    { isDarkTheme, isOpenedSidebar },
  ] = useGlobals();
  const handleToggleTheme = useCallback(() => {
    toggleIsDarkTheme();
  }, []);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, []);

  const handleClick = (e, path: string) => {
    e.preventDefault();
    flushSync(() => {
      setShowLoader(true);
    });
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });

    setTimeout(() => {
      router.push(path);
    }, 300);

    setTimeout(() => {
      videoRef.current?.pause();
      setShowLoader(false);
    }, 800);
  };

  return (
    <Fragment>
      <header
        className={cn(styles.header, {
          [styles.darkTheme]: isDarkTheme,
          [styles.openedSidebar]: isOpenedSidebar,
        })}
      >
        <div>
          <Link href="/" locale={locale} shallow={false} legacyBehavior>
            <Image
              onClick={e => {
                if (router.pathname !== '/') {
                  !isSmallScreen && handleClick(e, '/');
                }
              }}
              src={
                isDarkTheme
                  ? '/keepsimple_/assets/logos/keepsimpleDark.svg'
                  : '/keepsimple_/assets/logos/keepsimple-company-mngmnt.svg'
              }
              alt="keepsimple logo"
              width={130.61}
              height={32}
              className={styles.logo}
            />
          </Link>
        </div>
        <div className={styles.burgerMenu} onClick={handleToggleSidebar}>
          <div />
          <div />
          <div />
        </div>
        <div>
          <Navbar
            handleToggleSidebar={handleToggleSidebar}
            handleClick={handleClick}
          />
          <div className={styles.actions}>
            <div
              data-test-id="theme-toggle"
              className={styles.toggleTheme}
              onClick={handleToggleTheme}
            ></div>
            <div
              className={cn(styles.toggleLanguage, {
                [styles.en]: locale === 'en',
                [styles.ru]: locale === 'ru',
              })}
            >
              {locale === 'en' ? (
                <Link
                  shallow={false}
                  href={router.asPath}
                  locale={locales[1]}
                  legacyBehavior
                  scroll={false}
                >
                  <a
                    className={styles.languageTitle}
                    data-test-id="language-toggle"
                  >
                    <Image
                      src={
                        isDarkTheme
                          ? '/keepsimple_/assets/globe-light.png'
                          : '/keepsimple_/assets/globe-dark.png'
                      }
                      width={24}
                      height={24}
                      alt={'Language switcher'}
                    />
                    {locales[1]}
                  </a>
                </Link>
              ) : (
                <Link
                  shallow={false}
                  href={router.asPath}
                  locale={locales[0]}
                  legacyBehavior
                  scroll={false}
                >
                  <a
                    className={styles.languageTitle}
                    data-test-id="language-toggle-reset"
                  >
                    <Image
                      src={
                        isDarkTheme
                          ? '/keepsimple_/assets/globe-light.png'
                          : '/keepsimple_/assets/globe-dark.png'
                      }
                      width={24}
                      height={24}
                      alt={'Language switcher'}
                    />
                    {locales[0]}
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className={styles.closeButton} onClick={handleToggleSidebar} />
      </header>
    </Fragment>
  );
};

export default Header;
