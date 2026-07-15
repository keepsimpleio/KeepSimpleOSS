import {
  closestCenter,
  DndContext,
  type DragMoveEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import React, {
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MAX_SHELVES_PER_LIBRARY } from '@constants/library/common';

import type { StrapiSingleShelfEntry } from '@local-types/library/library';
import type { IReorderShelfEntry } from '@local-types/library/shelf';

import { reorderShelves } from '@api/library/shelf/reorderShelves';

import { ArrowIcon, PlusIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
  IconPosition,
} from '@components/library/molecules/Button';
import { Input } from '@components/library/molecules/Input';

import type { LibraryToolbarProps } from './LibraryToolbar.types';

import styles from './LibraryToolbar.module.scss';

// Keep jump pills compact: shelf names longer than 20 chars are clipped with
// an ellipsis. The full name stays in the aria-label.
const truncateLabel = (name: string) =>
  name.length > 20 ? `${name.slice(0, 20)}…` : name;

// A draggable pill, shown only in reorder mode. The sortable transform
// (translate) lives on the outer slot; the visual pill wiggles via a rotate
// keyframe on an inner element so the two transforms never fight.
function SortablePill(props: { shelf: StrapiSingleShelfEntry }): JSX.Element {
  const { shelf } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shelf.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.pillSlot}
      {...attributes}
      {...listeners}
      aria-label={`Drag to reorder ${shelf.attributes.name}`}
    >
      <span
        className={classNames(styles.jumpButton, styles.reorderPill, {
          [styles.dragging]: isDragging,
        })}
      >
        {truncateLabel(shelf.attributes.name)}
      </span>
    </div>
  );
}

export function LibraryToolbar(props: LibraryToolbarProps): JSX.Element {
  const {
    shelves,
    onAddShelf,
    onShelvesReordered,
    isOwner = true,
    ownerName,
    search = '',
    onSearchChange,
    className,
  } = props;
  const [selectedJumpShelfId, setSelectedJumpShelfId] = useState<number | null>(
    null,
  );

  const [isReordering, setIsReordering] = useState(false);
  const [draft, setDraft] = useState<StrapiSingleShelfEntry[]>(shelves);
  const [isOutside, setIsOutside] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Snapshot of the order when a drag begins, so a drop outside the row can
  // revert the live reordering instead of committing it.
  const dragStartOrder = useRef<StrapiSingleShelfEntry[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // Horizontal scroller for the jump pills: when the row overflows, page
  // through it with the same arrows the shelves use.
  const jumpRef = useRef<HTMLDivElement>(null);
  const [canJumpLeft, setCanJumpLeft] = useState(false);
  const [canJumpRight, setCanJumpRight] = useState(false);

  const syncJumpScroll = useCallback(() => {
    const el = jumpRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanJumpLeft(scrollLeft > 1);
    setCanJumpRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = jumpRef.current;
    if (!el) return;
    syncJumpScroll();
    el.addEventListener('scroll', syncJumpScroll, { passive: true });
    const observer = new ResizeObserver(syncJumpScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', syncJumpScroll);
      observer.disconnect();
    };
  }, [syncJumpScroll, shelves.length, isReordering]);

  const scrollJump = (direction: -1 | 1) => {
    const el = jumpRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const jumpOverflowing = canJumpLeft || canJumpRight;
  const atShelfLimit = shelves.length >= MAX_SHELVES_PER_LIBRARY;

  // Visitor banner: the tags actually used on this library's objects, deduped
  // by name (no cross-account tag fetch — mirror the Sidebar's derivation).
  const tagNames = useMemo(() => {
    const names = new Set<string>();
    for (const shelf of shelves) {
      for (const obj of shelf.attributes.objects?.data ?? []) {
        for (const tag of obj.attributes.tags?.data ?? []) {
          names.add(tag.attributes.name);
        }
      }
    }
    return Array.from(names);
  }, [shelves]);

  // Pick two distinct tags to tease in the welcome line; re-rolls only when the
  // available tag set changes, not on every render.
  const featuredTags = useMemo(() => {
    const pool = [...tagNames];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 2);
  }, [tagNames]);

  const collectionsClause =
    featuredTags.length >= 2
      ? `curated collections on ${featuredTags[0]} and ${featuredTags[1]}, `
      : featuredTags.length === 1
        ? `curated collections on ${featuredTags[0]}, `
        : 'curated collections, ';

  // Keep the working copy aligned with the source list while idle; freeze it
  // during a reorder session so incoming prop updates can't clobber the drag.
  useEffect(() => {
    if (!isReordering) setDraft(shelves);
  }, [shelves, isReordering]);

  // Default to the first shelf as soon as the list lands; let the user
  // override by clicking, but keep their choice when the list identity
  // changes (e.g. after a surgical mutation).
  useEffect(() => {
    if (shelves.length === 0) {
      setSelectedJumpShelfId(null);
      return;
    }
    setSelectedJumpShelfId(prev =>
      prev != null && shelves.some(s => s.id === prev) ? prev : shelves[0].id,
    );
  }, [shelves]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleJumpTo = (shelfId: number) => {
    setSelectedJumpShelfId(shelfId);
    const el = document.getElementById(`shelf-${shelfId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startReorder = () => {
    setDraft(shelves);
    setError(null);
    setIsReordering(true);
  };

  const cancelReorder = () => {
    setDraft(shelves);
    setIsOutside(false);
    setError(null);
    setIsReordering(false);
  };

  const handleDragStart = () => {
    dragStartOrder.current = draft;
    setError(null);
  };

  // Flag when the dragged pill leaves the row's bounds (+ a little slack) so we
  // can show a "can't drop here" cursor and reject the move on release.
  const handleDragMove = (event: DragMoveEvent) => {
    const list = listRef.current;
    const rect = event.active.rect.current.translated;
    if (!list || !rect) return;
    const bounds = list.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const slack = 40;
    setIsOutside(
      cx < bounds.left - slack ||
        cx > bounds.right + slack ||
        cy < bounds.top - slack ||
        cy > bounds.bottom + slack,
    );
  };

  const handleDragOver = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDraft(curr => {
      const oldIndex = curr.findIndex(s => s.id === active.id);
      const newIndex = curr.findIndex(s => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return curr;
      return arrayMove(curr, oldIndex, newIndex);
    });
  };

  const handleDragEnd = () => {
    // Dropped outside the row → reject: snap back to the pre-drag order.
    if (isOutside) setDraft(dragStartOrder.current);
    setIsOutside(false);
  };

  const handleDragCancel = () => {
    setDraft(dragStartOrder.current);
    setIsOutside(false);
  };

  const handleSave = async () => {
    if (saving) return;
    const ordered: IReorderShelfEntry[] = draft.map((shelf, index) => ({
      id: shelf.id,
      order: index,
    }));

    setSaving(true);
    setError(null);
    try {
      await reorderShelves(ordered);
      onShelvesReordered?.(ordered);
      setIsReordering(false);
    } catch {
      setError('Could not save the new order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOwner) {
    return (
      <div className={classNames(styles.toolbar, className)}>
        <div className={classNames(styles.controls, styles.controlsGuest)}>
          <div className={styles.welcome}>
            <Text
              variant={TypographyVariant.TitleSecondaryBold}
              className={styles.welcomeTitle}
            >
              Welcome to {ownerName}&rsquo;s hive
            </Text>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.welcomeText}
            >
              Discover and explore {collectionsClause}along with an incredible
              playlist full of his favorite songs.
            </Text>
          </div>

          <Input
            type="search"
            value={search}
            placeholder="Search everywhere"
            placeholderColor="#C4C4C4"
            onChange={e => onSearchChange?.(e.target.value)}
            onClear={() => onSearchChange?.('')}
            wrapperClassName={styles.search}
            ariaLabel="Search everywhere"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.toolbar, className)}>
      <div className={styles.controls}>
        <Text className={styles.text}>
          {isReordering ? 'Drag to reorder →' : 'Jump to →'}
        </Text>

        {isReordering ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={draft.map(s => s.id)}
              strategy={rectSortingStrategy}
            >
              <div
                ref={listRef}
                className={classNames(styles.jumpButtons, {
                  [styles.rejecting]: isOutside,
                })}
              >
                {draft.map(shelf => (
                  <SortablePill key={shelf.id} shelf={shelf} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className={styles.jumpScrollerWrap}>
            {jumpOverflowing && (
              <Button
                className={classNames(styles.arrow, styles.arrowLeft)}
                onClick={() => scrollJump(-1)}
                type={ButtonType.Secondary}
                Icon={<ArrowIcon />}
                ariaLabel="Scroll shelves left"
                disabled={!canJumpLeft}
              />
            )}
            <div
              ref={jumpRef}
              className={classNames(styles.jumpButtons, styles.jumpScroll)}
            >
              {shelves.map(shelf => {
                const isSelected = shelf.id === selectedJumpShelfId;
                return (
                  <Button
                    key={shelf.id}
                    label={truncateLabel(shelf.attributes.name)}
                    ariaLabel={`Jump to ${shelf.attributes.name}`}
                    onClick={() => handleJumpTo(shelf.id)}
                    type={ButtonType.Secondary}
                    size={ButtonSize.Default}
                    className={classNames(styles.jumpButton, {
                      [styles.jumpSelected]: isSelected,
                    })}
                  />
                );
              })}
            </div>
            {jumpOverflowing && (
              <Button
                className={styles.arrow}
                onClick={() => scrollJump(1)}
                type={ButtonType.Secondary}
                Icon={<ArrowIcon />}
                ariaLabel="Scroll shelves right"
                disabled={!canJumpRight}
              />
            )}
          </div>
        )}

        <div className={styles.actions}>
          {error && (
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.error}
            >
              {error}
            </Text>
          )}
          {isReordering ? (
            <>
              <Button
                label="Cancel"
                ariaLabel="Cancel reordering"
                onClick={cancelReorder}
                type={ButtonType.Text}
                size={ButtonSize.Default}
                className={styles.button}
                disabled={saving}
              />
              <Button
                label={saving ? 'Saving…' : 'Save'}
                ariaLabel="Save shelf order"
                onClick={handleSave}
                type={ButtonType.Text}
                size={ButtonSize.Default}
                className={styles.button}
                disabled={saving}
              />
            </>
          ) : (
            <>
              <Button
                label="Reorder"
                ariaLabel="Reorder shelves"
                onClick={startReorder}
                type={ButtonType.Text}
                size={ButtonSize.Default}
                className={styles.button}
                disabled={shelves.length < 2}
              />
              <span
                className={styles.addShelfWrap}
                title={
                  atShelfLimit
                    ? `You've reached the limit of ${MAX_SHELVES_PER_LIBRARY} shelves. Delete a shelf to add a new one.`
                    : undefined
                }
              >
                <Button
                  label="Add shelf"
                  ariaLabel="Add shelf"
                  onClick={onAddShelf}
                  type={ButtonType.Text}
                  size={ButtonSize.Default}
                  Icon={<PlusIcon />}
                  iconPosition={IconPosition.Right}
                  className={styles.button}
                  disabled={atShelfLimit}
                />
              </span>
            </>
          )}
        </div>

        <Input
          type="search"
          value={search}
          placeholder="Search everywhere"
          placeholderColor="#C4C4C4"
          onChange={e => onSearchChange?.(e.target.value)}
          onClear={() => onSearchChange?.('')}
          wrapperClassName={styles.search}
          ariaLabel="Search everywhere"
        />
      </div>
    </div>
  );
}
