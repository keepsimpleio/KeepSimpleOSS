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

import { userInfoUpdate } from '@api/settings';
import { getMyInfo } from '@api/strapi';

import { GlobalContext } from '@components/Context/GlobalContext';
import LogIn from '@components/LogIn';
import Navbar from '@components/Navbar';
import Link from '@components/NextLink';
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
  const [openLogin, setOpenLogin] = useState(false);
  const { accountData, setAccountData } = useContext(GlobalContext);
  const [
    { toggleIsDarkTheme, toggleSidebar },
    { isDarkTheme, isOpenedSidebar },
  ] = useGlobals();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken);
  }, []);

  const handleToggleTheme = useCallback(() => {
    toggleIsDarkTheme();
  }, []);

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
              hideDropdown={isOpenedSidebar}
              hideUsername
            />
          </div>
        )}
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
