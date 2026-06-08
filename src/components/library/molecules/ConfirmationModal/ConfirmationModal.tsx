import React from 'react';

import { CheckIcon, ErrorIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';

import type { ConfirmationModalProps } from './ConfirmationModal.types';

import styles from './ConfirmationModal.module.scss';

export function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    variant = 'delete',
    text,
    title,
    isLoading = false,
    actionButtonType = ButtonType.Primary,
    actionButtonLabel = 'Delete',
    onClose,
    onConfirm,
  } = props;

  const isSuccess = variant === 'success';
  const { closeRef, close } = useModalClose(onClose);

  return (
    <Modal className={styles.modal} onClose={onClose} closeRef={closeRef}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.icon}>
            {isSuccess ? <CheckIcon /> : <ErrorIcon />}
          </div>
          <Text
            className={styles.title}
            variant={TypographyVariant.TextBaseBold}
          >
            {title}
          </Text>
          <Text className={styles.text} variant={TypographyVariant.TextSmall}>
            {text}
          </Text>
        </div>

        <div className={styles.footer}>
          {!isSuccess && (
            <Button
              label="Cancel"
              onClick={close}
              type={ButtonType.Secondary}
              size={ButtonSize.Wide}
              ariaLabel="Cancel"
              className={styles.cancelButton}
              disabled={isLoading}
            />
          )}
          <Button
            onClick={onConfirm}
            label={actionButtonLabel}
            type={actionButtonType}
            size={ButtonSize.Wide}
            ariaLabel={actionButtonLabel}
            className={styles.actionButton}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
