import type { StrapiSingleShelfEntry } from '@local-types/library/library';

export interface LibraryToolbarProps {
  shelves: StrapiSingleShelfEntry[];
  /**
   * When false (a visitor or the owner previewing guest mode) the toolbar swaps
   * its shelf controls for a read-only welcome banner. Defaults to true.
   */
  isOwner?: boolean;
  /** Library owner's display name, shown in the visitor welcome banner. */
  ownerName?: string;
  /** Current search query. Controlled by the library so the shelf list filters. */
  search?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}
