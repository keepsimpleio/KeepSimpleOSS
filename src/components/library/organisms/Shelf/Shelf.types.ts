import type { HTMLAttributes } from 'react';

import type { StrapiSingleShelfEntry } from '@local-types/library';
import type { IObject, IReorderObjectEntry } from '@local-types/library/object';
import type { ShelfVisibility } from '@local-types/library/shelf';

/**
 * dnd-kit's activator wiring, handed down so the grip rendered inside the
 * shelf header is what starts a drag. Absent when the viewer can't reorder.
 */
export interface ShelfDragHandleProps extends HTMLAttributes<HTMLElement> {
  ref?: (element: HTMLElement | null) => void;
}

export interface ShelfProps {
  className?: string;
  title?: string;
  shelf: StrapiSingleShelfEntry;
  /** Library owner's username — passed through to the ObjectOverviewModal header. */
  ownerUsername?: string;
  /** True when the current viewer owns this library. */
  isOwner?: boolean;
  /**
   * Ids of the objects a search matched on this shelf. Null means no search:
   * every object is drawn. The shelf's own object list is never narrowed, so
   * counts, caps and reorder payloads always describe the real shelf.
   */
  visibleObjectIds?: Set<number> | null;
  /**
   * True when the owner could reorder shelves but a search is active. The
   * grip stays in its slot, disabled, so the header does not reflow.
   */
  reorderLocked?: boolean;
  /** Fired after the privacy switch saved, so the library tree carries it. */
  onShelfVisibilityChanged?: (
    shelfId: number,
    visibility: ShelfVisibility,
  ) => void;
  /** Fired after a successful object create — used for surgical re-render. */
  onObjectCreated?: (shelfId: number, object: IObject) => void;
  /** Fired after a successful object update — used for surgical re-render. */
  onObjectUpdated?: (shelfId: number, object: IObject) => void;
  /** Fired after a successful object delete — used for surgical re-render. */
  onObjectDeleted?: (shelfId: number, objectId: number) => void;
  /** Fired after the shelf itself is deleted — used to drop it from the library list. */
  onShelfDeleted?: (shelfId: number) => void;
  /** Fired after the shelf is renamed — lets the library (and toolbar jump-to nav) update in the same render. */
  onShelfRenamed?: (shelfId: number, name: string) => void;
  /**
   * Fired when an object on this shelf is moved to another shelf (PUT shelf: id).
   * Lets the library remove the object from the source shelf and add it to the
   * target shelf in the same render.
   */
  onObjectMoved?: (
    fromShelfId: number,
    toShelfId: number,
    object: IObject,
  ) => void;
  /**
   * Fired after a step-2 drag reorder is saved — carries every object's new
   * position so the library can re-sequence this shelf without a refetch.
   */
  onObjectsReordered?: (
    shelfId: number,
    ordered: IReorderObjectEntry[],
  ) => void;
  /** Grip wiring for reordering shelves; owner-only, absent while searching. */
  dragHandleProps?: ShelfDragHandleProps;
  /** True while this shelf is the one being dragged. */
  isDragging?: boolean;
}
