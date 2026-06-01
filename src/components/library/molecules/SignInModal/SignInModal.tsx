'use client';

import React, { JSX } from 'react';

import type { SignInModalProps } from './SignInModal.types';

import { useAuth } from '@/context/AuthContext';

import GoogleIcon from '@/assets/svg/google.svg';
import DiscordIcon from '@/assets/svg/discord.svg';

import { Modal, useModalClose } from '@/components/molecules/Modal';
import { Button, ButtonSize, ButtonType } from '@/components/molecules/Button';
import { TagType, Text, TypographyVariant } from '@/components/atoms/Text';

import { CloseIcon } from '@/assets/svg';

import styles from './SignInModal.module.scss';

export function SignInModal(props: SignInModalProps): JSX.Element {
  const { onClose } = props;

  const { handleProviderSignIn } = useAuth();
  const { closeRef, close } = useModalClose(onClose);

  return (
    <Modal
      className={styles.modal}
      wrapperClassName={styles.wrapper}
      onClose={onClose}
      closeRef={closeRef}
    >
      <div className={styles.content}>
        <Text tag={TagType.H1} variant={TypographyVariant.TitlePrimary}>
          Log In
        </Text>
        <Text tag={TagType.P} className={styles.text} variant={TypographyVariant.TextRegular}>
          To use this feature you have to log in.
        </Text>

        <Button
          className={styles.button}
          Icon={<GoogleIcon />}
          label="Continue with Google"
          onClick={() => handleProviderSignIn('google')}
          type={ButtonType.Secondary}
          size={ButtonSize.Default}
          ariaLabel="Continue with Google"
        />

        <Button
          className={styles.button}
          Icon={<DiscordIcon />}
          label="Continue with Discord"
          onClick={() => handleProviderSignIn('discord')}
          type={ButtonType.Secondary}
          size={ButtonSize.Wide}
          ariaLabel="Continue with Discord"
        />

        <Button
          onClick={close}
          type={ButtonType.Text}
          size={ButtonSize.Default}
          ariaLabel="Close"
          className={styles.close}
          Icon={<CloseIcon />}
        />
      </div>
    </Modal>
  );
}
