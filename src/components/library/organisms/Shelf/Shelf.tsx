import classNames from 'classnames';
import Image from 'next/image';
import React, {
  JSX,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import type { IObject, ObjectType } from '@local-types/library/object';
import type { ShelfVisibility } from '@local-types/library/shelf';

import { deleteShelf } from '@api/library/shelf/deleteShelf';
import { updateShelf } from '@api/library/shelf/updateShelf';

import shelfBackground from '@icons/library/images/shelfBackground.png';
import {
  ArrowIcon,
  AudioIcon,
  BookIcon,
  PlusIcon,
  SettingsIcon,
  VideoIcon,
} from '@icons/library/svg';

import { IconName } from '@components/library/atoms/Icon';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { AudioCard } from '@components/library/molecules/AudioCard';
import { BookCard } from '@components/library/molecules/BookCard';
import {
  Button,
  ButtonSize,
  ButtonType,
  IconPosition,
} from '@components/library/molecules/Button';
import { ConfirmationModal } from '@components/library/molecules/ConfirmationModal';
import { Dropdown } from '@components/library/molecules/Dropdown';
import { Input } from '@components/library/molecules/Input';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { VideoCard } from '@components/library/molecules/VideoCard';
import { AddObjectModal } from '@components/library/organisms/AddObjectModal';
import { ObjectOverviewModal } from '@components/library/organisms/ObjectOverviewModal';

import type { ShelfProps } from './Shelf.types';

import styles from './Shelf.module.scss';

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// FLIP: when `orderKey` changes, glide each card slot from its previous
// position to its new one via the Web Animations API. Pure transient
// transforms — no dependency, no layout thrash, and a no-op under
// prefers-reduced-motion. Slots are matched across renders by `data-flip-id`.
function useFlipReorder(orderKey: string) {
  const ref = useRef<HTMLDivElement>(null);
  const prevRects = useRef<Map<string, DOMRect>>(new Map());

  useIsomorphicLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    const slots = Array.from(container.children) as HTMLElement[];
    const nextRects = new Map<string, DOMRect>();
    slots.forEach(slot => {
      const id = slot.dataset.flipId;
      if (id) nextRects.set(id, slot.getBoundingClientRect());
    });

    const prev = prevRects.current;
    prevRects.current = nextRects;

    // First paint (or a hidden shelf): nothing to animate from.
    if (prev.size === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    slots.forEach(slot => {
      const id = slot.dataset.flipId;
      if (!id) return;
      const before = prev.get(id);
      const after = nextRects.get(id);
      if (!before || !after) return;
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (dx === 0 && dy === 0) return;
      slot.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        { duration: 320, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
      );
    });
  }, [orderKey]);

  return ref;
}

const SHELF_TYPE_ICON: Record<string, JSX.Element> = {
  video: <VideoIcon />,
  book: <BookIcon />,
  audio: <AudioIcon />,
};

const SHELF_TYPE_LABEL: Record<string, string> = {
  video: 'video',
  book: 'book',
  audio: 'audio',
};

const SETTINGS_OPTIONS = [
  {
    value: 'privacy',
    label: 'Privacy',
    subOptions: [
      { value: 'private', label: 'Private' },
      { value: 'public', label: 'Public' },
    ],
  },
  { value: 'delete', label: 'Delete shelf' },
];

// Matches the single-shelf `name` constraint (`maxLength: 50`) in the backend schema.
const SHELF_NAME_MAX_LENGTH = 50;

export function Shelf(props: ShelfProps): JSX.Element {
  const {
    className,
    title,
    shelf,
    ownerUsername = '',
    isOwner = false,
    onObjectCreated,
    onObjectUpdated,
    onObjectDeleted,
    onShelfDeleted,
    onShelfRenamed,
    onObjectMoved,
    onObjectsReordered,
  } = props;
  const shelfType = shelf.attributes.type as ObjectType;
  // Render in persisted-order sequence. Strapi's populate doesn't sort the
  // relation, so without this the drag order (saved via reorderObjects) never
  // shows. Stable: objects with no `order` keep their natural position.
  const objects = [...(shelf.attributes.objects?.data ?? [])].sort(
    (a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0),
  );

  // Glide cards to their new slots when the persisted order changes (e.g. after
  // a save-time reorder) instead of snapping.
  const cardsRef = useFlipReorder(objects.map(o => o.id).join(','));

  const typeIcon = SHELF_TYPE_ICON[shelfType] ?? <BookIcon />;
  const typeLabel = SHELF_TYPE_LABEL[shelfType] ?? 'item';

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeObject, setActiveObject] = useState<IObject | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelected = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const [deleteShelfOpen, setDeleteShelfOpen] = useState(false);
  const [deleteShelfLoading, setDeleteShelfLoading] = useState(false);
  const [deleteShelfError, setDeleteShelfError] = useState<string | null>(null);
  const [deleteShelfSuccess, setDeleteShelfSuccess] = useState(false);
  const [visibility, setVisibility] = useState<ShelfVisibility>(
    (shelf.attributes.visibility ?? 'private') as ShelfVisibility,
  );
  const [shelfName, setShelfName] = useState(title ?? '');
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(title ?? '');
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);

  // Horizontal scroller: keep every card on one row and page through them with
  // the arrows. Arrows only show when the row actually overflows; each click
  // advances by one card width (+ the 24px gap).
  const itemsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncScrollState = useCallback(() => {
    const el = itemsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = itemsRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener('scroll', syncScrollState, { passive: true });
    const observer = new ResizeObserver(syncScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', syncScrollState);
      observer.disconnect();
    };
  }, [syncScrollState, objects.length]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = itemsRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>(`.${styles.cards} > *`);
    const step = firstCard ? firstCard.offsetWidth + 35 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const isOverflowing = canScrollLeft || canScrollRight;

  const closeRename = useCallback(() => {
    if (renameLoading) return;
    setRenameOpen(false);
    setRenameError(null);
  }, [renameLoading]);
  const { closeRef: renameCloseRef, close: closeRenameAnimated } =
    useModalClose(closeRename);

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);
  const openObject = (object: IObject) => setActiveObject(object);
  const closeObject = () => setActiveObject(null);

  const openRename = () => {
    setRenameError(null);
    setRenameValue(shelfName);
    setRenameOpen(true);
  };

  const handleSettingsChange = (value: string) => {
    if (value === 'delete') {
      setDeleteShelfError(null);
      setDeleteShelfOpen(true);
      return;
    }
    if (value === 'private' || value === 'public') {
      const previous = visibility;
      if (previous === value) return;
      setVisibility(value);
      updateShelf(shelf.id, { visibility: value }).catch(e => {
        console.error('[Shelf] failed to update visibility', e);
        setVisibility(previous);
      });
    }
  };

  const confirmRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === shelfName) {
      setRenameOpen(false);
      return;
    }
    setRenameLoading(true);
    setRenameError(null);
    try {
      await updateShelf(shelf.id, { name: trimmed });
      setShelfName(trimmed);
      onShelfRenamed?.(shelf.id, trimmed);
      setRenameOpen(false);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Failed to rename shelf. Please try again.';
      setRenameError(message);
    } finally {
      setRenameLoading(false);
    }
  };

  const confirmDeleteShelf = async () => {
    setDeleteShelfLoading(true);
    setDeleteShelfError(null);
    try {
      await deleteShelf(shelf.id);
      setDeleteShelfOpen(false);
      setDeleteShelfSuccess(true);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Failed to delete shelf. Please try again.';
      setDeleteShelfError(message);
    } finally {
      setDeleteShelfLoading(false);
    }
  };

  const handleCreated = (created: IObject) => {
    onObjectCreated?.(shelf.id, created);
    closeAdd();
  };

  const handleUpdated = (updated: IObject) => {
    const newShelfId = updated.attributes.shelf?.data?.id;
    // Move detected — pop out of this shelf, drop into the new one, and
    // close the overview so the user sees the move take effect.
    if (newShelfId != null && newShelfId !== shelf.id) {
      onObjectMoved?.(shelf.id, newShelfId, updated);
      closeObject();
      return;
    }
    onObjectUpdated?.(shelf.id, updated);
    setActiveObject(updated);
  };

  const handleDeleted = (id: number) => {
    onObjectDeleted?.(shelf.id, id);
    closeObject();
  };

  return (
    <div
      id={`shelf-${shelf.id}`}
      className={classNames(className, styles.wrapper)}
    >
      <div className={styles.header}>
        <div className={styles.left}>
          {isOwner && (
            <Dropdown
              className={styles.settingsDropdown}
              menuClassName={styles.settingsMenu}
              triggerClassName={styles.settingsTrigger}
              options={SETTINGS_OPTIONS}
              onChange={handleSettingsChange}
              value={visibility}
              customHeader={
                <Button
                  className={styles.settings}
                  onClick={() => {}}
                  type={ButtonType.Secondary}
                  Icon={<SettingsIcon />}
                  ariaLabel="Shelf settings"
                />
              }
            />
          )}

          <div className={styles.icon}>{typeIcon}</div>

          {isOwner ? (
            <button
              type="button"
              className={styles.nameButton}
              onClick={openRename}
              aria-label="Edit shelf name"
            >
              <Text variant={TypographyVariant.TextBase}>{shelfName}</Text>
            </button>
          ) : (
            <Text variant={TypographyVariant.TextBase}>{shelfName}</Text>
          )}
        </div>

        <div className={styles.right}>
          <Button
            label="Select shelf"
            ariaLabel="Select shelf"
            onClick={() => {}}
            type={ButtonType.Secondary}
            size={ButtonSize.Default}
            className={styles.button}
            labelClassName={styles.text}
          />

          {isOwner && (
            <Button
              label={`Add ${typeLabel}`}
              ariaLabel={`Add ${typeLabel}`}
              onClick={openAdd}
              type={ButtonType.Text}
              size={ButtonSize.Default}
              Icon={<PlusIcon />}
              iconPosition={IconPosition.Right}
              className={styles.button}
            />
          )}
        </div>
      </div>

      <div className={styles.content}>
        {isOverflowing && (
          <Button
            className={classNames(styles.arrow, styles.arrowLeft)}
            onClick={() => scrollByCard(-1)}
            type={ButtonType.Secondary}
            Icon={<ArrowIcon />}
            ariaLabel="Previous"
            disabled={!canScrollLeft}
          />
        )}
        <div
          className={classNames(styles.items, {
            [styles.scrollable]: isOverflowing,
          })}
          ref={itemsRef}
        >
          {objects.length === 0 ? (
            <div className={styles.empty}>
              <Text
                variant={TypographyVariant.TextBase}
                className={styles.emptyText}
              >
                {isOwner
                  ? `This shelf is empty - add the first ${typeLabel}`
                  : 'This shelf is empty'}
              </Text>
              {isOwner && (
                <Button
                  onClick={openAdd}
                  type={ButtonType.Secondary}
                  Icon={<PlusIcon />}
                  ariaLabel={`Add ${typeLabel}`}
                />
              )}
            </div>
          ) : (
            <div className={styles.cards} ref={cardsRef}>
              {objects.map(obj => {
                const selected = selectedIds.has(obj.id);
                const onSelectToggle = isOwner
                  ? () => toggleSelected(obj.id)
                  : undefined;
                const card =
                  shelfType === 'video' ? (
                    <VideoCard
                      object={obj}
                      onClick={openObject}
                      selected={selected}
                      onSelectToggle={onSelectToggle}
                    />
                  ) : shelfType === 'audio' ? (
                    <AudioCard
                      object={obj}
                      onClick={openObject}
                      selected={selected}
                      onSelectToggle={onSelectToggle}
                    />
                  ) : (
                    <BookCard
                      object={obj}
                      onClick={openObject}
                      selected={selected}
                      onSelectToggle={onSelectToggle}
                    />
                  );
                return (
                  <div
                    key={obj.id}
                    className={styles.cardSlot}
                    data-flip-id={String(obj.id)}
                  >
                    {card}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {isOverflowing && (
          <Button
            className={styles.arrow}
            onClick={() => scrollByCard(1)}
            type={ButtonType.Secondary}
            Icon={<ArrowIcon />}
            ariaLabel="Next"
            disabled={!canScrollRight}
          />
        )}

        <div className={styles.banner}>
          <Image src={shelfBackground} alt="" />
        </div>
      </div>

      {isOwner && isAddOpen && (
        <AddObjectModal
          objectType={shelfType}
          defaultShelfId={shelf.id}
          shelfObjects={objects}
          onClose={closeAdd}
          onCreated={handleCreated}
          onReordered={ordered => onObjectsReordered?.(shelf.id, ordered)}
        />
      )}

      {activeObject && (
        <ObjectOverviewModal
          object={activeObject}
          isOwner={isOwner}
          ownerUsername={ownerUsername}
          shelfObjects={objects}
          defaultShelfId={shelf.id}
          onClose={closeObject}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
          onObjectsReordered={ordered =>
            onObjectsReordered?.(shelf.id, ordered)
          }
        />
      )}

      {renameOpen && (
        <Modal
          className={styles.renameModal}
          title="Edit shelf name"
          onClose={closeRename}
          closeRef={renameCloseRef}
        >
          <div className={styles.renameWrapper}>
            <div className={styles.renameField}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.renameLabel}
              >
                Shelf name
              </Text>
              <Input
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !renameLoading) {
                    e.preventDefault();
                    void confirmRename();
                  }
                }}
                placeholder="My shelf"
                placeholderColor="#9E9E9E"
                ariaLabel="Shelf name"
                maxLength={SHELF_NAME_MAX_LENGTH}
              />
              {renameError && (
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.renameError}
                >
                  {renameError}
                </Text>
              )}
            </div>

            <div className={styles.renameFooter}>
              <Button
                label="Cancel"
                onClick={closeRenameAnimated}
                type={ButtonType.Secondary}
                size={ButtonSize.Wide}
                ariaLabel="Cancel"
              />
              <Button
                label={renameLoading ? 'Saving…' : 'Save'}
                onClick={confirmRename}
                type={ButtonType.Primary}
                size={ButtonSize.Wide}
                ariaLabel="Save shelf name"
                disabled={renameLoading || renameValue.trim().length === 0}
              />
            </div>
          </div>
        </Modal>
      )}

      {deleteShelfOpen && (
        <ConfirmationModal
          variant="delete"
          title={`Are you sure you want to delete "${shelfName}" shelf?`}
          text={
            deleteShelfError ??
            (objects.length > 0
              ? `This will permanently delete the shelf and all ${objects.length} ${typeLabel}${
                  objects.length === 1 ? '' : 's'
                } on it. This cannot be undone.`
              : 'This action is irreversible.')
          }
          actionButtonLabel={deleteShelfLoading ? 'Deleting…' : 'Delete'}
          actionButtonType={ButtonType.Warning}
          isLoading={deleteShelfLoading}
          onClose={() => {
            if (deleteShelfLoading) return;
            setDeleteShelfOpen(false);
            setDeleteShelfError(null);
          }}
          onConfirm={confirmDeleteShelf}
        />
      )}

      {deleteShelfSuccess && (
        <ConfirmationModal
          variant="success"
          icon={IconName.Info}
          title="Shelf deleted"
          text={`"${shelfName}" has been removed from the library.`}
          actionButtonLabel="Close"
          actionButtonType={ButtonType.Secondary}
          onClose={() => {
            setDeleteShelfSuccess(false);
            onShelfDeleted?.(shelf.id);
          }}
          onConfirm={() => {
            setDeleteShelfSuccess(false);
            onShelfDeleted?.(shelf.id);
          }}
        />
      )}
    </div>
  );
}
