import type { IRecommendedBook } from '@local-types/library/recommendation';

export interface RecommendedShelfProps {
  className?: string;
  /** Every pick the engine has to offer, best match first. The board shows
   * the top of it; a re-generate deals from the rest. */
  pool: IRecommendedBook[];
}
