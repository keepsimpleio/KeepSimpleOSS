import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, {
  JSX,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  MAX_OBJECTS_PER_SHELF,
  SHELF_NAME_MAX_LENGTH,
} from '@constants/library/common';

import type { IObject, ObjectType } from '@local-types/library/object';
import type { ShelfVisibility } from '@local-types/library/shelf';

import { renderBoardTile } from '@lib/library/brush';
import { objectIdFromSlug, objectSlug } from '@lib/library/objectSlug';

import { deleteShelf } from '@api/library/shelf/deleteShelf';
import { updateShelf } from '@api/library/shelf/updateShelf';

import {
  ArrowIcon,
  AudioIcon,
  BookIcon,
  PlusIcon,
  SettingsIcon,
  VideoIcon,
} from '@icons/library/svg';

import { useShareSelection } from '@components/Context/library/ShareSelectionContext';
import { CharCount } from '@components/library/atoms/CharCount';
import { IconName } from '@components/library/atoms/Icon';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { WashStroke } from '@components/library/atoms/WashStroke';
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

  // Backend caps a shelf at 21 objects (all types combined). Pre-disable the
  // Add control once the shelf is full — the backend stays the source of truth
  // (AddObjectModal still surfaces the 400), this just stops a doomed attempt.
  const atObjectLimit = objects.length >= MAX_OBJECTS_PER_SHELF;

  const router = useRouter();
  // The opened object is addressed by the URL, not local state: the last path
  // segment is the object slug (see objectSlug). We match on the slug's trailing
  // id so the right shelf — the one actually holding that object — renders the
  // overview, with its real shelf context, and a title edit can't orphan the URL.
  const usernameParam = router.query.username;
  const urlUsername = Array.isArray(usernameParam)
    ? usernameParam[0]
    : (usernameParam ?? '');
  const objectParam = router.query.object;
  const activeSlug = Array.isArray(objectParam) ? objectParam[0] : objectParam;
  const activeObjectId = objectIdFromSlug(activeSlug);

  // Wood-grain tile for the board, painted once per page (module-cached in
  // brush.ts) and applied client-side; SSR falls back to the CSS gradient.
  const [boardTile, setBoardTile] = useState<string | null>(null);
  useEffect(() => {
    setBoardTile(renderBoardTile());
  }, []);

  const [isAddOpen, setIsAddOpen] = useState(false);
  // Selection is shared across all shelves (one share link spans the whole
  // library), so it lives in context rather than per-shelf local state.
  const {
    isSelected,
    toggle: toggleSelection,
    selectMany,
    removeMany,
    limitReached,
  } = useShareSelection();
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

  // Horizontal scroller: keep every card on one row. When the row overflows we
  // expose the styled scrollbar (`.scrollable`) so the overflow is discoverable
  // by drag/swipe.
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

  const isOverflowing = canScrollLeft || canScrollRight;

  // Advance one card per click. The stride is the distance between two adjacent
  // slots (card width + gap); with a single card fall back to its own width, and
  // with none to most of a viewport.
  const scrollJump = (direction: -1 | 1) => {
    const el = itemsRef.current;
    if (!el) return;
    const slots = cardsRef.current?.children;
    let step = el.clientWidth * 0.8;
    if (slots && slots.length > 0) {
      const first = slots[0] as HTMLElement;
      step =
        slots.length > 1
          ? (slots[1] as HTMLElement).offsetLeft - first.offsetLeft
          : first.offsetWidth;
    }
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const closeRename = useCallback(() => {
    if (renameLoading) return;
    setRenameOpen(false);
    setRenameError(null);
  }, [renameLoading]);
  const { closeRef: renameCloseRef, close: closeRenameAnimated } =
    useModalClose(closeRename);

  const openAdd = () => {
    if (atObjectLimit) return;
    setIsAddOpen(true);
  };
  const closeAdd = () => setIsAddOpen(false);

  // Open/close are URL transitions, kept shallow so the library underneath is
  // never refetched or unmounted — only the overview modal appears/disappears
  // over the current page. `scroll: false` keeps the shelf scroll position.
  const openObject = (object: IObject) => {
    void router.push(
      `/library/${encodeURIComponent(urlUsername)}/${objectSlug(object)}`,
      undefined,
      { shallow: true, scroll: false },
    );
  };
  const closeObject = () => {
    void router.push(`/library/${encodeURIComponent(urlUsername)}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // The object this shelf currently owns *and* the URL points at, if any.
  const activeObject =
    activeObjectId != null
      ? (objects.find(o => o.id === activeObjectId) ?? null)
      : null;

  // "Select shelf" bulk-toggles every object on this shelf into the share
  // selection. It's owner-only and stays visible regardless of visibility — the
  // private/public toggle only governs guest access, not the owner's toolbar.
  // The share backend 400s on non-public objects, so on a private shelf the
  // button is shown but disabled (with a tooltip) rather than vanishing. When
  // all are already selected it clears them; otherwise it adds them (selectMany
  // stops at the cap).
  const allSelected =
    objects.length > 0 && objects.every(o => isSelected(o.id));
  const selectShelfDisabled =
    visibility !== 'public' ||
    objects.length === 0 ||
    (!allSelected && limitReached);
  const handleSelectShelf = () => {
    if (allSelected) removeMany(objects.map(o => o.id));
    else selectMany(objects);
  };

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
      // Only public-shelf objects are shareable. Going private strips this
      // shelf's objects from the share selection now, so the selection never
      // carries objects the backend would reject when the link is minted.
      if (value === 'private') {
        removeMany(objects.map(o => o.id));
      }
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
    // No need to track the object locally — it flows back through `objects` and
    // the URL still points at its id, so the overview re-renders with the edit.
    onObjectUpdated?.(shelf.id, updated);
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

          {/* Pigment accent cycles by shelf id, so sibling shelves differ and
              the colour survives reorders. */}
          <span className={styles.titleWrap}>
            <WashStroke
              accent={shelf.id}
              alpha={0.16}
              className={styles.titleStroke}
            />
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
          </span>
        </div>

        <div className={styles.right}>
          {isOwner && (
            <span
              className={styles.selectShelfWrap}
              title={
                visibility !== 'public'
                  ? 'Make this shelf public to add its items to a share link.'
                  : undefined
              }
            >
              <Button
                label={allSelected ? 'Deselect shelf' : 'Select shelf'}
                ariaLabel={allSelected ? 'Deselect shelf' : 'Select shelf'}
                onClick={handleSelectShelf}
                disabled={selectShelfDisabled}
                type={ButtonType.Secondary}
                size={ButtonSize.Default}
                className={styles.button}
                labelClassName={styles.text}
              />
            </span>
          )}

          {isOwner && (
            <span className={styles.count}>
              {objects.length}/{MAX_OBJECTS_PER_SHELF}
            </span>
          )}

          {isOwner && (
            <span
              className={styles.addWrap}
              title={
                atObjectLimit
                  ? `This shelf is full (max ${MAX_OBJECTS_PER_SHELF} items). Delete an item to add a new one.`
                  : undefined
              }
            >
              <Button
                label={`Add ${typeLabel}`}
                ariaLabel={`Add ${typeLabel}`}
                onClick={openAdd}
                type={ButtonType.Text}
                size={ButtonSize.Default}
                Icon={<PlusIcon />}
                iconPosition={IconPosition.Right}
                className={styles.button}
                disabled={atObjectLimit}
              />
            </span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {isOverflowing && (
          <>
            <Button
              className={classNames(styles.arrow, styles.arrowLeft)}
              onClick={() => scrollJump(-1)}
              type={ButtonType.Secondary}
              Icon={<ArrowIcon />}
              ariaLabel={`Scroll ${typeLabel}s left`}
              disabled={!canScrollLeft}
            />
            <Button
              className={styles.arrow}
              onClick={() => scrollJump(1)}
              type={ButtonType.Secondary}
              Icon={<ArrowIcon />}
              ariaLabel={`Scroll ${typeLabel}s right`}
              disabled={!canScrollRight}
            />
          </>
        )}
        <div
          className={classNames(styles.items, {
            [styles.scrollable]: isOverflowing,
          })}
          ref={itemsRef}
        >
          {objects.length === 0 ? (
            <div className={styles.empty}>
              <WashStroke accent={shelf.id + 1} className={styles.emptyWash} />
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
                  disabled={atObjectLimit}
                />
              )}
            </div>
          ) : (
            <div className={styles.cards} ref={cardsRef}>
              {objects.map(obj => {
                const selected = isSelected(obj.id);
                // Only the owner can build a share link, and only public-shelf
                // objects are shareable — so hide the Select chip elsewhere.
                const canSelect = isOwner && visibility === 'public';
                const onSelectToggle = canSelect
                  ? () => toggleSelection(obj)
                  : undefined;
                const card =
                  shelfType === 'video' ? (
                    <VideoCard
                      object={obj}
                      onClick={openObject}
                      selected={selected}
                      onSelectToggle={onSelectToggle}
                      selectDisabled={limitReached}
                    />
                  ) : shelfType === 'audio' ? (
                    <AudioCard
                      object={obj}
                      onClick={openObject}
                      selected={selected}
                      onSelectToggle={onSelectToggle}
                      selectDisabled={limitReached}
                    />
                  ) : (
                    <BookCard
                      object={obj}
                      onClick={openObject}
                      selected={selected}
                      onSelectToggle={onSelectToggle}
                      selectDisabled={limitReached}
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
        {/* The board the objects stand on: a once-painted wood-grain tile
            (top surface, front edge, seam) repeating across any width, with
            a soft fall of shadow onto the paper. */}
        <div
          className={styles.board}
          aria-hidden="true"
          style={
            boardTile ? { backgroundImage: `url(${boardTile})` } : undefined
          }
        />
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
              <CharCount
                current={renameValue.length}
                max={SHELF_NAME_MAX_LENGTH}
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
