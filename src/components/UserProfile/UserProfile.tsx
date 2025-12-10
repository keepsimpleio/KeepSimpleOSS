import React, { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { logout } from '@api/auth';
import { NextRouter, useRouter } from 'next/router';
import cn from 'classnames';
import Skeleton from 'react-loading-skeleton';

import styles from './UserProfile.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

type UserProfileProps = {
  username?: string;
  userImage?: string;
  showDropdown?: boolean;
  isLoggedIn?: boolean;
  setAccountData?: (updater: (prev: boolean) => boolean) => void;
  setOpenLoginModal?: (openModal: boolean) => void;
};

const UserProfile: FC<UserProfileProps> = ({
  username,
  userImage,
  showDropdown,
  isLoggedIn,
  setAccountData,
  setOpenLoginModal,
}) => {
  const router: NextRouter = useRouter();

  const [isAccessTokenExist, setIsAccessTokenExist] = useState(false);

  const toggleDropdownView = useCallback(e => {
    e.stopPropagation();
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
      return '/assets/avatar.svg';
    }
    return userImage;
  };

  useEffect(() => {
    localStorage.setItem('link', router.asPath);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAccessTokenExist(true);
    }
  }, []);

  return (
    <>
      <div className={cn(styles.userContainer, {})}>
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
          <div className={styles.user} onClick={() => setOpenLoginModal(true)}>
            <Image
              src={'/assets/avatar.svg'}
              alt="pic"
              width={32}
              height={32}
              className={styles.image}
            />
            <span className={styles.userName}>Log In </span>
          </div>
        )}
        <div
          className={cn(styles.dropdown, {
            [styles.showed]: showDropdown,
          })}
        >
          <span className={styles.userNameDropdown}> {username}</span>
          {!!isAccessTokenExist && (
            <span onClick={handleLogout} className={styles.logOut}>
              Log Out
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
