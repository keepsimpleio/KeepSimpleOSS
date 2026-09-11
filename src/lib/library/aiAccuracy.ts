import type { StrapiSingleShelfEntry } from '@local-types/library/library';
import type { IObject } from '@local-types/library/object';

import { htmlToPlainText } from '@lib/library/objectMeta';

/**
 * AI accuracy: how much of what the recommendation engine feeds on is
 * actually written into this library. It is a coverage score, worked out
 * from the library on screen, never from a model: 100 points across six
 * components, weights agreed with Wolf on 2026-09-10. The engine reads
 * every one of these fields and ignores what is missing, so an empty field
 * is a recommendation made with one eye shut.
 *
 * Books only: videos and audio carry no rating, notes, tags or difficulty.
 */

export type AccuracyComponentKey =
  | 'notes'
  | 'rating'
  | 'volume'
  | 'tags'
  | 'difficulty'
  | 'shelves';

export interface AccuracyComponent {
  key: AccuracyComponentKey;
  label: string;
  /** Points earned, already rounded to one decimal. */
  earned: number;
  /** Points on offer. */
  max: number;
  /** What the count stands at, in the owner's own units. */
  detail: string;
  /** The single cheapest step that raises this component, with its gain in
   * whole percent. Absent once the component is full. */
  next?: { action: string; gain: number };
}

export interface AccuracyReport {
  /** 0..100, rounded to a whole number. */
  total: number;
  components: AccuracyComponent[];
  /** The move that buys the most per book touched, with what it costs. */
  best?: { action: string; gain: number; cost: number };
  /** How many books the score was read from. */
  books: number;
}

export const ACCURACY_WEIGHTS: Record<AccuracyComponentKey, number> = {
  notes: 25,
  rating: 20,
  volume: 20,
  tags: 15,
  difficulty: 10,
  shelves: 10,
};

/** A note shorter than this is a label, not a takeaway. */
export const ACCURACY_NOTE_WORDS = 40;
/** Rated books at which the volume component is full. */
export const ACCURACY_VOLUME_FULL = 30;
/** Books rated 1 or 2 that fill the spread bonus. */
export const ACCURACY_LOW_RATED_FULL = 3;
/** Points of the rating component that go to coverage; the rest to spread. */
const RATING_COVERAGE_POINTS = 15;
/** Points of the tag component that go to coverage; the rest to reuse. */
const TAG_COVERAGE_POINTS = 12;

/**
 * Names that say what stage a book is at rather than what it is about. A
 * shelf named this way is not a subject, and the engine drops the name.
 * Matched on the whole name, lower-cased, punctuation stripped.
 */
const STAGE_NAMES = new Set([
  'reading',
  'reading now',
  'currently reading',
  'now reading',
  'in progress',
  'to read',
  'to be read',
  'tbr',
  'want to read',
  'wishlist',
  'wish list',
  'read',
  'done',
  'finished',
  'completed',
  'abandoned',
  'dnf',
  'did not finish',
  'dropped',
  'favorites',
  'favourites',
  'favorite',
  'favourite',
  'misc',
  'miscellaneous',
  'other',
  'others',
  'unsorted',
  'uncategorized',
  'uncategorised',
  'new',
  'books',
  'my books',
  'library',
  'shelf',
  'default',
  'general',
  'random',
  'all',
  'everything',
  'stuff',
  'various',
  'mixed',
  'queue',
  'backlog',
  'later',
  'someday',
  'paused',
  'on hold',
  'archive',
  'archived',
  'old',
  'recent',
  'recently added',
  'new arrivals',
  'unread',
  're-read',
  'reread',
  'rereading',
  'читаю',
  'прочитано',
  'прочитанное',
  'хочу прочитать',
  'к прочтению',
  'отложено',
  'брошено',
  'избранное',
  'разное',
  'прочее',
  'другое',
  'новое',
  'книги',
  'все',
  'полка',
]);

const normaliseName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Whether a shelf name carries a subject. A stage word, a bare year or
 * anything under three letters does not; everything else is taken as the
 * owner's own topic and handed to the engine verbatim.
 */
export function isTopicalShelfName(name: string): boolean {
  const clean = normaliseName(name);
  if (clean.length < 3) return false;
  if (STAGE_NAMES.has(clean)) return false;
  // A year, a year range or a plain number.
  if (/^\d{2,4}(\s*\d{2,4})?$/.test(clean)) return false;
  // "read in 2024", "2024 reads" and the like.
  if (
    /^(read|reads|reading|прочитано)?\s*(in\s*)?\d{4}\s*(reads|read)?$/.test(
      clean,
    )
  ) {
    return false;
  }
  return true;
}

export const noteWordCount = (description?: string | null): number => {
  const text = htmlToPlainText(description ?? '');
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
};

export const hasNote = (object: IObject): boolean =>
  noteWordCount(object.attributes.description) >= ACCURACY_NOTE_WORDS;

const isBook = (object: IObject) => object.attributes.type === 'book';

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Volume saturates on a log curve so the thirtieth rated book still counts
 * and the third one counts for a lot. */
const volumeShare = (rated: number) =>
  clamp01(Math.log(1 + rated) / Math.log(1 + ACCURACY_VOLUME_FULL));

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

export function scoreLibraryAccuracy(
  shelves: StrapiSingleShelfEntry[],
): AccuracyReport {
  const bookShelves = shelves.filter(shelf => shelf.attributes.type === 'book');
  const books = bookShelves.flatMap(shelf =>
    (shelf.attributes.objects?.data ?? []).filter(isBook),
  );
  const total = books.length;

  const withNote = books.filter(hasNote).length;
  const rated = books.filter(b => b.attributes.overall != null).length;
  const lowRated = books.filter(
    b => b.attributes.overall != null && b.attributes.overall <= 2,
  ).length;
  const tagged = books.filter(
    b => (b.attributes.tags?.data?.length ?? 0) > 0,
  ).length;
  const withDifficulty = books.filter(
    b => b.attributes.difficulty != null,
  ).length;
  const topical = bookShelves.filter(shelf =>
    isTopicalShelfName(shelf.attributes.name),
  ).length;

  // Tag reuse: a tag on two books links them; a tag on one book is a label
  // the engine cannot generalise from.
  const tagUse = new Map<number, number>();
  for (const book of books) {
    for (const tag of book.attributes.tags?.data ?? []) {
      tagUse.set(tag.id, (tagUse.get(tag.id) ?? 0) + 1);
    }
  }
  const distinctTags = tagUse.size;
  const reusedTags = Array.from(tagUse.values()).filter(n => n >= 2).length;

  const share = (n: number) => (total === 0 ? 0 : n / total);

  const notesPoints = ACCURACY_WEIGHTS.notes * share(withNote);
  const ratingPoints =
    RATING_COVERAGE_POINTS * share(rated) +
    (ACCURACY_WEIGHTS.rating - RATING_COVERAGE_POINTS) *
      clamp01(lowRated / ACCURACY_LOW_RATED_FULL);
  const volumePoints = ACCURACY_WEIGHTS.volume * volumeShare(rated);
  const tagPoints =
    TAG_COVERAGE_POINTS * share(tagged) +
    (ACCURACY_WEIGHTS.tags - TAG_COVERAGE_POINTS) *
      (distinctTags === 0 ? 0 : reusedTags / distinctTags);
  const difficultyPoints = ACCURACY_WEIGHTS.difficulty * share(withDifficulty);
  const shelfPoints =
    bookShelves.length === 0
      ? 0
      : ACCURACY_WEIGHTS.shelves * (topical / bookShelves.length);

  // What each signal still has on the table, and what it costs to take it.
  // The whole of the missing work, not a token step: a step sized to move the
  // total by a single percent answered "write notes on 7 more books, +1%" to
  // an owner with thirty-three books carrying none, which reads as a shrug
  // where the real answer was five points (Wolf, 2026-09-11).
  //
  // A move is a pair: the points it is worth, and how many things the owner
  // must touch to earn them. The best win is the one that pays most per book,
  // because that is the fastest way up, and among equals the one that pays
  // most in total.
  interface Move {
    key: AccuracyComponentKey;
    action: string;
    /** Points the move is worth in full. */
    gain: number;
    /** Books, tags or shelves the owner must touch. */
    cost: number;
  }
  const moves: Move[] = [];
  const add = (move: Move) => {
    if (move.cost > 0 && move.gain > 0) moves.push(move);
  };

  const notesMissing = total - withNote;
  add({
    key: 'notes',
    action: `Write notes on ${plural(notesMissing, 'more book', 'more books')}`,
    gain: ACCURACY_WEIGHTS.notes - notesPoints,
    cost: notesMissing,
  });

  // Rating a book pays twice: the coverage half of the rating signal, and
  // whatever the volume curve still has left at that count.
  const ratedMissing = total - rated;
  add({
    key: 'rating',
    action: `Rate ${plural(ratedMissing, 'more book', 'more books')}`,
    gain:
      RATING_COVERAGE_POINTS * (1 - share(rated)) +
      ACCURACY_WEIGHTS.volume * (volumeShare(total) - volumeShare(rated)),
    cost: ratedMissing,
  });

  const lowMissing = Math.max(0, ACCURACY_LOW_RATED_FULL - lowRated);
  add({
    key: 'rating',
    action: `Rate ${plural(lowMissing, 'book', 'books')} you did not like`,
    gain:
      (ACCURACY_WEIGHTS.rating - RATING_COVERAGE_POINTS) *
      (1 - clamp01(lowRated / ACCURACY_LOW_RATED_FULL)),
    cost: lowMissing,
  });

  const tagMissing = total - tagged;
  add({
    key: 'tags',
    action: `Tag ${plural(tagMissing, 'more book', 'more books')}`,
    gain: TAG_COVERAGE_POINTS * (1 - share(tagged)),
    cost: tagMissing,
  });

  const tagsAlone = distinctTags - reusedTags;
  add({
    key: 'tags',
    action: `Put ${plural(tagsAlone, 'tag', 'tags')} on a second book`,
    gain:
      distinctTags === 0
        ? 0
        : (ACCURACY_WEIGHTS.tags - TAG_COVERAGE_POINTS) *
          (1 - reusedTags / distinctTags),
    cost: tagsAlone,
  });

  const difficultyMissing = total - withDifficulty;
  add({
    key: 'difficulty',
    action: `Set difficulty on ${plural(difficultyMissing, 'more book', 'more books')}`,
    gain: ACCURACY_WEIGHTS.difficulty - difficultyPoints,
    cost: difficultyMissing,
  });

  const shelfMissing = bookShelves.length - topical;
  add({
    key: 'shelves',
    action: `Name ${plural(shelfMissing, 'shelf', 'shelves')} by its theme`,
    gain: ACCURACY_WEIGHTS.shelves - shelfPoints,
    cost: shelfMissing,
  });

  // Most percent per thing touched first; a tie goes to the bigger total.
  const ranked = [...moves].sort(
    (a, b) => b.gain / b.cost - a.gain / a.cost || b.gain - a.gain,
  );
  const bestOf = (key: AccuracyComponentKey) =>
    ranked.find(move => move.key === key);

  const nextOf = (move?: Move): AccuracyComponent['next'] | undefined =>
    move && move.gain >= 0.5
      ? { action: move.action, gain: Math.round(move.gain) }
      : undefined;

  const components: AccuracyComponent[] = [
    {
      key: 'notes',
      label: 'Notes and takeaways',
      earned: round1(notesPoints),
      max: ACCURACY_WEIGHTS.notes,
      detail: `Notes of ${ACCURACY_NOTE_WORDS}+ words on ${withNote} of ${plural(total, 'book', 'books')}`,
      next: nextOf(bestOf('notes')),
    },
    {
      key: 'rating',
      label: 'Ratings',
      earned: round1(ratingPoints),
      max: ACCURACY_WEIGHTS.rating,
      detail: `${rated} of ${total} rated, ${lowRated} of them 1 or 2`,
      next: nextOf(bestOf('rating')),
    },
    {
      key: 'volume',
      label: 'Sample size',
      earned: round1(volumePoints),
      max: ACCURACY_WEIGHTS.volume,
      detail: `${plural(rated, 'rated book', 'rated books')} to read you by, full at ${ACCURACY_VOLUME_FULL}`,
      // Volume is not filled on its own: rating books fills it, and that move
      // is counted once, on the rating row.
      next: undefined,
    },
    {
      key: 'tags',
      label: 'Tags',
      earned: round1(tagPoints),
      max: ACCURACY_WEIGHTS.tags,
      detail: `${tagged} of ${total} tagged, ${reusedTags} of ${plural(distinctTags, 'tag', 'tags')} on more than one book`,
      next: nextOf(bestOf('tags')),
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      earned: round1(difficultyPoints),
      max: ACCURACY_WEIGHTS.difficulty,
      detail: `Difficulty set on ${withDifficulty} of ${total} books`,
      next: nextOf(bestOf('difficulty')),
    },
    {
      key: 'shelves',
      label: 'Themed shelves',
      earned: round1(shelfPoints),
      max: ACCURACY_WEIGHTS.shelves,
      detail: `${topical} of ${plural(bookShelves.length, 'shelf', 'shelves')} named by their theme`,
      next: nextOf(bestOf('shelves')),
    },
  ];

  const sum = components.reduce((acc, c) => acc + c.earned, 0);

  // The best win: the move that pays most per book touched, of those worth a
  // whole percent. Its cost travels with it, because "+5%" is only an answer
  // when the owner can see what it costs.
  const winner = ranked.find(move => Math.round(move.gain) >= 1);
  const best = winner
    ? {
        action: winner.action,
        gain: Math.round(winner.gain),
        cost: winner.cost,
      }
    : undefined;

  return { total: Math.round(sum), components, best, books: total };
}
