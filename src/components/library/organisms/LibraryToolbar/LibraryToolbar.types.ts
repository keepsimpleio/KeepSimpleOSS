import type { StrapiSingleShelfEntry } from '@local-types/library/library';

export interface LibraryToolbarProps {
  shelves: StrapiSingleShelfEntry[];
  /**
   * When false (a visitor or the owner previewing guest mode) the toolbar adds
   * a welcome banner above the shelf navigation. Defaults to true.
   */
  isOwner?: boolean;
  /** Library owner's display name, shown in the visitor welcome banner. */
  ownerName?: string;
  /** How many objects the current search matched; null when no search is active. */
  matchedCount?: number | null;
  /** Current search query. Controlled by the library so the shelf list filters. */
  search?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}
