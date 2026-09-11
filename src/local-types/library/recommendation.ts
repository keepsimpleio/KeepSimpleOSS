import type { MagicRubric } from '@local-types/library/magicBook';

/**
 * The AI shelf: books gathered from outside the library and stood above it
 * for the owner alone. Ten of them answer the library as it is; three stand
 * beyond it, on ground the library has not covered, chosen so the owner can
 * actually read them. Nothing here is a Strapi object until the owner puts
 * it on a shelf of their own.
 */

/** fit: answers what the library already holds. stretch: opens new ground. */
export type RecommendedKind = 'fit' | 'stretch';

/** What the owner wants the shelf to deal in. Remembered for every later
 * roll, so a shelf set to non-fiction stays non-fiction. */
export type RecommendedPreference = 'any' | 'nonfiction' | 'fiction';

export interface IRecommendedBook {
  /** Stable across renders and refreshes, so a hidden pick stays hidden. */
  id: string;
  title: string;
  author?: string;
  /** Four-digit year of first publication. */
  year?: number;
  /** What the book is: its subject and its argument, for a reader who has
   * never heard of it. Absent on picks made before the engine wrote one. */
  about?: string;
  /** One line on why this book is on the owner's shelf. */
  reason?: string;
  /** How well the pick fits the owner, 0..100, as the engine scored it. */
  match?: number;
  /** Which half of the board the pick belongs to. */
  kind?: RecommendedKind;
  /** For a stretch pick, the ground it opens, in a few words. */
  newGround?: string;
  /** Where the pick was gathered from, if it was. */
  source?: {
    name: string;
    url?: string;
  };
  /** Cover art, when the source offers one. Absent covers render the
   * book's own typeset front. */
  coverUrl?: string;
}

/** A pick as the engine made it: verified against a book source, scored on
 * the rubric, and stamped with the moment it was made. */
export interface RecommendedPick extends IRecommendedBook {
  reason: string;
  kind: RecommendedKind;
  rubric: MagicRubric;
  source: { name: string; url?: string };
  /** When the pick was made, UTC. */
  at: string;
}

/** A book the owner banned. Never proposed again, on this shelf or on any
 * magic book, until they unban it. */
export interface BannedBook {
  title: string;
  author?: string;
  /** UTC. */
  at: string;
}

/**
 * locked:  the library has not read enough for the shelf to open.
 * rolling: the engine is stocking the board; the shelf polls for it.
 * idle:   open, nothing rolled yet.
 * ready:  picks stand on the board.
 * empty:  a roll ran and nothing could be confirmed.
 * capped: the engine has done its day of work.
 */
export type RecommendedStatus =
  | 'locked'
  | 'rolling'
  | 'idle'
  | 'ready'
  | 'empty'
  | 'capped';

export interface RecommendedShelfState {
  status: RecommendedStatus;
  /** Books standing on the owner's book shelves. */
  books: number;
  /** Books needed before the shelf opens. */
  required: number;
  /** Rated books; under the engine's threshold no percent is shown. */
  ratedBooks: number;
  /** The setting as it stands, whatever the board was rolled with. */
  preference: RecommendedPreference;
  /** The setting the standing board was rolled with, when one stands. */
  rolledWith?: RecommendedPreference;
  picks: RecommendedPick[];
  /** Ids of the picks the owner locked in. */
  locked: string[];
  banned: BannedBook[];
  /** Why the board holds what it holds, when it needs saying. */
  note?: string;
}
