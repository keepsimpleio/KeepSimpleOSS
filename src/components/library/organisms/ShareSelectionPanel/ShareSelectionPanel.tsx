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
import React, { JSX, useEffect, useMemo, useState } from 'react';

import { KEEPSIMPLE_URL, MAX_SHARE_OBJECTS } from '@constants/library/common';

import type { IObject } from '@local-types/library/object';

import { createShareLink } from '@api/library/createShareLink';

import { ChevronUpIcon, CloseIcon, ShareIcon } from '@icons/library/svg';

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

function ObjectCard({ object }: { object: IObject }): JSX.Element {
  switch (object.attributes.type) {
    case 'video':
      return <VideoCard object={object} compact />;
    case 'audio':
      return <AudioCard object={object} compact />;
    default:
      return <BookCard object={object} compact />;
  }
}

function SortableItem(props: {
  object: IObject;
  position: number;
  readOnly: boolean;
  onRemove?: (id: number) => void;
}): JSX.Element {
  const { object, position, readOnly, onRemove } = props;
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

      {/* Drag handle wraps the card; the card carries no onClick here, so a
          pointer-press always starts a drag instead of opening the overview. */}
      <div
        className={classNames(styles.cardHandle, {
          [styles.draggable]: !readOnly,
        })}
        {...(readOnly ? {} : { ...attributes, ...listeners })}
      >
        <ObjectCard object={object} />
      </div>

      {!readOnly && sequence}
    </div>
  );
}

export function ShareSelectionPanel({
  objects,
  ownerUsername,
  readOnly = false,
  limitReached = false,
  onReorder,
  onRemove,
  onClear,
  className,
}: ShareSelectionPanelProps): JSX.Element | null {
  const [collapsed, setCollapsed] = useState(false);
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
      if (!result) {
        setShareError('Could not create the link. Please try again.');
        return;
      }
      setShareUrl(
        `${SHARE_BASE_URL}/library/${ownerUsername}/share/${result.token}`,
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

  if (objects.length === 0) return null;

  return (
    <section
      className={classNames(styles.panel, className, {
        [styles.collapsed]: collapsed,
      })}
      aria-label={readOnly ? 'Shared selection' : 'Share selection'}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.heading}
          onClick={() => setCollapsed(c => !c)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand selection' : 'Collapse selection'}
        >
          <ChevronUpIcon
            className={classNames(styles.chevron, {
              [styles.chevronCollapsed]: collapsed,
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
          <div className={styles.actions}>
            <Button
              label={isSharing ? 'Sharing…' : 'Share selection via link'}
              ariaLabel="Share selection via link"
              onClick={handleShare}
              type={ButtonType.Primary}
              size={ButtonSize.Default}
              Icon={<ShareIcon />}
              iconPosition={IconPosition.Right}
              disabled={isSharing}
            />
            <Button
              label="Remove all"
              ariaLabel="Remove all from selection"
              onClick={() => onClear?.()}
              type={ButtonType.Outlined}
              size={ButtonSize.Default}
              className={styles.removeAll}
            />
          </div>
        )}
      </div>

      {/* Always mounted so the chevron can animate the whole section open/closed
          via the grid-rows collapse (see .bodyWrap) instead of unmounting. */}
      <div className={styles.bodyWrap} aria-hidden={collapsed}>
        <div className={styles.body}>
          {!readOnly && limitReached && (
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.warning}
            >
              You&apos;ve reached the maximum of {MAX_SHARE_OBJECTS} objects.
              Remove one to add another.
            </Text>
          )}

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
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

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
                ariaLabel="Copy share link"
                onClick={handleCopy}
                type={ButtonType.Secondary}
                size={ButtonSize.Default}
              />
            </div>
          )}

          {!readOnly && shareError && (
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.error}
            >
              {shareError}
            </Text>
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
