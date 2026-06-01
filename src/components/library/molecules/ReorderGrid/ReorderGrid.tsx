// Reorder persistence is not wired yet — drag updates the local list only.
// Backend needs a positional-update endpoint (or `order` on shelf.objects)
// before we can send the new order on submit.

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
import React, { JSX } from 'react';

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

function SortableCard(props: { item: ReorderItem; shape: ReorderItemShape }) {
  const { item, shape } = props;
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
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames(styles.card, styles[shape], {
        [styles.current]: item.isCurrent,
      })}
      {...attributes}
      {...listeners}
    >
      <div className={styles.cover}>
        {item.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.coverUrl}
            alt={item.title}
            className={styles.coverImage}
          />
        ) : (
          <div className={styles.coverPlaceholder} aria-hidden="true" />
        )}
      </div>
      <Text variant={TypographyVariant.TextSmall} className={styles.title}>
        {item.title}
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
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
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(i => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className={styles.grid}>
              {items.map(item => (
                <SortableCard key={item.id} item={item} shape={itemShape} />
              ))}
            </div>
          </SortableContext>
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
