import type { IRecommendedBook } from '@local-types/library/recommendation';

export interface RecommendedBookCardProps {
  book: IRecommendedBook;
  className?: string;
  /** The owner takes the pick: opens the add-book flow. */
  onAdd?: (book: IRecommendedBook) => void;
  /** The owner passes on the pick: it leaves the shelf. */
  onHide?: (book: IRecommendedBook) => void;
}
