import type { StrapiSingleShelfEntry } from '@local-types/library';
import type { IObject } from '@local-types/library/object';

export interface ShelfProps {
  className?: string;
  title?: string;
  shelf: StrapiSingleShelfEntry;
  /** Library owner's username — passed through to the ObjectOverviewModal header. */
  ownerUsername?: string;
  /** True when the current viewer owns this library. */
  isOwner?: boolean;
  /** Fired after a successful object create — used for surgical re-render. */
  onObjectCreated?: (shelfId: number, object: IObject) => void;
  /** Fired after a successful object update — used for surgical re-render. */
  onObjectUpdated?: (shelfId: number, object: IObject) => void;
  /** Fired after a successful object delete — used for surgical re-render. */
  onObjectDeleted?: (shelfId: number, objectId: number) => void;
  /** Fired after the shelf itself is deleted — used to drop it from the library list. */
  onShelfDeleted?: (shelfId: number) => void;
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
}
