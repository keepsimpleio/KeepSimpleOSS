// Generic, presentational grid: drag updates the caller's list via `onReorder`.
// Persistence lives with the consumer — AddObjectModal sends the final order to
// POST /api/objects/reorder on submit.

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
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
import React, { JSX, useState } from 'react';

import { PlusIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';

import type {
  ReorderGridProps,
  ReorderItem,
  ReorderItemShape,
} from './ReorderGrid.types';

import styles from './ReorderGrid.module.scss';

function CardCover(props: { item: ReorderItem }) {
  const { item } = props;
  return (
    <div className={styles.cover}>
      {item.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.coverUrl}
          alt={item.title}
          className={styles.coverImage}
          // Suppress the browser's native image drag-ghost, which would
          // otherwise preempt dnd-kit's pointer drag and break reordering.
          draggable={false}
        />
      ) : (
        <div className={styles.coverPlaceholder} aria-hidden="true" />
      )}
    </div>
  );
}

function SortableCard(props: {
  item: ReorderItem;
  shape: ReorderItemShape;
  position: number;
}) {
  const { item, shape, position } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames(styles.cardWrap, {
        [styles.current]: item.isCurrent,
      })}
    >
      <div
        className={classNames(styles.card, styles[shape], {
          // While this card is the one being dragged, the solid clone follows
          // the cursor in the DragOverlay — this slot, which the sorting
          // strategy slides to the drop position, becomes the dashed target.
          [styles.placeholder]: isDragging,
        })}
        {...attributes}
        {...listeners}
      >
        <CardCover item={item} />
      </div>
      <Text variant={TypographyVariant.TextSmall} className={styles.position}>
        {position}
      </Text>
    </div>
  );
}

export function ReorderGrid(props: ReorderGridProps): JSX.Element {
  const {
    items,
    onReorder,
    onAddPlaceholder,
    itemShape = 'square',
    className,
    emptyState = 'No objects yet — add one to test reordering.',
  } = props;

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = items.find(i => i.id === activeId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className={classNames(className, styles.wrapper)}>
      {items.length === 0 ? (
        <div className={styles.empty}>
          <Text variant={TypographyVariant.TextSmall}>{emptyState}</Text>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext
            items={items.map(i => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className={styles.grid}>
              {items.map((item, index) => (
                <SortableCard
                  key={item.id}
                  item={item}
                  shape={itemShape}
                  position={index + 1}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeItem ? (
              <div
                className={classNames(
                  styles.card,
                  styles[itemShape],
                  styles.overlayCard,
                )}
              >
                <CardCover item={activeItem} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {onAddPlaceholder && (
        <Button
          type={ButtonType.Outlined}
          size={ButtonSize.Default}
          label="Add object"
          ariaLabel="Add placeholder object for reorder testing"
          Icon={<PlusIcon />}
          onClick={onAddPlaceholder}
          className={styles.addButton}
        />
      )}
    </div>
  );
}
