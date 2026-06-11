import React, { JSX } from 'react';

import { ShareIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';

import type { SharedWithYouModalProps } from './SharedWithYouModal.types';

import styles from './SharedWithYouModal.module.scss';

export function SharedWithYouModal({
  ownerName,
  itemCount,
  onViewSelection,
  onClose,
}: SharedWithYouModalProps): JSX.Element {
  const { closeRef } = useModalClose(onClose);

  const itemLabel = itemCount === 1 ? 'item' : 'items';

  return (
    <Modal className={styles.modal} onClose={onClose} closeRef={closeRef}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <ShareIcon />
        </div>
        <Text className={styles.title} variant={TypographyVariant.TextBaseBold}>
          {ownerName} shared a selection with you
        </Text>
        <Text className={styles.text} variant={TypographyVariant.TextSmall}>
          {ownerName} has shared {itemCount} {itemLabel} in a specific sequence
          with you. Open the selection to view them in order.
        </Text>
        <Button
          label="View selection"
          ariaLabel="View shared selection"
          onClick={onViewSelection}
          type={ButtonType.Primary}
          size={ButtonSize.Wide}
          Icon={<ShareIcon />}
          className={styles.action}
        />
      </div>
    </Modal>
  );
}
