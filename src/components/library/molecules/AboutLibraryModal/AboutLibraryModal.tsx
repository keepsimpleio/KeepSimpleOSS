import React, { JSX } from 'react';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import { Button, ButtonSize, ButtonType } from '../Button';
import { Modal, useModalClose } from '../Modal';
import type { AboutLibraryModalProps } from './AboutLibraryModal.types';

import styles from './AboutLibraryModal.module.scss';

export function AboutLibraryModal(props: AboutLibraryModalProps): JSX.Element {
  const { onClose, ownsLibrary = false, onLibraryAction } = props;
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
          This is where KeepSimple team members and friends share what they’ve
          read and watched - books, videos, and ideas worth spreading.
        </Text>
        <Text className={styles.text} variant={TypographyVariant.TextRegular}>
          The goal is to capture knowledge precisely: with descriptions,
          meaningful order, and clear labels. Want your own Library?
        </Text>
      </div>
      <div className={styles.footer}>
        <Button
          label="Close"
          onClick={close}
          type={ButtonType.Outlined}
          size={ButtonSize.Wide}
          ariaLabel="Close modal"
          className={styles.close}
        />
        <Button
          label={ownsLibrary ? 'Open my library' : 'Create Library'}
          onClick={onLibraryAction}
          type={ButtonType.Primary}
          size={ButtonSize.Wide}
          ariaLabel={ownsLibrary ? 'Open my library' : 'Create library'}
          className={styles.action}
        />
      </div>
    </Modal>
  );
}
