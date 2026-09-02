import cn from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { flushSync } from 'react-dom';

import type { TRouter } from '@local-types/global';

import useGlobals from '@hooks/useGlobals';
import { useIsWidthLessThan } from '@hooks/useScreenSize';

import { getMyLibrary } from '@api/library/getMyLibrary';
import { userInfoUpdate } from '@api/settings';
import { getMyInfo } from '@api/strapi';

import { GlobalContext } from '@components/Context/GlobalContext';
import LogIn from '@components/LogIn';
import Navbar from '@components/Navbar';
import Link from '@components/NextLink';
import ThemeToggle from '@components/ThemeToggle';
import UserProfile from '@components/UserProfile';

import styles from './Header.module.scss';

const SettingsModal = dynamic(() => import('@components/SettingsModal'), {
  ssr: false,
});

const Header: FC = () => {
  const router = useRouter();
  const { locale, locales } = router as TRouter;
  const { setShowLoader, videoRef } = useContext(GlobalContext);
  const [openSettings, setOpenSettings] = useState(false);
  const [usernameIsTakenError, setUsernameIsTakenError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const isSmallScreen = useIsWidthLessThan(1141);
  // Laptop widths: the six nav links plus the account block outgrow the row.
  // The username is the widest expendable part of it and the avatar already
  // says who is signed in, so it steps aside first.
  const isCompactDesktop = useIsWidthLessThan(1360);
  const [openLogin, setOpenLogin] = useState(false);
  const { accountData, setAccountData } = useContext(GlobalContext);
  const [{ toggleSidebar }, { isDarkTheme, isOpenedSidebar }] = useGlobals();

  // Creating a library is gated by the `can-create-library` feature flag from
  // GET /api/users/me (same flag the library page enforces). Drives whether the
  // dropdown's "Create library" item is actionable.
  const canCreateLibrary =
    accountData?.featureNames?.includes('can-create-library') ?? false;

  // "My Library" is only reachable once a library exists, or could be
  // bootstrapped by a flag-holder. With neither, the user has no library page,
  // so the dropdown item is disabled. Check via the owner-scoped lookup.
  const [hasLibrary, setHasLibrary] = useState(false);
  useEffect(() => {
    if (!accountData?.id) {
      setHasLibrary(false);
      return;
    }
    let cancelled = false;
    getMyLibrary(accountData.id).then(lib => {
      if (!cancelled) setHasLibrary(lib !== null);
    });
    return () => {
      cancelled = true;
    };
  }, [accountData?.id]);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (router.query.authError) {
      setOpenLogin(true);
    }
  }, [router.query.authError]);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, []);

  const handleOpenSettings = useCallback(() => {
    setOpenSettings(true);
  }, []);

  const handleSaveClick = async (
    username: string,
    linkedInUrl: string,
    isEmailPublic: string,
    isLinkedinPublic: string,
    title?: string,
  ) => {
    const mailIsPublic = isEmailPublic === 'everyone';
    const linkedInIsPublic = isLinkedinPublic === 'everyone';
    try {
      await userInfoUpdate(
        token,
        username,
        linkedInUrl,
        mailIsPublic,
        linkedInIsPublic,
        title,
      );

      const data = await getMyInfo();
      setAccountData(data);
      setOpenSettings(false);
      setUsernameIsTakenError('');
    } catch (error) {
      setOpenSettings(true);
      setUsernameIsTakenError('Username is already taken');
    }
  };
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
          [styles.library]: router.pathname.startsWith('/library'),
        })}
      >
        <div>
          <Link href="/" locale={locale} shallow={false} legacyBehavior>
            <Image
              onClick={e => {
                const goingToLanding = router.pathname !== '/';
                if (isSmallScreen) {
                  e.preventDefault();
                  if (isOpenedSidebar) toggleSidebar();
                  if (goingToLanding) router.push('/');
                  return;
                }
                if (goingToLanding) handleClick(e, '/');
              }}
              src={
                isDarkTheme
                  ? '/keepsimple_/assets/logos/keepsimpleDark.svg'
                  : '/keepsimple_/assets/logos/keepsimple.svg'
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
        {isSmallScreen && (
          <div className={styles.mobileUserProfile}>
            <UserProfile
              setAccountData={setAccountData}
              isLoggedIn={!!accountData}
              isDarkTheme={isDarkTheme}
              username={accountData?.username}
              setOpenLoginModal={setOpenLogin}
              userImage={accountData?.picture}
              handleOpenSettings={handleOpenSettings}
              canCreateLibrary={canCreateLibrary}
              hasLibrary={hasLibrary}
              hideDropdown={isOpenedSidebar}
              hideUsername
            />
          </div>
        )}
        <div className={styles.navGroup}>
          <Navbar
            handleToggleSidebar={handleToggleSidebar}
            handleClick={handleClick}
          />
          <div className={styles.actions}>
            <ThemeToggle />
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
                          ? '/keepsimple_/assets/globe-light.svg'
                          : '/keepsimple_/assets/globe.svg'
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
                          ? '/keepsimple_/assets/globe-light.svg'
                          : '/keepsimple_/assets/globe.svg'
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
            {!isSmallScreen && (
              <UserProfile
                setAccountData={setAccountData}
                isLoggedIn={!!accountData}
                isDarkTheme={isDarkTheme}
                username={accountData?.username}
                setOpenLoginModal={setOpenLogin}
                userImage={accountData?.picture}
                handleOpenSettings={handleOpenSettings}
                canCreateLibrary={canCreateLibrary}
                hasLibrary={hasLibrary}
                hideUsername={isCompactDesktop && !!accountData}
              />
            )}
          </div>
        </div>
        <div className={styles.closeButton} onClick={handleToggleSidebar} />
      </header>
      {openLogin && <LogIn setShowLogIn={setOpenLogin} />}
      {openSettings && (
        <SettingsModal
          setOpenSettings={setOpenSettings}
          currentUsername={accountData?.username}
          currentEmail={accountData?.email}
          mailStatus={accountData?.publicEmail}
          linkedin={accountData?.linkedIn}
          linkedinStatus={accountData?.publicLinkedin}
          provider={accountData?.provider}
          token={token}
          handleSaveClick={handleSaveClick}
          setUsernameIsTakenError={setUsernameIsTakenError}
          usernameIsTakenError={usernameIsTakenError}
          setChangedTitle={() => {}}
        />
      )}
    </Fragment>
  );
};

export default Header;
