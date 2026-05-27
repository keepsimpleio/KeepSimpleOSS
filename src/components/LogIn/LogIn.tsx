import cn from 'classnames';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React, { FC, useContext } from 'react';

import { setRedirectCookie } from '@lib/cookies';

import auth from '@data/auth';

import DiscordIcon from '@icons/DiscordIcon';
import GoogleIcon from '@icons/GoogleIcon';
import MailRuIcon from '@icons/MailRuIcon';
import XIcon from '@icons/XIcon';
import YandexIcon from '@icons/YandexIcon';

import { GlobalContext } from '@components/Context/GlobalContext';
import Heading from '@components/Heading';
import Modal from '@components/Modal';

import type { LogInProps } from './LogIn.types';
import MagicLinkEmailForm from './MagicLinkEmailForm';

import styles from './LogIn.module.scss';

const LogIn: FC<LogInProps> = ({ setShowLogIn }) => {
  const { accountData } = useContext(GlobalContext);
  const router = useRouter();
  const { data: session } = useSession();
  const locale = router.locale === 'ru' ? 'ru' : 'en';
  const copy = auth[locale].logIn;

  const queryAuthError = Array.isArray(router.query.authError)
    ? router.query.authError[0]
    : router.query.authError;
  const rawAuthError = queryAuthError ? String(queryAuthError) : undefined;
  const errorBannerMessage = (() => {
    if (!rawAuthError) return undefined;
    if (rawAuthError === 'EMAIL_TAKEN') return copy.errors.emailTaken;
    if (
      rawAuthError === 'AUTH_FAILED' ||
      rawAuthError === 'NO_PROVIDER' ||
      rawAuthError === 'NETWORK_ERROR'
    ) {
      return copy.errors.generic;
    }
    // Free-text messages (e.g. from MagicLinkProfileForm) come through as-is.
    return rawAuthError;
  })();

  const handleClose = () => {
    setShowLogIn(false);
    if (router.query.authError) {
      const { authError, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, {
        shallow: true,
      });
    }
  };

  const handleProviderSignIn = async (provider: string) => {
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
          text={copy.heading}
          showLeftIcon={false}
          showRightIcon={false}
          Tag={'h3'}
          className={styles.heading}
        />
        <p className={styles.text}>{copy.subtitle}</p>
        {errorBannerMessage && (
          <p
            className={styles.errorBanner}
            role="alert"
            data-cy="login-error-banner"
          >
            {errorBannerMessage}
          </p>
        )}
        <div className={styles.btnWrapper}>
          <button
            onClick={() => handleProviderSignIn('google')}
            className={cn(styles.linkBtn, styles.googleBtn)}
          >
            <GoogleIcon />
            {copy.google}
          </button>
          <button
            onClick={() => handleProviderSignIn('discord')}
            className={cn(styles.linkBtn, styles.discordBtn)}
          >
            <DiscordIcon />
            {copy.discord}
          </button>
          <button
            onClick={() => handleProviderSignIn('twitter')}
            className={cn(styles.linkBtn, styles.twitterBtn)}
          >
            <XIcon />
            {copy.twitter}
          </button>
          <button
            onClick={() => handleProviderSignIn('mailru')}
            className={cn(styles.linkBtn, styles.mailruBtn)}
          >
            <MailRuIcon />
            {copy.mailru}
          </button>
          <button
            onClick={() => handleProviderSignIn('yandex')}
            className={cn(styles.linkBtn, styles.yandexBtn)}
          >
            <YandexIcon />
            {copy.yandex}
          </button>
        </div>
        <MagicLinkEmailForm />
      </div>
    </Modal>
  );
};

export default LogIn;
