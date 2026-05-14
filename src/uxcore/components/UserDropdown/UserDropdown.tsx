import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { TRouter } from '@uxcore/local-types/global';

import { logout } from '@uxcore/api/auth';

import decisionTable from '@data/decisionTable';

import LogInModal from '@uxcore/components/_uxcp/LogInModal';

import 'react-loading-skeleton/dist/skeleton.css';
import styles from './UserDropdown.module.scss';

type UserDropdownProps = {
  userName?: string;
  userImage?: string;
  showDropdown?: boolean;
  showSavedPersonas?: boolean;
  isLoggedIn?: boolean;
  setShowDropdown?: (updater: (prev: boolean) => boolean) => void;
  setAccountData?: (updater: (prev: boolean) => boolean) => void;
  openSavedPersonas?: (savedPersonas: boolean) => void;
  handleOpenSettings?: () => void;
  settingsTxt: string;
  myProfileTxt: string;
};

const UserDropdown: FC<UserDropdownProps> = ({
  userName,
  userImage,
  showDropdown,
  setShowDropdown,
  showSavedPersonas,
  isLoggedIn,
  setAccountData,
  openSavedPersonas,
  handleOpenSettings,
  settingsTxt,
  myProfileTxt,
}) => {
  const { locale } = useRouter() as TRouter;

  const [openLoginModal, setOpenLoginModal] = useState(false);

  const { savedPersonasText, logoutText, login } = decisionTable[locale];
  const [isAccessTokenExist, setIsAccessTokenExist] = useState(false);

  const toggleDropdownView = useCallback(e => {
    e.stopPropagation();
    setShowDropdown(prev => !prev);
  }, []);

  const handleLogout = useCallback(e => {
    setAccountData(null);
    logout();
    document.cookie = `accessToken=; path=/; Secure; SameSite=Strict;`;
    toggleDropdownView(e);
  }, []);

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('click', toggleDropdownView);
      return () => {
        document.removeEventListener('click', toggleDropdownView);
      };
    }
  }, [showDropdown]);

  // useEffect(() => {
  //   localStorage.setItem('link', router.asPath);
  // }, []);

  const renderUserName = () => {
    if (!isLoggedIn && isAccessTokenExist) {
      return <Skeleton width={100} />;
    }
    return userName;
  };

  const renderUserImage = () => {
    if (!isLoggedIn && isAccessTokenExist) {
      return '/assets/images/userProfile.svg';
    }
    return userImage || '/assets/images/userProfile.svg';
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
        onClick={isLoggedIn ? toggleDropdownView : () => {}}
        className={cn(styles.userContainer, {
          [styles.userContainerHy]: locale === 'hy',
        })}
      >
        {isAccessTokenExist ? (
          <div
            className={cn(styles.user, {
              [styles.active]: showDropdown,
            })}
          >
            <Image
              src={renderUserImage()}
              alt="pic"
              width={32}
              height={32}
              className={styles.image}
            />
            <span className={styles.userName}> {renderUserName()}</span>
          </div>
        ) : (
          <div
            className={cn(styles.user, {
              [styles.active]: showDropdown,
            })}
            onClick={() => setOpenLoginModal(true)}
          >
            <Image
              src={'/assets/images/userProfile.svg'}
              alt="pic"
              width={32}
              height={32}
              className={styles.image}
            />
            <span className={styles.userName}>{login}</span>
          </div>
        )}
        <div
          className={cn(styles.dropdown, {
            [styles.showed]: showDropdown,
          })}
        >
          <span className={styles.userNameDropdown}> {userName}</span>

          <Link href={`/user/${userName}`} legacyBehavior>
            <span className={styles.myProfile}>{myProfileTxt}</span>
          </Link>
          {showSavedPersonas && (
            <span
              className={styles.savedPersonas}
              onClick={() => !!userName && openSavedPersonas(true)}
            >
              {savedPersonasText}
            </span>
          )}
          <span className={styles.settings} onClick={handleOpenSettings}>
            {settingsTxt}
          </span>
          <span onClick={handleLogout} className={styles.logOut}>
            {logoutText}
          </span>
        </div>
      </div>
      {openLoginModal && (
        <LogInModal setShowModal={setOpenLoginModal} source={'Header'} />
      )}
    </>
  );
};

export default UserDropdown;
