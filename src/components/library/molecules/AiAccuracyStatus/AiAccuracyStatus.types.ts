import type { StrapiSingleShelfEntry } from '@local-types/library/library';

export interface AiAccuracyStatusProps {
  /** Every shelf of the library on screen, private ones included. */
  shelves: StrapiSingleShelfEntry[];
  className?: string;
}
