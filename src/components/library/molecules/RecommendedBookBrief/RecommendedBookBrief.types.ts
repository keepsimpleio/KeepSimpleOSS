import type { IRecommendedBook } from '@local-types/library/recommendation';

export interface RecommendedBookBriefProps {
  book: IRecommendedBook;
  /** A locked pick survives the next roll. */
  locked?: boolean;
  /** A banned book is never recommended again until the owner says so. */
  banned?: boolean;
  /** A visitor reads the brief; only the owner may lock or ban from it. */
  readOnly?: boolean;
  onToggleLock?: (book: IRecommendedBook) => void;
  onToggleBan?: (book: IRecommendedBook) => void;
  onClose: () => void;
}
