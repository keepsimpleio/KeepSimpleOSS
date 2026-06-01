'use client';

import classNames from 'classnames';
import React, { JSX, useState } from 'react';

import { Modal, useModalClose } from '../Modal';
import { Input } from '../Input';
import { shelfCardData } from '@/constants/common';
import { Text, TypographyVariant } from '@/components/atoms/Text';

import { Button, ButtonSize, ButtonType } from '../Button';

import type { AddShelfModalProps, ShelfType } from './AddShelfModal.types';

import styles from './AddShelfModal.module.scss';

// Matches the single-shelf `name` constraint (`maxLength: 50`) in the backend schema.
const SHELF_NAME_MAX_LENGTH = 50;

export function AddShelfModal(props: AddShelfModalProps): JSX.Element {
  const { onClose, onAddShelf } = props;
  const { closeRef, close } = useModalClose(onClose);
  const [activeItem, setActiveItem] = useState<ShelfType>('books');
  const [name, setName] = useState('');

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0;

  const handleAddShelf = () => {
    if (!canSubmit) return;
    onAddShelf(activeItem, trimmedName);
  };

  return (
    <Modal className={styles.modal} title="Select shelf type" onClose={onClose} closeRef={closeRef}>
      <div className={styles.wrapper}>
        <div className={styles.field}>
          <Text variant={TypographyVariant.TextSmall} className={styles.label}>
            Shelf name
          </Text>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My shelf"
            placeholderColor="#9E9E9E"
            ariaLabel="Shelf name"
            maxLength={SHELF_NAME_MAX_LENGTH}
          />
        </div>

        <div className={styles.content}>
          {shelfCardData.map((item) => {
            return (
              <div
                key={item.key}
                role="button"
                className={classNames(styles.item, {
                  [styles.active]: activeItem === item.key,
                })}
                onClick={() => setActiveItem(item.key)}
              >
                <item.Icon />
                <Text variant={TypographyVariant.TextBase}>{item.label}</Text>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Button
            label="Cancel"
            onClick={close}
            type={ButtonType.Secondary}
            size={ButtonSize.Wide}
            ariaLabel="Cancel"
            className={styles.close}
          />
          <Button
            label="Add shelf"
            onClick={handleAddShelf}
            type={ButtonType.Primary}
            size={ButtonSize.Wide}
            ariaLabel="Create shelf"
            className={styles.close}
            disabled={!canSubmit}
          />
        </div>
      </div>
    </Modal>
  );
}
