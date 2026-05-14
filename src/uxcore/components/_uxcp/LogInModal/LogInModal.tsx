import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { FC, useContext } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import { setRedirectCookie } from '@uxcore/lib/cookies';

import decisionTable from '@uxcore/data/decisionTable';

import DiscordIcon from '@uxcore/assets/icons/DiscordIcon';
import GoogleIcon from '@uxcore/assets/icons/GoogleIcon';
import LinkedInIcon from '@uxcore/assets/icons/LinkedInIcon';
import MailRuIcon from '@uxcore/assets/icons/MailRuIcon';
import XIcon from '@uxcore/assets/icons/XIcon';
import YandexIcon from '@uxcore/assets/icons/YandexIcon';

import Button from '@uxcore/components/Button';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import Modal from '@uxcore/components/Modal';

import {
  handleMixpanelSignUp,
  trackLogInSource,
} from '@uxcore/lib/mixpanel';

import styles from './LogInModal.module.scss';

type LoginModalProps = {
  setShowModal: (showModal: boolean) => void;
  source?: string;
};
const LogInModal: FC<LoginModalProps> = ({ setShowModal, source }) => {
  const { locale } = useRouter() as TRouter;
  const { accountData } = useContext(GlobalContext);
  const router = useRouter();
  const isProduction = process.env.NEXT_PUBLIC_ENV === 'prod';
  const { data: session } = useSession();
  const {
    singInWithGoogle,
    signInWithLinkedIn,
    signInWithDiscord,
    signInWithTwitter,
    signInWithMailRu,
    signInWithYandex,
    loginText,
    cancelBtn,
    login,
  } = decisionTable[locale];

  const handleClose = () => {
    setShowModal(false);
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

      router.replace(`/auth?provider=${provider}`);
      handleMixpanelSignUp(provider);
      trackLogInSource(logInSource);
      return;
    }

    router.push(`/auth?provider=${provider}`);
    handleMixpanelSignUp(provider);
    trackLogInSource(logInSource);
  };

  return (
    <Modal
      onClick={handleClose}
      wrapperClassName={styles.loginWrapper}
      bodyClassName={styles.loginBody}
      dataCy={'login-modal'}
    >
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>{login}</h1>
        <span className={styles.description}>{loginText}</span>
        <div className={styles.buttonWrapper}>
          <a
            onClick={() => handleProviderSignIn('google', source)}
            className={styles.link}
          >
            <GoogleIcon /> <span>{singInWithGoogle}</span>
          </a>
          {!isProduction && (
            <a
              onClick={() => handleProviderSignIn('linkedin', source)}
              className={styles.link}
            >
              <LinkedInIcon /> <span>{signInWithLinkedIn}</span>
            </a>
          )}
          <a
            onClick={() => handleProviderSignIn('discord', source)}
            className={styles.link}
          >
            <DiscordIcon /> <span>{signInWithDiscord}</span>
          </a>
          <a
            onClick={() => handleProviderSignIn('twitter', source)}
            className={styles.link}
          >
            <XIcon /> <span>{signInWithTwitter}</span>
          </a>
          <a
            onClick={() => handleProviderSignIn('mailru', source)}
            className={styles.link}
          >
            <MailRuIcon /> <span>{signInWithMailRu}</span>
          </a>
          <a
            onClick={() => handleProviderSignIn('yandex', source)}
            className={styles.link}
          >
            <YandexIcon /> <span>{signInWithYandex}</span>
          </a>
          <Button
            label={cancelBtn}
            onClick={handleClose}
            className={styles.cancelBtn}
          />
        </div>
      </div>
    </Modal>
  );
};
export default LogInModal;
