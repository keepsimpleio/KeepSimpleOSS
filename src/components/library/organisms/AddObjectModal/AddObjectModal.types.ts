import type { IObject,ObjectType } from '@local-types/library/object';

export interface AddObjectModalProps {
  objectType: ObjectType;
  onClose: () => void;
  onCreated?: (created: IObject) => void;
  /**
   * Mode flag. `true` (default) creates a new object via POST.
   * `false` opens an existing object for view/edit and submits via PUT.
   * When `false`, `object` must be provided.
   */
  isCreate?: boolean;
  /** Existing object for edit mode. Required when `isCreate` is false. */
  object?: IObject;
  /**
   * Pre-fill (and lock) the shelf selection in Step 2 so the modal opens
   * already targeted at a specific shelf. When set, the shelf picker is hidden.
   */
  defaultShelfId?: number;
  /**
   * Objects already on the target shelf — seeds the step-2 reorder grid so
   * the user can rearrange against the real shelf contents. The object being
   * edited is included; the modal filters it out of the grid.
   */
  shelfObjects?: IObject[];
}

export type FieldKey =
  | 'sourceUrl'
  | 'title'
  | 'author'
  | 'publicationDate'
  | 'description'
  | 'coverImage';

export interface ObjectTypeConfig {
  /** Modal title in create mode, e.g. "Add new book" */
  title: string;
  /** Modal title in edit/open mode, e.g. "Edit book" */
  editTitle: string;
  /** Label suffix for Step 2, e.g. "Book position and tags" */
  step2Label: string;
  /** Primary submit-button label in create mode, e.g. "Save book details" */
  submitLabel: string;
  /** Primary submit-button label in edit mode, e.g. "Save changes" */
  editSubmitLabel: string;
  /** Multi-select tags label, e.g. "Book tags" */
  tagsLabel: string;
  /** Whether Step 2 includes the Shelf single-select (Book only) */
  hasShelf: boolean;
  /** Reorder card aspect ratio */
  itemShape: 'square' | 'landscape';
  /** Step 1 field order — drives rendering */
  fields: FieldKey[];
}
