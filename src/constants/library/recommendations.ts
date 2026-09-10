import type { RecommendedPreference } from '@local-types/library/recommendation';

export const RECOMMENDED_SHELF_NAME = 'Personalized Recommendations (Private)';

/** Said on the shelf's settings control: the shelf is the owner's alone. */
export const RECOMMENDED_SHELF_HINT = 'Only you can see this shelf';

/** Shown on the board when a roll left nothing standing. */
export const RECOMMENDED_SHELF_EMPTY =
  'Nothing stands here yet. Re-roll the shelf.';

/** Picks on the board. Mirrors AI_SHELF_SIZE on the server. */
export const RECOMMENDED_SHELF_SIZE = 13;

/** Of those, the ones that stand beyond the library. */
export const RECOMMENDED_SHELF_STRETCH = 3;

/** Books the library must hold before the shelf opens. Mirrors
 * AI_SHELF_MIN_BOOKS on the server, which is the one that decides. */
export const RECOMMENDED_SHELF_MIN_BOOKS = 30;

export const lockedLine = (required: number) =>
  `Read at least ${required} books to unlock this shelf`;

/** What the shelf deals in. The owner's choice is remembered and holds for
 * every later roll. */
export const RECOMMENDED_PREFERENCES: {
  value: RecommendedPreference;
  label: string;
  hint: string;
}[] = [
  { value: 'any', label: 'Any', hint: 'Fiction and non-fiction both' },
  {
    value: 'nonfiction',
    label: 'Non-Fiction',
    hint: 'Only non-fiction, on every roll',
  },
  { value: 'fiction', label: 'Fiction', hint: 'Only fiction, on every roll' },
];
