import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';

import { KEEPSIMPLE_URL, SHELF_FULL_MESSAGE } from '@constants/library/common';

import type {
  Difficulty,
  IObject,
  OverallRating,
} from '@local-types/library/object';

import { useClickOutside } from '@hooks/library/useClickOutside';

import {
  formatObjectDate,
  formatObjectDuration,
} from '@lib/library/objectMeta';
import { objectSlug } from '@lib/library/objectSlug';
import { isShelfFullError } from '@lib/library/shelfFull';
import { sanitizeHtml } from '@lib/sanitizeHtml';

import { deleteObject } from '@api/library/object/deleteObject';
import { updateObject } from '@api/library/object/updateObject';

import {
  CalendarIcon,
  CloseIcon,
  DeleteIcon,
  DotsVerticalIcon,
  EditIcon,
  ShareIcon,
} from '@icons/library/svg';

import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { IconName } from '@components/library/atoms/Icon';
import { InkLine } from '@components/library/atoms/InkLine';
import {
  TagType,
  Text,
  TypographyVariant,
} from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
  IconPosition,
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

// Canonical public host for shareable links — env-driven in staging/prod,
// falling back to the production domain (mirrors ShareSelectionPanel).
const SHARE_BASE_URL = process.env.NEXT_PUBLIC_DOMAIN ?? KEEPSIMPLE_URL;

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

  const [shareCopied, setShareCopied] = useState(false);

  const { currentShelves } = useGlobalState();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useClickOutside(closeMenu);

  // TODO: add dedicated route for shareable object URLs (e.g. /library/[username]/objects/[id]).
  // For now this modal is opened imperatively from a card click — no URL state.
  const guardedOnClose = useCallback(() => {
    if (deleteLoading || deleting) return;
    onClose();
  }, [deleteLoading, deleting, onClose]);

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
      // The parent is told when the success card closes: telling it now
      // unmounted this modal (the object leaves the shelf) before the card
      // could show.
      setDeleteSuccess(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to delete. Please try again.';
      setDeleteError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${SHARE_BASE_URL}/library/${ownerUsername}/${objectSlug(object)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API is unavailable on insecure origins / older browsers —
      // fall back to a throwaway textarea + execCommand so copy still works.
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Fall back to `defaultShelfId` (the shelf this object is rendered under):
  // PUT responses don't populate the `shelf` relation, so after a rating edit
  // `attributes.shelf?.data?.id` can be empty — without the fallback the
  // current shelf leaks back into the Move-To options.
  const currentShelfId = attributes.shelf?.data?.id ?? defaultShelfId;

  // Move-To targets come from the viewed library's own shelves (published to
  // GlobalState by LibraryTemplate), not a global `/single-shelves` fetch —
  // that returned every user's public shelves, so the dropdown offered foreign
  // shelves the backend then 403s on move. Scope to this object's type since a
  // book can't move into a video shelf.
  const ownShelves = useMemo(
    () => currentShelves.filter(s => s.attributes.type === objectType),
    [currentShelves, objectType],
  );

  const moveToOptions = useMemo(() => {
    return ownShelves
      .filter(s => s.id !== currentShelfId)
      .map(s => ({ value: String(s.id), label: s.attributes.name }));
  }, [ownShelves, currentShelfId]);

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

  // The last values the server accepted, so a failed save falls back to
  // them and not to whatever the modal opened with.
  const savedRating = useRef({
    overall: attributes.overall,
    difficulty: attributes.difficulty,
  });

  const persistRating = async (next: {
    overall?: OverallRating;
    difficulty?: Difficulty;
  }) => {
    setRatingError(null);
    try {
      const res = await updateObject(id, next);
      savedRating.current = { ...savedRating.current, ...next };
      onUpdated?.(preserveRelations(res.data));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Could not save your rating.';
      setRatingError(message);
      // Revert optimistic state on failure.
      setOverallRating(savedRating.current.overall);
      setDifficulty(savedRating.current.difficulty);
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
    const targetShelf = ownShelves.find(s => s.id === targetId);
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
                type: objectType,
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
      // The target shelf may already hold 21 objects — the backend rejects the
      // move with a 400. Surface the dedicated full-shelf copy.
      const message = isShelfFullError(e)
        ? SHELF_FULL_MESSAGE
        : e instanceof Error
          ? e.message
          : 'Could not move this item.';
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
  // Prefer the live shelf from GlobalState (matched by id) so a rename reflects
  // instantly — the object's embedded `shelf.data` is frozen at fetch time.
  const liveShelf = currentShelves.find(s => s.id === currentShelfId);
  const shelfDisplayName =
    liveShelf?.attributes.name ??
    shelfData?.attributes.name ??
    attributes.shelfName ??
    '—';
  // The object's own position within its shelf — not the shelf's order. Siblings
  // arrive already sorted by `order` ASC, so the array index is the true rank
  // (contiguous 1..N even when persisted `order` values have gaps). Fall back to
  // the object's raw `order` when siblings weren't passed.
  const positionIndex = shelfObjects?.findIndex(o => o.id === id) ?? -1;
  // Without siblings there is no rank to show: the raw persisted `order`
  // has gaps and would name a different position than the shelf does.
  const objectPosition = positionIndex >= 0 ? positionIndex : undefined;
  const publishedFormatted = formatObjectDate(attributes.publicationDate);
  const sourceLabel =
    attributes.source && attributes.source.length > 0 ? attributes.source : '—';
  const durationLabel = formatObjectDuration(attributes.duration);

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
        onCancel={() => setEditing(false)}
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

          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={close}
          >
            <CloseIcon width={24} height={24} />
          </button>
        </div>
        {/* Same drawn rule as the sidebar sections, in place of the boxed
            1px header border. */}
        <InkLine seed={4} className={styles.headerRule} />

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

            {/* Author sits beside the actions so the copy button costs no
                row of its own above the cover. */}
            <div className={styles.identityRow}>
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
              <div className={styles.actions}>
                <Button
                  type={ButtonType.Primary}
                  size={ButtonSize.Default}
                  className={styles.shareButton}
                  label={shareCopied ? 'Copied' : 'Copy URL'}
                  ariaLabel={shareCopied ? 'Link copied' : 'Copy URL'}
                  Icon={<ShareIcon />}
                  iconPosition={IconPosition.Right}
                  onClick={handleShare}
                />
                {isOwner && (
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
                          <Text variant={TypographyVariant.TextBase}>
                            Delete
                          </Text>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

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
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(attributes.description),
                  }}
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
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.rowLabel}
                >
                  Tags
                </Text>
                <div className={styles.tags}>
                  {tagsList.map(t => (
                    <Tag
                      key={t.id}
                      label={t.attributes.name}
                      color={t.attributes.color}
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
                <Text
                  variant={TypographyVariant.TextBase}
                  className={styles.destinationLine}
                >
                  <span className={styles.destinationKey}>SHELF:</span>{' '}
                  {shelfDisplayName}
                </Text>
                <Text
                  variant={TypographyVariant.TextBase}
                  className={styles.destinationLine}
                >
                  <span className={styles.destinationKey}>Position:</span>{' '}
                  {objectPosition !== undefined
                    ? String(objectPosition + 1)
                    : '—'}
                </Text>
              </div>
            </div>

            {isOwner && (
              <div className={styles.row}>
                <Dropdown
                  value={moveToShelfId}
                  onChange={handleMoveToChange}
                  triggerClassName={styles.moveToTrigger}
                  options={moveToOptions}
                  placeholder={
                    moveToOptions.length === 0
                      ? 'No other shelves of this type'
                      : moveLoading
                        ? 'Moving…'
                        : 'Move To'
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
                  itemLabel={objectType}
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
          text="This action is irreversible."
          error={deleteError ?? undefined}
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
            onDeleted?.(id);
            onClose();
          }}
          onConfirm={() => {
            setDeleteSuccess(false);
            onDeleted?.(id);
            onClose();
          }}
        />
      )}
    </>
  );
}
