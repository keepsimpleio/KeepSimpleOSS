import type { IObject, IReorderObjectEntry } from '@local-types/library/object';

export interface ObjectOverviewModalProps {
  /** Full populated object (coverImage, tags, shelf). */
  object: IObject;
  /**
   * Owner mode shows Share, the Edit/Delete menu, Move To, and an interactive
   * rating box. Viewer mode hides those affordances and renders the rating
   * box read-only.
   */
  isOwner: boolean;
  /**
   * Library owner's username — shown in the rating-box header ("X rated this book:").
   * Pass the *library owner*, not the viewer.
   */
  ownerUsername: string;
  onClose: () => void;
  /**
   * Sibling objects on the same shelf — passed straight to the edit modal so
   * the reorder grid in step 2 can render the shelf's real contents.
   */
  shelfObjects?: IObject[];
  /**
   * Id of the shelf this object lives on. Forwarded to the edit modal as a
   * fallback shelf id so a step-2 reorder can build a valid payload even when
   * the object's `shelf` relation isn't populated.
   */
  defaultShelfId?: number;
  /** Fired after a successful edit. */
  onUpdated?: (object: IObject) => void;
  /** Fired after a successful delete. */
  onDeleted?: (id: number) => void;
  /** Forwarded to the edit modal so a step-2 reorder re-sequences the shelf. */
  onObjectsReordered?: (ordered: IReorderObjectEntry[]) => void;
}
