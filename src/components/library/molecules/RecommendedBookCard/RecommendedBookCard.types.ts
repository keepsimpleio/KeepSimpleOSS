import type { IRecommendedBook } from '@local-types/library/recommendation';

export interface RecommendedBookCardProps {
  book: IRecommendedBook;
  className?: string;
  /** Deals the cover its paper; the same index keeps the same paper. */
  tint?: number;
  /** A locked pick survives a re-generate. */
  locked?: boolean;
  /** A banned pick stays on the board dimmed until the owner unbans it. */
  banned?: boolean;
  onToggleLock?: (book: IRecommendedBook) => void;
  onToggleBan?: (book: IRecommendedBook) => void;
}
