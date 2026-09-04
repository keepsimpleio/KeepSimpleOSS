import type { StrapiSingleShelfEntry } from '@local-types/library/library';

export interface LibraryToolbarProps {
  shelves: StrapiSingleShelfEntry[];
  /** How many objects the current search matched; null when no search is active. */
  matchedCount?: number | null;
  /** Current search query. Controlled by the library so the shelf list filters. */
  search?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}
