import { zodResolver } from '@hookform/resolvers/zod';
import { createTagSchema } from '@utils/library/schema/createTagSchema';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { tagColors } from '@constants/library/tags';

import { ArrowIcon, DeleteIcon, InfoIcon } from '@icons/library/svg';

import { IconName } from '@components/library/atoms/Icon';
import { InkLine } from '@components/library/atoms/InkLine';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { ConfirmationModal } from '@components/library/molecules/ConfirmationModal';
import { Input } from '@components/library/molecules/Input';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { Tag } from '@components/library/molecules/Tag';
import { Textarea } from '@components/library/molecules/Textarea';

import type {
  CreateTagFormData,
  CreateTagModalProps,
} from './CreateTagModal.types';

import styles from './CreateTagModal.module.scss';

export function CreateTagModal(props: CreateTagModalProps) {
  const {
    onClose,
    onSubmit,
    isEdit = false,
    activeTag,
    tags = [],
    onDelete,
    onTagSelect,
  } = props;
  const { closeRef, close } = useModalClose(onClose);
  const defaultColor = tagColors[0][0];
  const isSelectTag = isEdit && !activeTag;

  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateSuccessConfirmation, setShowCreateSuccessConfirmation] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof createTagSchema>>({
    resolver: zodResolver(createTagSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      color: defaultColor,
    },
  });

  const tagName = watch('name');
  const activeColor = watch('color');

  const handleColorSelect = (color: string) => {
    setValue('color', color, { shouldValidate: true });
  };

  const onSubmitForm = async (data: CreateTagFormData) => {
    if (!onSubmit) return;
    setSubmitError(null);

    // Tag names must be unique — warn before saving. Exclude the tag being
    // edited so re-saving it with its own name isn't flagged as a duplicate.
    const newName = data.name.trim().toLowerCase();
    const isDuplicate = tags.some(
      t =>
        t.id !== activeTag?.id &&
        t.attributes.name.trim().toLowerCase() === newName,
    );
    if (isDuplicate) {
      setSubmitError('A tag with this name already exists.');
      return;
    }

    try {
      await onSubmit(data);
      if (!isEdit) {
        setShowCreateSuccessConfirmation(true);
      }
    } catch {
      // Keep the modal open and warn instead of bubbling the rejection up into
      // an unhandled runtime error.
      setSubmitError('Could not save the tag. Please try a different name.');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete();

      setShowDeleteConfirmation(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete tag:', error);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (activeTag) {
      setValue('name', activeTag.name || '');
      setValue('description', activeTag.description || '');
      setValue('color', activeTag.color || defaultColor);
    }
  }, [activeTag, defaultColor, setValue]);

  return (
    <>
      {!showCreateSuccessConfirmation && (
        <Modal
          className={styles.modal}
          title={isEdit ? 'Edit tag' : 'Create a new tag'}
          onClose={showDeleteConfirmation ? () => {} : onClose}
          closeRef={closeRef}
        >
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className={styles.wrapper}>
              {isSelectTag ? (
                <div className={styles.noTagFound}>
                  {tags.length > 0 && (
                    <div className={styles.tagsList}>
                      <Text
                        variant={TypographyVariant.TextSmall}
                        className={styles.label}
                      >
                        Select tag :
                      </Text>
                      <div className={styles.tags}>
                        {tags.map(({ attributes, id }) => (
                          <Tag
                            key={attributes.name}
                            label={attributes.name}
                            color={attributes.color}
                            onClick={() => {
                              if (onTagSelect) {
                                onTagSelect({ ...attributes, id });
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.field}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.label}
                    >
                      Tag name
                    </Text>
                    <Input
                      type="text"
                      ariaLabel="Enter the name"
                      placeholder="Enter the name"
                      placeholderColor="#9E9E9E"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className={styles.error}>{errors.name.message}</p>
                    )}
                    {submitError && (
                      <p className={styles.error}>{submitError}</p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.label}
                    >
                      Description
                    </Text>
                    <Textarea
                      ariaLabel="Enter the description"
                      placeholder="This description will appear on tag hover"
                      wrapperClassName={styles.shareInputWrapper}
                      className={styles.shareInput}
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className={styles.error}>
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.label}
                    >
                      Color
                    </Text>
                    <div className={styles.color}>
                      {tagColors.map((colorGroup, groupIndex) => (
                        <div key={groupIndex} className={styles.blok}>
                          {colorGroup.map((color, colorIndex) => (
                            <div
                              role="button"
                              aria-label={`Select color ${color}`}
                              key={colorIndex}
                              style={{ backgroundColor: color }}
                              className={
                                activeColor === color ? styles.active : ''
                              }
                              onClick={() => handleColorSelect(color)}
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                    {errors.color && (
                      <p className={styles.error}>{errors.color.message}</p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <div className={styles.labelWrapper}>
                      <Text
                        variant={TypographyVariant.TextSmall}
                        className={styles.label}
                      >
                        Tag object sequence
                      </Text>
                      <InfoIcon />
                    </div>

                    <Text variant={TypographyVariant.TextBase}>
                      You don&apos;t have any objects with this tag yet. Tag
                      more objects to modify the sequence here.
                    </Text>
                  </div>

                  <div className={styles.field}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.label}
                    >
                      Preview
                    </Text>
                    <div className={styles.preview}>
                      <Tag
                        label={tagName || ''}
                        color={activeColor || defaultColor}
                        className={styles.tag}
                      />
                    </div>
                  </div>

                  {isEdit && (
                    <div
                      className={classNames(styles.field, styles.delete)}
                      onClick={handleDeleteClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleDeleteClick();
                        }
                      }}
                    >
                      <div className={styles.label}>
                        <DeleteIcon />
                        <Text variant={TypographyVariant.TextBaseSemibold}>
                          Delete tag
                        </Text>
                      </div>
                      <ArrowIcon className={styles.arrow} />
                    </div>
                  )}
                </>
              )}
            </div>

            <InkLine seed={7} className={styles.footRule} />
            <div className={styles.footer}>
              <Button
                label="Cancel"
                onClick={e => {
                  e.preventDefault();

                  if (showDeleteConfirmation || showCreateSuccessConfirmation) {
                    return;
                  }

                  if (activeTag) {
                    onTagSelect?.(null);
                  } else {
                    close();
                  }
                }}
                type={ButtonType.Secondary}
                size={ButtonSize.Wide}
                ariaLabel="Cancel"
                className={styles.close}
                disabled={isSubmitting}
              />
              {!isSelectTag && (
                <Button
                  label={isEdit ? 'Save' : 'Create'}
                  buttonType="submit"
                  type={ButtonType.Primary}
                  size={ButtonSize.Wide}
                  ariaLabel={isEdit ? 'Save' : 'Create tag'}
                  className={styles.close}
                  disabled={isSubmitting}
                />
              )}
            </div>
          </form>
        </Modal>
      )}

      {showDeleteConfirmation && (
        <ConfirmationModal
          variant="delete"
          icon={IconName.Info}
          title={`Are you sure you want to delete ${tagName || 'this'} tag?`}
          text="This action is irreversible."
          actionButtonLabel="Delete"
          actionButtonType={ButtonType.Warning}
          onClose={() => {
            setShowDeleteConfirmation(false);
          }}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}

      {showCreateSuccessConfirmation && (
        <ConfirmationModal
          variant="success"
          icon={IconName.Info}
          title="New tag has been created !"
          text="New tag was successfully created"
          actionButtonLabel="Go Back"
          actionButtonType={ButtonType.Secondary}
          onClose={() => {
            setShowCreateSuccessConfirmation(false);
            onClose();
          }}
          onConfirm={() => {
            setShowCreateSuccessConfirmation(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
