import cn from 'classnames';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React, { FC, useContext } from 'react';

import { setRedirectCookie } from '@lib/cookies';

import DiscordIcon from '@icons/DiscordIcon';
import GoogleIcon from '@icons/GoogleIcon';

import { GlobalContext } from '@components/Context/GlobalContext';
import Heading from '@components/Heading';
import Modal from '@components/Modal';

import type { LogInProps } from './LogIn.types';

import styles from './LogIn.module.scss';

const LogIn: FC<LogInProps> = ({ setShowLogIn, source }) => {
  const { accountData } = useContext(GlobalContext);
  const router = useRouter();
  const { data: session } = useSession();

  const handleClose = () => {
    setShowLogIn(false);
  };

  const handleProviderSignIn = async (
    provider: string,
    logInSource: string,
  ) => {
    const returnTo = router.asPath;
    setRedirectCookie(returnTo);

    if (session && accountData === null) {
      await signOut({ redirect: false });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('provider');
      sessionStorage.clear();
      document.cookie =
        'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      setTimeout(() => {
        router.replace(`/auth?provider=${provider}`);
      }, 100);
    } else {
      router.push(`/auth?provider=${provider}`);
    }
  };

  return (
    <Modal onClick={handleClose}>
      <div className={styles.container}>
        <Heading
          text={'Log In'}
          showLeftIcon={false}
          showRightIcon={false}
          Tag={'h3'}
          className={styles.heading}
        />
        <p className={styles.text}> Choose one of the options below</p>
        <div className={styles.btnWrapper}>
          <button
            onClick={() => handleProviderSignIn('google', source)}
            className={cn(styles.linkBtn, styles.googleBtn)}
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            onClick={() => handleProviderSignIn('discord', source)}
            className={cn(styles.linkBtn, styles.discordBtn)}
          >
            <DiscordIcon />
            Continue with Discord
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogIn;
