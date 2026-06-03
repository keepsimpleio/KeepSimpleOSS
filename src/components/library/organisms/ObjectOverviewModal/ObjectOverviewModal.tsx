import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';

import type {
  Difficulty,
  IObject,
  OverallRating,
} from '@local-types/library/object';
import type { IShelf } from '@local-types/library/shelf';

import { useClickOutside } from '@hooks/library/useClickOutside';

import { deleteObject } from '@api/library/object/deleteObject';
import { updateObject } from '@api/library/object/updateObject';
import { getShelvesList } from '@api/library/shelf/getShelvesList';

import {
  CalendarIcon,
  CloseIcon,
  DeleteIcon,
  DotsVerticalIcon,
  EditIcon,
  ShareIcon,
} from '@icons/library/svg';

import { IconName } from '@components/library/atoms/Icon';
import {
  TagType,
  Text,
  TypographyVariant,
} from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { ConfirmationModal } from '@components/library/molecules/ConfirmationModal';
import { Dropdown } from '@components/library/molecules/Dropdown';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { RatingBox } from '@components/library/molecules/RatingBox';
import { Tag } from '@components/library/molecules/Tag';
import { AddObjectModal } from '@components/library/organisms/AddObjectModal';

import { overviewConfigByType } from './ObjectOverviewModal.config';
import type { ObjectOverviewModalProps } from './ObjectOverviewModal.types';

import styles from './ObjectOverviewModal.module.scss';

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds))
    return '—';
  const total = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function ObjectOverviewModal(
  props: ObjectOverviewModalProps,
): JSX.Element {
  const {
    object,
    isOwner,
    ownerUsername,
    shelfObjects,
    defaultShelfId,
    onClose,
    onUpdated,
    onDeleted,
    onObjectsReordered,
  } = props;
  const { id, attributes } = object;
  const objectType = attributes.type;
  const config = overviewConfigByType[objectType];
  // Audio/video titles double as a hidden link to the user-provided source URL.
  const titleHref =
    (objectType === 'audio' || objectType === 'video') && attributes.sourceUrl
      ? attributes.sourceUrl
      : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [overallRating, setOverallRating] = useState<OverallRating | undefined>(
    attributes.overall,
  );
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    attributes.difficulty,
  );
  const [ratingError, setRatingError] = useState<string | null>(null);

  const [moveToShelfId, setMoveToShelfId] = useState<string | undefined>();
  const [moveLoading, setMoveLoading] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);

  const [shelfOptions, setShelfOptions] = useState<IShelf[]>([]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useClickOutside(closeMenu);

  // TODO: add dedicated route for shareable object URLs (e.g. /library/[username]/objects/[id]).
  // For now this modal is opened imperatively from a card click — no URL state.
  const guardedOnClose = useCallback(() => {
    if (deleteLoading) return;
    onClose();
  }, [deleteLoading, onClose]);

  const { closeRef, close } = useModalClose(guardedOnClose);

  const handleEdit = () => {
    setMenuOpen(false);
    setEditing(true);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    setDeleting(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteObject(id);
      setDeleting(false);
      setDeleteSuccess(true);
      onDeleted?.(id);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to delete. Please try again.';
      setDeleteError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShare = () => {
    // TODO: Implement Share when sharing route + tokens exist.
    // Likely: copy a public URL to clipboard like /share/objects/<slug or shareToken>.
    // Depends on a public-read endpoint or signed URL from backend.
  };

  const currentShelfId = attributes.shelf?.data?.id;

  useEffect(() => {
    if (!isOwner) return;
    let cancelled = false;
    getShelvesList(objectType).then(res => {
      if (cancelled) return;
      setShelfOptions(res?.data ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [isOwner, objectType]);

  const moveToOptions = useMemo(() => {
    return shelfOptions
      .filter(s => s.id !== currentShelfId)
      .map(s => ({ value: String(s.id), label: s.attributes.name }));
  }, [shelfOptions, currentShelfId]);

  // PUT responses don't populate relations we didn't touch, so a rating-only
  // update drops cover/tags/shelf from the response. Carry them forward from
  // the original object before propagating, otherwise the card visually
  // loses its cover every time the user changes a rating.
  const preserveRelations = (next: IObject): IObject => ({
    ...next,
    attributes: {
      ...next.attributes,
      coverImage: next.attributes.coverImage?.data
        ? next.attributes.coverImage
        : attributes.coverImage,
      tags: next.attributes.tags?.data?.length
        ? next.attributes.tags
        : attributes.tags,
      shelf: next.attributes.shelf?.data
        ? next.attributes.shelf
        : attributes.shelf,
      shelfName: next.attributes.shelfName ?? attributes.shelfName,
    },
  });

  const persistRating = async (next: {
    overall?: OverallRating;
    difficulty?: Difficulty;
  }) => {
    setRatingError(null);
    try {
      const res = await updateObject(id, next);
      onUpdated?.(preserveRelations(res.data));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Could not save your rating.';
      setRatingError(message);
      // Revert optimistic state on failure.
      setOverallRating(attributes.overall);
      setDifficulty(attributes.difficulty);
    }
  };

  const handleOverallChange = (value: OverallRating) => {
    setOverallRating(value);
    persistRating({ overall: value });
  };

  const handleDifficultyChange = (value: Difficulty) => {
    setDifficulty(value);
    persistRating({ difficulty: value });
  };

  const handleMoveToChange = async (value: string) => {
    if (!value) return;
    const targetId = Number(value);
    if (!Number.isFinite(targetId)) return;
    const targetShelf = shelfOptions.find(s => s.id === targetId);
    if (!targetShelf) return;
    setMoveToShelfId(value);
    setMoveLoading(true);
    setMoveError(null);
    try {
      const res = await updateObject(id, { shelf: targetId });
      // Preserve cover/tags from the original, then override shelf with the
      // target shelf info (PUT doesn't populate it). Shelf.tsx checks the
      // resulting shelf.data.id to fire onObjectMoved instead of onObjectUpdated.
      const withRelations = preserveRelations(res.data);
      const moved: IObject = {
        ...withRelations,
        attributes: {
          ...withRelations.attributes,
          shelf: {
            data: {
              id: targetShelf.id,
              attributes: {
                name: targetShelf.attributes.name,
                type: targetShelf.attributes.type,
                order: targetShelf.attributes.order,
              },
            },
          },
          // Server cascades `shelfName` from `shelf.name` — mirror that.
          shelfName: targetShelf.attributes.name,
        },
      };
      onUpdated?.(moved);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not move object.';
      setMoveError(message);
      setMoveToShelfId(undefined);
    } finally {
      setMoveLoading(false);
    }
  };

  const coverUrl = resolveStrapiUrl(
    attributes.coverImage?.data?.attributes.url,
  );
  const tagsList = attributes.tags?.data ?? [];
  const shelfData = attributes.shelf?.data;
  const shelfDisplayName =
    shelfData?.attributes.name ?? attributes.shelfName ?? '—';
  const shelfPosition = shelfData?.attributes.order;
  const publishedFormatted = formatDate(attributes.publicationDate);
  const sourceLabel =
    attributes.source && attributes.source.length > 0 ? attributes.source : '—';
  const durationLabel = formatDuration(attributes.duration);

  // Edit mode swaps the modal entirely; AddObjectModal manages its own success popup.
  if (editing) {
    return (
      <AddObjectModal
        objectType={objectType}
        isCreate={false}
        object={object}
        shelfObjects={shelfObjects}
        defaultShelfId={defaultShelfId}
        onClose={() => {
          setEditing(false);
          onClose();
        }}
        onCreated={updated => {
          onUpdated?.(updated);
        }}
        onReordered={onObjectsReordered}
      />
    );
  }

  return (
    <>
      <Modal
        className={styles.modal}
        onClose={guardedOnClose}
        closeRef={closeRef}
      >
        <div className={styles.header}>
          <Text
            tag={TagType.H2}
            variant={TypographyVariant.SubtitleSecondaryAlt}
            className={styles.title}
          >
            {config.modalTitle}
          </Text>

          <div className={styles.actions}>
            {isOwner && (
              <>
                <Button
                  type={ButtonType.Primary}
                  size={ButtonSize.Default}
                  label="Share"
                  ariaLabel="Share"
                  Icon={<ShareIcon />}
                  onClick={handleShare}
                />
                <div ref={menuRef} className={styles.menuWrapper}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label="More actions"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(prev => !prev)}
                  >
                    <DotsVerticalIcon />
                  </button>
                  {menuOpen && (
                    <div role="menu" className={styles.menu}>
                      <button
                        type="button"
                        role="menuitem"
                        className={styles.menuItem}
                        onClick={handleEdit}
                      >
                        <EditIcon />
                        <Text variant={TypographyVariant.TextBase}>Edit</Text>
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className={classNames(styles.menuItem, styles.danger)}
                        onClick={handleDelete}
                      >
                        <DeleteIcon />
                        <Text variant={TypographyVariant.TextBase}>Delete</Text>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Close"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.left}>
            <div
              className={classNames(styles.cover, styles[config.coverShape])}
            >
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.coverImage}
                  src={coverUrl}
                  alt={attributes.title}
                />
              ) : (
                <span className={styles.coverPlaceholder}>No cover</span>
              )}
            </div>

            {config.showSourceDurationRow && (
              <div className={styles.sourceDurationRow}>
                <div className={styles.metaCell}>
                  <Text
                    variant={TypographyVariant.TextSmall}
                    className={styles.metaLabel}
                  >
                    Source
                  </Text>
                  <Text
                    variant={TypographyVariant.TextBase}
                    className={styles.metaValue}
                  >
                    {sourceLabel}
                  </Text>
                </div>
                <div className={styles.metaCell}>
                  <Text
                    variant={TypographyVariant.TextSmall}
                    className={styles.metaLabel}
                  >
                    Duration
                  </Text>
                  <Text
                    variant={TypographyVariant.TextBase}
                    className={styles.metaValue}
                  >
                    {durationLabel}
                  </Text>
                </div>
              </div>
            )}
          </div>

          <div className={styles.right}>
            {titleHref ? (
              <a
                href={titleHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.objectTitleLink}
              >
                <Text
                  tag={TagType.H3}
                  variant={TypographyVariant.TitleSecondaryBold}
                  className={styles.objectTitle}
                >
                  {attributes.title}
                </Text>
              </a>
            ) : (
              <Text
                tag={TagType.H3}
                variant={TypographyVariant.TitleSecondaryBold}
                className={styles.objectTitle}
              >
                {attributes.title}
              </Text>
            )}

            {attributes.author && (
              <div className={styles.row}>
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.rowLabel}
                >
                  Author
                </Text>
                <Text
                  variant={TypographyVariant.TextBase}
                  className={styles.rowValue}
                >
                  {attributes.author}
                </Text>
              </div>
            )}

            {publishedFormatted && (
              <div className={styles.row}>
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.rowLabel}
                >
                  Published
                </Text>
                <span className={styles.publishedValue}>
                  <CalendarIcon width={14} height={14} />
                  <Text variant={TypographyVariant.TextBase}>
                    {publishedFormatted}
                  </Text>
                </span>
              </div>
            )}

            <div className={styles.row}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.rowLabel}
              >
                {config.descriptionLabel}
              </Text>
              {attributes.description ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: attributes.description }}
                />
              ) : (
                <Text
                  variant={TypographyVariant.TextBase}
                  className={styles.rowValue}
                >
                  {config.descriptionEmpty}
                </Text>
              )}
            </div>

            {tagsList.length > 0 && (
              <div className={styles.row}>
                <div className={styles.tagsHeader}>
                  <Text
                    variant={TypographyVariant.TextSmall}
                    className={styles.rowLabel}
                  >
                    Tags
                  </Text>
                  {isOwner && (
                    <button
                      type="button"
                      className={styles.tagsEditButton}
                      onClick={handleEdit}
                      aria-label="Edit tags"
                    >
                      <EditIcon width={14} height={14} />
                    </button>
                  )}
                </div>
                <div className={styles.tags}>
                  {tagsList.map(t => (
                    <Tag
                      key={t.id}
                      className={styles.tag}
                      label={t.attributes.name}
                      color={t.attributes.color}
                      onClick={isOwner ? handleEdit : undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.row}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.rowLabel}
              >
                Destination
              </Text>
              <div className={styles.destination}>
                <div className={styles.destinationCell}>
                  <Text
                    variant={TypographyVariant.TextSmall}
                    className={styles.rowLabel}
                  >
                    SHELF
                  </Text>
                  <Text
                    variant={TypographyVariant.TextBase}
                    className={styles.rowValue}
                  >
                    {shelfDisplayName}
                  </Text>
                </div>
                <div className={styles.destinationCell}>
                  <Text
                    variant={TypographyVariant.TextSmall}
                    className={styles.rowLabel}
                  >
                    Position
                  </Text>
                  <Text
                    variant={TypographyVariant.TextBase}
                    className={styles.rowValue}
                  >
                    {shelfPosition !== undefined ? String(shelfPosition) : '—'}
                  </Text>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className={styles.row}>
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.rowLabel}
                >
                  Move To
                </Text>
                <Dropdown
                  value={moveToShelfId}
                  onChange={handleMoveToChange}
                  options={moveToOptions}
                  placeholder={
                    moveToOptions.length === 0
                      ? 'No other shelves of this type'
                      : moveLoading
                        ? 'Moving…'
                        : 'Select a shelf'
                  }
                  disabled={moveToOptions.length === 0 || moveLoading}
                  portal
                />
                {moveError && <p className={styles.error}>{moveError}</p>}
              </div>
            )}

            {config.showRatingBox && (
              <>
                <RatingBox
                  username={ownerUsername}
                  overallRating={overallRating}
                  difficulty={difficulty}
                  onOverallChange={handleOverallChange}
                  onDifficultyChange={handleDifficultyChange}
                  readOnly={!isOwner}
                />
                {ratingError && <p className={styles.error}>{ratingError}</p>}
              </>
            )}
          </div>
        </div>
      </Modal>

      {deleting && (
        <ConfirmationModal
          variant="delete"
          title={`Are you sure you want to delete the object "${attributes.title}"?`}
          text={deleteError ?? 'This action is irreversible.'}
          actionButtonLabel={deleteLoading ? 'Deleting…' : 'Delete'}
          actionButtonType={ButtonType.Warning}
          isLoading={deleteLoading}
          onClose={() => {
            if (deleteLoading) return;
            setDeleting(false);
            setDeleteError(null);
          }}
          onConfirm={confirmDelete}
        />
      )}

      {deleteSuccess && (
        <ConfirmationModal
          variant="success"
          icon={IconName.Info}
          title={config.deleteSuccessTitle}
          text={config.deleteSuccessText}
          actionButtonLabel="Close"
          actionButtonType={ButtonType.Secondary}
          onClose={() => {
            setDeleteSuccess(false);
            onClose();
          }}
          onConfirm={() => {
            setDeleteSuccess(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
