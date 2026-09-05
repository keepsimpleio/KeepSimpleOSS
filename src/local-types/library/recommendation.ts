/**
 * A book the library suggests to its owner, gathered from outside the
 * library. Not a Strapi object: nothing here is persisted until the owner
 * adds it to a shelf of their own.
 */
export interface IRecommendedBook {
  /** Stable across renders and refreshes, so a hidden pick stays hidden. */
  id: string;
  title: string;
  author?: string;
  /** Four-digit year of first publication. */
  year?: number;
  /** One line on why this book is on the owner's shelf. */
  reason?: string;
  /** Where the pick was gathered from, if it was. */
  source?: {
    name: string;
    url?: string;
  };
  /** Cover art, when the source offers one. Absent covers render the
   * book's own typeset front. */
  coverUrl?: string;
}
