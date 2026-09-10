/**
 * The magic book: one recommendation standing at the end of each of the
 * owner's book shelves, chosen by the engine from outside the library and
 * verified against Google Books before it is shown. Owner-only.
 */

/** The dimensions the engine scores a candidate on, each 0..5. */
export interface MagicRubric {
  /** How squarely the book sits in the shelf's subject. */
  theme: number;
  /** How close it runs to the axis the owner's notes praise. */
  notes: number;
  /** How well it matches the owner's own tag vocabulary. */
  tags: number;
  /** Whether it lands in the difficulty band the owner rates highest. */
  difficulty: number;
  /** How far it stands from what the owner rated 1 or 2. */
  distance: number;
}

export interface MagicBook {
  /** Stable per library and shelf, for the card's keys and the journal. */
  id: string;
  title: string;
  author?: string;
  /** Four-digit year of first publication, from the verifying source. */
  year?: number;
  /** Why this book, in the owner's own terms. */
  reason: string;
  /** The chance the owner likes it, 0..100. Absent until the library holds
   * enough rated books to calibrate one. */
  match?: number;
  rubric: MagicRubric;
  /** Cover from the verifying source, through the cover proxy. */
  coverUrl?: string;
  source: { name: string; url?: string };
  /** When the pick was made, UTC. */
  at: string;
}

export type MagicShelfStatus = 'ready' | 'empty' | 'ineligible';

export interface MagicShelfResult {
  shelfId: number;
  status: MagicShelfStatus;
  pick?: MagicBook;
  /** Why the shelf holds no pick right now, for the dossier. */
  note?: string;
}

export interface MagicBooksResponse {
  shelves: MagicShelfResult[];
  /** Rated books in the library; under the threshold the match is withheld. */
  ratedBooks: number;
}
