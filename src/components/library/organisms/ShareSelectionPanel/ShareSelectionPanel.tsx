import {
  closestCenter,
  DndContext,
  type DragEndEvent,
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
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';

import { KEEPSIMPLE_URL, MAX_SHARE_OBJECTS } from '@constants/library/common';

import type { IObject } from '@local-types/library/object';

import { createShareLink } from '@api/library/createShareLink';

import { ChevronUpIcon, CloseIcon, ShareIcon } from '@icons/library/svg';

import { useGlobalState } from '@components/Context/library/GlobalStateContext';
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
import { VideoCard } from '@components/library/molecules/VideoCard';

import type { ShareSelectionPanelProps } from './ShareSelectionPanel.types';

import styles from './ShareSelectionPanel.module.scss';

const SHARE_BASE_URL = process.env.NEXT_PUBLIC_DOMAIN ?? KEEPSIMPLE_URL;

function ObjectCard({
  object,
  onClick,
}: {
  object: IObject;
  onClick?: (object: IObject) => void;
}): JSX.Element {
  switch (object.attributes.type) {
    case 'video':
      return <VideoCard object={object} onClick={onClick} compact />;
    case 'audio':
      return <AudioCard object={object} onClick={onClick} compact />;
    default:
      return <BookCard object={object} onClick={onClick} compact />;
  }
}

function SortableItem(props: {
  object: IObject;
  position: number;
  readOnly: boolean;
  onRemove?: (id: number) => void;
  onObjectClick?: (object: IObject) => void;
}): JSX.Element {
  const { object, position, readOnly, onRemove, onObjectClick } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: object.id, disabled: readOnly });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const sequence = (
    <Text variant={TypographyVariant.TextBaseBold} className={styles.sequence}>
      {position}
    </Text>
  );

  return (
    <div ref={setNodeRef} style={style} className={styles.item}>
      {/* Recipient sees the sequence above the cover; the owner sees a remove
          control there instead and the sequence below. */}
      {readOnly ? (
        sequence
      ) : (
        <button
          type="button"
          className={styles.removePill}
          onClick={() => onRemove?.(object.id)}
          aria-label="Remove from selection"
        >
          <CloseIcon />
        </button>
      )}

      {/* Owner view: the handle wraps the card and the card carries no onClick,
          so a pointer-press starts a drag instead of opening the overview.
          Recipient view: no drag, so the card click opens the overview modal. */}
      <div
        className={classNames(styles.cardHandle, {
          [styles.draggable]: !readOnly,
        })}
        {...(readOnly ? {} : { ...attributes, ...listeners })}
      >
        <ObjectCard
          object={object}
          onClick={readOnly ? onObjectClick : undefined}
        />
      </div>

      {!readOnly && sequence}
    </div>
  );
}

export function ShareSelectionPanel({
  objects,
  ownerUsername,
  readOnly = false,
  initiallyExpanded = false,
  limitReached = false,
  onReorder,
  onRemove,
  onClear,
  onObjectClick,
  className,
}: ShareSelectionPanelProps): JSX.Element | null {
  // Starts folded down to its header bar: the panel is a permanent fixture at
  // the bottom of the library, so it opens only when the user asks for it.
  const [collapsed, setCollapsed] = useState(!initiallyExpanded);

  // The fold is driven by the body's own measured height, never by a guessed
  // cap on the panel: the header keeps whatever height it really has (owner
  // or recipient, one row of buttons or two, any locale), and the body slides
  // between 0 and exactly its content. Measured live, so selecting another
  // object while the section is open grows it instead of clipping it.
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState(0);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const update = () => setBodyHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The bar is fixed over the library, so the library holds a strip of page
  // free for it. That strip is this header's real height, published as a
  // custom property rather than repeated as a number the two could disagree
  // on (see Library.module.scss).
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const root = document.documentElement;
    const update = () =>
      root.style.setProperty(
        '--library-share-bar-height',
        `${el.offsetHeight}px`,
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--library-share-bar-height');
    };
  }, []);
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // The ids+order are the share's identity — once they change, a previously
  // minted link no longer matches what's on screen, so drop it.
  const orderKey = useMemo(() => objects.map(o => o.id).join(','), [objects]);
  useEffect(() => {
    setShareUrl(null);
    setShareError(null);
    setCopied(false);
  }, [orderKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = objects.findIndex(o => o.id === active.id);
    const newIndex = objects.findIndex(o => o.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder?.(arrayMove(objects, oldIndex, newIndex));
  };

  const handleShare = async () => {
    setIsSharing(true);
    setShareError(null);
    try {
      const result = await createShareLink(objects.map(o => o.id));
      if ('error' in result) {
        // The backend's own reason, verbatim: a private object or an
        // over-cap selection does not get better with a retry.
        setShareError(
          result.retryable
            ? result.error
            : `${result.error} Adjust the selection and share again.`,
        );
        return;
      }
      setShareUrl(
        `${SHARE_BASE_URL}/library/${encodeURIComponent(ownerUsername)}/share/${result.token}`,
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareError('Could not copy. Copy the link manually.');
    }
  };

  const pendingRemove = objects.find(o => o.id === pendingRemoveId) ?? null;

  // The owner's panel is a permanent bottom bar — it stays put with nothing
  // selected so the share affordance never appears and disappears under the
  // content. A recipient viewing a shared link has nothing to select, so an
  // empty panel there is just a dead bar.
  const isEmpty = objects.length === 0;
  const { isSidebarCollapsed } = useGlobalState();
  if (isEmpty && readOnly) return null;

  return (
    <section
      className={classNames(styles.panel, className, {
        [styles.collapsed]: collapsed,
        // The bar spans the working area, so it ends where the info panel
        // begins — and runs to the window's edge once that panel is folded.
        [styles.panelWide]: isSidebarCollapsed,
      })}
      aria-label={readOnly ? 'Shared selection' : 'Share selection'}
    >
      {/* The whole bar folds the section: the title is the labelled control
          for keyboard and screen readers, and the empty stretch beside it
          answers to the pointer as well. The action buttons keep their own
          clicks (see .actions). */}
      <div
        ref={headerRef}
        className={classNames(styles.header, {
          [styles.headerReadOnly]: readOnly,
        })}
        onClick={() => setCollapsed(c => !c)}
      >
        {/* The button carries no handler of its own: a press here, by
            pointer or by keyboard, fires one click that the bar above
            handles. Two handlers meant a click on the label toggled twice
            and the section never moved. */}
        <button
          type="button"
          className={styles.heading}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand selection' : 'Collapse selection'}
        >
          {/* The icon points up by default. Collapsed, up means "opens
              upward"; expanded, it flips down to mean "folds away". */}
          <ChevronUpIcon
            className={classNames(styles.chevron, {
              [styles.chevronExpanded]: !collapsed,
            })}
          />
          <Text
            variant={TypographyVariant.TextBaseSemibold}
            className={styles.title}
          >
            {readOnly ? 'Shared items' : 'Selected items'}
          </Text>
        </button>

        {!readOnly && (
          <div className={styles.actions} onClick={e => e.stopPropagation()}>
            <Button
              label={isSharing ? 'Sharing…' : 'Share selection via link'}
              ariaLabel="Share selection via link"
              onClick={handleShare}
              type={ButtonType.Primary}
              size={ButtonSize.Default}
              Icon={<ShareIcon />}
              iconPosition={IconPosition.Right}
              disabled={isSharing || isEmpty}
            />
            <Button
              label="Remove all"
              ariaLabel="Remove all from selection"
              onClick={() => onClear?.()}
              type={ButtonType.Outlined}
              size={ButtonSize.Default}
              className={styles.removeAll}
              disabled={isEmpty}
            />
          </div>
        )}
      </div>

      {/* Always mounted so the section can slide open and shut instead of
          appearing and disappearing. The wrapper clips; the body inside keeps
          its full height at all times, which is what makes the measurement
          above valid whichever state we are in. */}
      <div
        className={styles.bodyWrap}
        aria-hidden={collapsed}
        style={{ maxHeight: collapsed ? 0 : bodyHeight }}
      >
        <div className={styles.body} ref={bodyRef}>
          {!readOnly && limitReached && (
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.warning}
            >
              You&apos;ve reached the maximum of {MAX_SHARE_OBJECTS} objects.
              Remove one to add another.
            </Text>
          )}

          {isEmpty ? (
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.emptyState}
            >
              Nothing selected yet. Pick objects from your shelves to share them
              as one link. Only items on public shelves can be shared, and a
              link stays valid for 7 days.
            </Text>
          ) : (
            <div className={styles.scroller}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={objects.map(o => o.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className={styles.grid}>
                    {objects.map((object, index) => (
                      <SortableItem
                        key={object.id}
                        object={object}
                        position={index + 1}
                        readOnly={readOnly}
                        onRemove={setPendingRemoveId}
                        onObjectClick={onObjectClick}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {!readOnly && shareUrl && (
            <div className={styles.linkRow}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.linkText}
              >
                {shareUrl}
              </Text>
              <Button
                label={copied ? 'Copied' : 'Copy link'}
                ariaLabel={copied ? 'Share link copied' : 'Copy share link'}
                onClick={handleCopy}
                type={ButtonType.Secondary}
                size={ButtonSize.Default}
              />
            </div>
          )}
          {!readOnly && shareUrl && (
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.emptyState}
            >
              This link stays valid for 7 days and shows the items in this
              order. Change the selection to mint a new one.
            </Text>
          )}

          {!readOnly && shareError && (
            <div className={styles.linkRow}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.error}
              >
                {shareError}
              </Text>
              <Button
                label="Try again"
                ariaLabel="Try sharing again"
                onClick={handleShare}
                type={ButtonType.Secondary}
                size={ButtonSize.Default}
                disabled={isSharing || isEmpty}
              />
            </div>
          )}
        </div>
      </div>

      {pendingRemove && (
        <ConfirmationModal
          variant="delete"
          title="Remove from selection?"
          text={`"${pendingRemove.attributes.title}" will be removed from the share selection.`}
          actionButtonLabel="Remove"
          actionButtonType={ButtonType.Warning}
          onClose={() => setPendingRemoveId(null)}
          onConfirm={() => {
            onRemove?.(pendingRemove.id);
            setPendingRemoveId(null);
          }}
        />
      )}
    </section>
  );
}
