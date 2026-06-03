import cn from 'classnames';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { logout } from '@api/auth';

import LibraryIcon from '@icons/library/svg/library.svg';

import 'react-loading-skeleton/dist/skeleton.css';
import styles from './UserProfile.module.scss';

type UserProfileProps = {
  username?: string;
  userImage?: string;
  isLoggedIn?: boolean;
  isDarkTheme?: boolean;
  hideDropdown?: boolean;
  hideUsername?: boolean;
  setAccountData?: (updater: (prev: boolean) => boolean) => void;
  setOpenLoginModal?: (openModal: boolean) => void;
  handleOpenSettings?: () => void;
};

const labels = {
  en: { myLibrary: 'My Library', settings: 'Settings', logout: 'Log out' },
  ru: { myLibrary: 'Моя библиотека', settings: 'Настройки', logout: 'Выйти' },
  hy: {
    myLibrary: 'Իմ գրադարանը',
    settings: 'Կարգավորումներ',
    logout: 'Դուրս գալ',
  },
};

const UserProfile: FC<UserProfileProps> = ({
  username,
  userImage,
  isLoggedIn,
  isDarkTheme,
  hideDropdown,
  hideUsername,
  setAccountData,
  setOpenLoginModal,
  handleOpenSettings,
}) => {
  const router: NextRouter = useRouter();
  const locale = (router.locale || 'en') as keyof typeof labels;
  const t = labels[locale] || labels.en;

  const [isAccessTokenExist, setIsAccessTokenExist] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setAccountData(null);
    logout();
    document.cookie = `accessToken=; path=/; Secure; SameSite=Strict;`;
    setIsDropdownOpen(false);
  }, []);

  const handleSettings = useCallback(() => {
    setIsDropdownOpen(false);
    handleOpenSettings?.();
  }, [handleOpenSettings]);

  const handleMyLibrary = useCallback(() => {
    setIsDropdownOpen(false);
    router.push(`/library/${username}`);
  }, [router, username]);

  useEffect(() => {
    if (hideDropdown) setIsDropdownOpen(false);
  }, [hideDropdown]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = () => setIsDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    localStorage.setItem('link', router.asPath);
  }, []);

  const renderUserName = () => {
    if (!isLoggedIn && isAccessTokenExist) {
      return <Skeleton width={100} />;
    }
    return username;
  };

  const renderUserImage = () => {
    if (!isLoggedIn && isAccessTokenExist) {
      return '/keepsimple_/assets/avatar.svg';
    }
    return userImage || '/keepsimple_/assets/avatar.svg';
  };
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAccessTokenExist(true);
    }
  }, []);

  return (
    <>
      <div
        className={cn(styles.userContainer, {
          [styles.darkTheme]: isDarkTheme,
        })}
      >
        {isAccessTokenExist ? (
          <div
            className={cn(styles.user, {
              [styles.active]: isDropdownOpen,
            })}
            onClick={toggleDropdown}
          >
            <Image
              src={renderUserImage()}
              alt="pic"
              width={32}
              height={32}
              className={styles.image}
            />
            {!hideUsername && (
              <span className={styles.userName}>{renderUserName()}</span>
            )}
          </div>
        ) : (
          <div className={styles.user} onClick={() => setOpenLoginModal(true)}>
            <Image
              src={'/keepsimple_/assets/avatar.svg'}
              alt="pic"
              width={32}
              height={32}
              className={styles.image}
            />
            {!hideUsername && <span className={styles.userName}>Log In</span>}
          </div>
        )}
        {isDropdownOpen && isAccessTokenExist && (
          <div className={styles.dropdown} onClick={e => e.stopPropagation()}>
            {username && (
              <div className={styles.menuItem} onClick={handleMyLibrary}>
                <LibraryIcon
                  width={20}
                  height={11}
                  className={cn(styles.menuIcon, {
                    [styles.menuIconDark]: isDarkTheme,
                  })}
                />
                <span>{t.myLibrary}</span>
              </div>
            )}
            <div className={styles.menuItem} onClick={handleSettings}>
              <Image
                src="/keepsimple_/assets/icons/user-dropdown/settings.svg"
                alt="settings"
                width={15}
                height={16}
                className={cn(styles.menuIcon, {
                  [styles.menuIconDark]: isDarkTheme,
                })}
              />
              <span>{t.settings}</span>
            </div>
            <div className={styles.menuItem} onClick={handleLogout}>
              <Image
                src="/keepsimple_/assets/icons/user-dropdown/log-out.svg"
                alt="log out"
                width={14}
                height={14}
                className={cn(styles.menuIcon, {
                  [styles.menuIconDark]: isDarkTheme,
                })}
              />
              <span>{t.logout}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
