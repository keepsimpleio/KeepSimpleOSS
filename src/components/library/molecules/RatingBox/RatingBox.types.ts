import type { Difficulty, OverallRating } from '@local-types/library/object';

export interface RatingBoxProps {
  /** Username shown in the header — "<username> rated this book:" */
  username: string;
  /** Currently selected overall rating, 1–5. */
  overallRating?: OverallRating;
  /** Currently selected difficulty. */
  difficulty?: Difficulty;
  /** Fires when the owner picks a new overall value. */
  onOverallChange?: (value: OverallRating) => void;
  /** Fires when the owner picks a new difficulty. */
  onDifficultyChange?: (value: Difficulty) => void;
  /**
   * Viewer mode — render values with colors but no dropdown affordances
   * and no interactions. Defaults to `false` (owner mode).
   */
  readOnly?: boolean;
  className?: string;
}
