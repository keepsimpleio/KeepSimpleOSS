import type { StrapiSingleShelfEntry } from '@local-types/library/library';
import type { IReorderShelfEntry } from '@local-types/library/shelf';

export interface LibraryToolbarProps {
  shelves: StrapiSingleShelfEntry[];
  onAddShelf: () => void;
  /**
   * Fired with every shelf's new position after a reorder persists, so the
   * library can re-sequence its shelves without a refetch.
   */
  onShelvesReordered?: (ordered: IReorderShelfEntry[]) => void;
  className?: string;
}
