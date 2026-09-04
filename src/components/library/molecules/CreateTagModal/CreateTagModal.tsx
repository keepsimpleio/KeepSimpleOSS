import { zodResolver } from '@hookform/resolvers/zod';
import { createTagSchema } from '@utils/library/schema/createTagSchema';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { tagColors } from '@constants/library/tags';

import { ArrowIcon, DeleteIcon, InfoIcon } from '@icons/library/svg';

import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { IconName } from '@components/library/atoms/Icon';
import { InkLine } from '@components/library/atoms/InkLine';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';
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
  const defaultColor = tagColors[0][0];
  const isSelectTag = isEdit && !activeTag;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateSuccessConfirmation, setShowCreateSuccessConfirmation] =
    useState(false);
  const [showEditSuccessConfirmation, setShowEditSuccessConfirmation] =
    useState(false);
  const [discardPrompt, setDiscardPrompt] = useState(false);

  // The objects that carry this tag, in shelf order, read off the library on
  // screen. The per-shelf sequence itself is set when editing an object
  // (step 2 shows it through the tag as a lens); here the owner sees where
  // the tag is used instead of a placeholder that claimed it was unused.
  const { currentShelves } = useGlobalState();
  const taggedObjects = useMemo(() => {
    if (!activeTag) return [];
    const rows: { id: number; title: string; shelf: string; order: number }[] =
      [];
    for (const shelf of currentShelves) {
      const objects = [...(shelf.attributes.objects?.data ?? [])].sort(
        (a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0),
      );
      objects.forEach((o, index) => {
        const carries = (o.attributes.tags?.data ?? []).some(
          t => t.id === activeTag.id,
        );
        if (carries) {
          rows.push({
            id: o.id,
            title: o.attributes.title,
            shelf: shelf.attributes.name,
            order: index + 1,
          });
        }
      });
    }
    return rows;
  }, [activeTag, currentShelves]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
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
      // The form fades out first; the Modal's close lands in requestClose,
      // where this flag turns it into the success card instead of leaving.
      successPending.current = isEdit ? 'edit' : 'create';
      close();
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
    setDeleteError(null);
    try {
      await onDelete();

      setShowDeleteConfirmation(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete tag:', error);
      setDeleteError('Could not delete the tag. Please try again.');
      setIsDeleting(false);
    }
  };

  // Closing a form with typed changes asks first; a clean form closes at once.
  const hasUnsavedWork = isDirty && !isSelectTag;
  const successPending = useRef<null | 'create' | 'edit'>(null);
  const requestClose = () => {
    if (successPending.current) {
      const kind = successPending.current;
      successPending.current = null;
      if (kind === 'create') setShowCreateSuccessConfirmation(true);
      else setShowEditSuccessConfirmation(true);
      return;
    }
    if (showDeleteConfirmation || showCreateSuccessConfirmation) return;
    if (hasUnsavedWork) {
      setDiscardPrompt(true);
      return;
    }
    onClose();
  };

  useEffect(() => {
    if (activeTag) {
      reset({
        name: activeTag.name || '',
        description: activeTag.description || '',
        color: activeTag.color || defaultColor,
      });
    }
  }, [activeTag, defaultColor, reset]);

  const { closeRef, close } = useModalClose(requestClose);

  return (
    <>
      {!showCreateSuccessConfirmation && !showEditSuccessConfirmation && (
        <Modal
          className={styles.modal}
          title={isEdit ? 'Edit tag' : 'Create a new tag'}
          onClose={requestClose}
          closeRef={closeRef}
        >
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className={styles.wrapper}>
              {isSelectTag ? (
                <div className={styles.noTagFound}>
                  {/* No heading over the row: the modal's own title says what
                      this is, and a row of tags asks to be tapped without
                      being told to. Screen readers get the label on the
                      group instead. */}
                  {tags.length > 0 && (
                    <div
                      className={styles.tagsList}
                      role="group"
                      aria-label="Select a tag to edit"
                    >
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
                            <button
                              type="button"
                              aria-label={`Colour ${groupIndex + 1}-${colorIndex + 1}`}
                              aria-pressed={activeColor === color}
                              key={colorIndex}
                              style={{ backgroundColor: color }}
                              className={classNames(styles.swatch, {
                                [styles.active]: activeColor === color,
                              })}
                              onClick={() => handleColorSelect(color)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    {errors.color && (
                      <p className={styles.error}>{errors.color.message}</p>
                    )}
                  </div>

                  {isEdit && (
                    <div className={styles.field}>
                      <div className={styles.labelWrapper}>
                        <Text
                          variant={TypographyVariant.TextSmall}
                          className={styles.label}
                        >
                          Where this tag is used
                        </Text>
                        <Tooltip
                          place="top"
                          tooltipContent="The order within a shelf is set when editing an object: step 2 shows the shelf's sequence through this tag."
                        >
                          <span
                            className={styles.infoIcon}
                            tabIndex={0}
                            aria-label="About tag sequence"
                          >
                            <InfoIcon />
                          </span>
                        </Tooltip>
                      </div>

                      {taggedObjects.length === 0 ? (
                        <Text variant={TypographyVariant.TextBase}>
                          No objects carry this tag yet. Add it to an object to
                          see it listed here.
                        </Text>
                      ) : (
                        <ul className={styles.taggedList}>
                          {taggedObjects.map(row => (
                            <li key={row.id} className={styles.taggedRow}>
                              <Text
                                variant={TypographyVariant.TextBase}
                                className={styles.taggedTitle}
                              >
                                {row.title}
                              </Text>
                              <Text
                                variant={TypographyVariant.TextSmall}
                                className={styles.taggedMeta}
                              >
                                {row.shelf} · #{row.order}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

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

                  if (hasUnsavedWork) {
                    setDiscardPrompt(true);
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
          title={`Are you sure you want to delete the "${tagName || 'this'}" tag?`}
          text="It will be removed from every object that carries it. This cannot be undone."
          error={deleteError ?? undefined}
          actionButtonLabel={isDeleting ? 'Deleting…' : 'Delete'}
          actionButtonType={ButtonType.Warning}
          onClose={() => {
            if (isDeleting) return;
            setShowDeleteConfirmation(false);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}

      {showEditSuccessConfirmation && (
        <ConfirmationModal
          variant="success"
          icon={IconName.Info}
          title="Tag updated"
          text="Your changes were saved."
          actionButtonLabel="Close"
          actionButtonType={ButtonType.Secondary}
          onClose={() => {
            setShowEditSuccessConfirmation(false);
            onClose();
          }}
          onConfirm={() => {
            setShowEditSuccessConfirmation(false);
            onClose();
          }}
        />
      )}

      {discardPrompt && (
        <ConfirmationModal
          variant="delete"
          title="Discard these changes?"
          text="What you typed in this form will be lost."
          actionButtonLabel="Discard"
          actionButtonType={ButtonType.Warning}
          onClose={() => setDiscardPrompt(false)}
          onConfirm={() => {
            setDiscardPrompt(false);
            if (activeTag) {
              onTagSelect?.(null);
              reset({ name: '', description: '', color: defaultColor });
            } else {
              onClose();
            }
          }}
        />
      )}

      {showCreateSuccessConfirmation && (
        <ConfirmationModal
          variant="success"
          icon={IconName.Info}
          title="New tag has been created!"
          text="Your tag was added to the library."
          actionButtonLabel="Close"
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
