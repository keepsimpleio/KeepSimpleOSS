import type { IObject } from '@local-types/library/object';
import type { IRecommendedBook } from '@local-types/library/recommendation';

export interface RecommendedShelfProps {
  className?: string;
  /** The picks to stand on the board, in the order the engine ranked them. */
  books: IRecommendedBook[];
  /** A pick the owner took: the book now exists on one of their shelves. */
  onObjectCreated?: (created: IObject) => void;
}
