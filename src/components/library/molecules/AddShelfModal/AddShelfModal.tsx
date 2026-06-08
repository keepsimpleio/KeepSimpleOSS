import classNames from 'classnames';
import React, { JSX, useState } from 'react';

import { shelfCardData } from '@constants/library/common';

import { Loader } from '@components/library/atoms/Loader';
import { Text, TypographyVariant } from '@components/library/atoms/Text';

import { Button, ButtonSize, ButtonType } from '../Button';
import { Input } from '../Input';
import { Modal, useModalClose } from '../Modal';
import type { AddShelfModalProps, ShelfType } from './AddShelfModal.types';

import styles from './AddShelfModal.module.scss';

// Matches the single-shelf `name` constraint (`maxLength: 50`) in the backend schema.
const SHELF_NAME_MAX_LENGTH = 50;

export function AddShelfModal(props: AddShelfModalProps): JSX.Element {
  const { onClose, onAddShelf, existingNames = [] } = props;
  const { closeRef, close } = useModalClose(onClose);
  const [activeItem, setActiveItem] = useState<ShelfType>('books');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0 && !isSubmitting;

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) setError(null);
  };

  const handleAddShelf = async () => {
    if (!canSubmit) return;

    const isDuplicate = existingNames.some(
      n => n.trim().toLowerCase() === trimmedName.toLowerCase(),
    );
    if (isDuplicate) {
      setError('A shelf with this name already exists.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onAddShelf(activeItem, trimmedName);
    } catch {
      // The create failed server-side (e.g. a name collision the client list
      // didn't know about) — keep the modal open and warn instead of crashing.
      setError('Could not create the shelf. Please try a different name.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      className={styles.modal}
      title="Select shelf type"
      onClose={onClose}
      closeRef={closeRef}
    >
      <div className={styles.wrapper}>
        {isSubmitting && <Loader />}
        <div className={styles.field}>
          <Text variant={TypographyVariant.TextSmall} className={styles.label}>
            Shelf name
          </Text>
          <Input
            type="text"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="My shelf"
            placeholderColor="#9E9E9E"
            ariaLabel="Shelf name"
            maxLength={SHELF_NAME_MAX_LENGTH}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.content}>
          {shelfCardData.map(item => {
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
            label={isSubmitting ? 'Adding…' : 'Add shelf'}
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
