import type { IRecommendedBook } from '@local-types/library/recommendation';

export interface RecommendedBookCardProps {
  book: IRecommendedBook;
  className?: string;
  readOnly?: boolean;
  /** A locked pick survives a re-generate. */
  locked?: boolean;
  /** A banned pick stays on the board dimmed until the owner unbans it. */
  banned?: boolean;
  /** True while the engine is rolling this place again. The card carries the
   * same light the empty places do, so a re-roll is visible on a full shelf. */
  working?: boolean;
  /** Its place in the row, so the light runs along the shelf in order. */
  slotIndex?: number;
  onToggleLock?: (book: IRecommendedBook) => void;
  onToggleBan?: (book: IRecommendedBook) => void;
}
