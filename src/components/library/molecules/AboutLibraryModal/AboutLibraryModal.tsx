'use client';

import React, { JSX } from 'react';

import type { AboutLibraryModalProps } from './AboutLibraryModal.types';
import { Button, ButtonType, ButtonSize } from '../Button';
import { Text, TypographyVariant } from '@/components/atoms/Text';

import { Modal, useModalClose } from '../Modal';

import styles from './AboutLibraryModal.module.scss';

export function AboutLibraryModal(props: AboutLibraryModalProps): JSX.Element {
  const { onClose } = props;
  const { closeRef, close } = useModalClose(onClose);

  return (
    <Modal
      className={styles.modal}
      title="What is this place?"
      onClose={onClose}
      closeRef={closeRef}
    >
      <div className={styles.wrapper}>
        <Text className={styles.text} variant={TypographyVariant.TextRegular}>
          Welcome to the Library
        </Text>
        <Text className={styles.text} variant={TypographyVariant.TextRegular}>
          This is where KeepSimple team members and friends share what they’ve read and watched -
          books, videos, and ideas worth spreading.
        </Text>
        <Text className={styles.text} variant={TypographyVariant.TextRegular}>
          The goal is to capture knowledge precisely: with descriptions, meaningful order, and clear
          labels. Want your own Library?
        </Text>
        <Text className={styles.text} variant={TypographyVariant.TextRegular}>
          Tell us who you are and what your intent is - email{' '}
          <a href="mailto:greatest@gmail.com">greatest@gmail.com.</a>
        </Text>
      </div>
      <div className={styles.footer}>
        <Button
          label="Close"
          onClick={close}
          type={ButtonType.Primary}
          size={ButtonSize.Wide}
          ariaLabel="Close modal"
          className={styles.close}
        />
      </div>
    </Modal>
  );
}
