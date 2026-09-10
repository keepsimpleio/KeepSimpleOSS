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
  /** The step across every component that buys the most per book touched. */
  best?: { action: string; gain: number };
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

  // The cheapest step per component: a handful of books, or fewer when the
  // component is nearly full. Gains are the whole-percent difference, since
  // the total is what the owner sees.
  const step = (missing: number) => Math.min(missing, 4);

  const notesMissing = total - withNote;
  const notesStep = step(notesMissing);
  const notesGain =
    notesStep === 0
      ? 0
      : ACCURACY_WEIGHTS.notes * share(withNote + notesStep) - notesPoints;

  const ratedMissing = total - rated;
  const ratedStep = step(ratedMissing);
  const ratedGain =
    ratedStep === 0
      ? 0
      : RATING_COVERAGE_POINTS * share(rated + ratedStep) -
        RATING_COVERAGE_POINTS * share(rated) +
        ACCURACY_WEIGHTS.volume * volumeShare(rated + ratedStep) -
        volumePoints;
  const lowMissing = Math.max(0, ACCURACY_LOW_RATED_FULL - lowRated);
  const lowGain =
    lowMissing === 0
      ? 0
      : (ACCURACY_WEIGHTS.rating - RATING_COVERAGE_POINTS) *
        (1 - clamp01(lowRated / ACCURACY_LOW_RATED_FULL));

  const tagMissing = total - tagged;
  const tagStep = step(tagMissing);
  const tagGain =
    tagStep === 0
      ? 0
      : TAG_COVERAGE_POINTS * share(tagged + tagStep) -
        TAG_COVERAGE_POINTS * share(tagged);

  const difficultyMissing = total - withDifficulty;
  const difficultyStep = step(difficultyMissing);
  const difficultyGain =
    difficultyStep === 0
      ? 0
      : ACCURACY_WEIGHTS.difficulty * share(withDifficulty + difficultyStep) -
        difficultyPoints;

  const shelfMissing = bookShelves.length - topical;
  const shelfGain =
    shelfMissing === 0 || bookShelves.length === 0
      ? 0
      : ACCURACY_WEIGHTS.shelves / bookShelves.length;

  const nextOf = (
    gain: number,
    action: string,
  ): AccuracyComponent['next'] | undefined =>
    gain >= 0.5 ? { action, gain: Math.round(gain) } : undefined;

  const components: AccuracyComponent[] = [
    {
      key: 'notes',
      label: 'Notes and takeaways',
      earned: round1(notesPoints),
      max: ACCURACY_WEIGHTS.notes,
      detail: `${withNote} of ${plural(total, 'book', 'books')} with ${ACCURACY_NOTE_WORDS}+ words`,
      next: nextOf(
        notesGain,
        `Write notes on ${plural(notesStep, 'more book', 'more books')}`,
      ),
    },
    {
      key: 'rating',
      label: 'Ratings',
      earned: round1(ratingPoints),
      max: ACCURACY_WEIGHTS.rating,
      detail: `${rated} rated, ${lowRated} rated 1 or 2`,
      next:
        ratedStep > 0 && ratedGain >= lowGain
          ? nextOf(
              ratedGain,
              `Rate ${plural(ratedStep, 'more book', 'more books')}`,
            )
          : nextOf(
              lowGain,
              `Rate ${plural(lowMissing, 'book', 'books')} you did not like`,
            ),
    },
    {
      key: 'volume',
      label: 'Rated volume',
      earned: round1(volumePoints),
      max: ACCURACY_WEIGHTS.volume,
      detail: `${rated} rated, full at ${ACCURACY_VOLUME_FULL}`,
      next:
        ratedStep > 0
          ? nextOf(
              ACCURACY_WEIGHTS.volume * volumeShare(rated + ratedStep) -
                volumePoints,
              `Rate ${plural(ratedStep, 'more book', 'more books')}`,
            )
          : undefined,
    },
    {
      key: 'tags',
      label: 'Tags',
      earned: round1(tagPoints),
      max: ACCURACY_WEIGHTS.tags,
      detail: `${tagged} tagged, ${reusedTags} of ${plural(distinctTags, 'tag', 'tags')} reused`,
      next: nextOf(
        tagGain,
        `Tag ${plural(tagStep, 'more book', 'more books')}`,
      ),
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      earned: round1(difficultyPoints),
      max: ACCURACY_WEIGHTS.difficulty,
      detail: `${withDifficulty} of ${total} set`,
      next: nextOf(
        difficultyGain,
        `Set difficulty on ${plural(difficultyStep, 'more book', 'more books')}`,
      ),
    },
    {
      key: 'shelves',
      label: 'Themed shelves',
      earned: round1(shelfPoints),
      max: ACCURACY_WEIGHTS.shelves,
      detail: `${topical} of ${plural(bookShelves.length, 'shelf', 'shelves')} named by theme`,
      next: nextOf(shelfGain, 'Name one more shelf by its theme'),
    },
  ];

  const sum = components.reduce((acc, c) => acc + c.earned, 0);

  // The best step is the one that buys the most percent per book touched:
  // the rating step also fills volume, so its gain is counted together.
  const candidates: { action: string; gain: number; cost: number }[] = [];
  if (notesStep > 0) {
    candidates.push({
      action: components[0].next?.action ?? '',
      gain: notesGain,
      cost: notesStep,
    });
  }
  if (ratedStep > 0) {
    candidates.push({
      action: `Rate ${plural(ratedStep, 'more book', 'more books')}`,
      gain: ratedGain,
      cost: ratedStep,
    });
  }
  if (lowMissing > 0 && ratedStep === 0) {
    candidates.push({
      action: `Rate ${plural(lowMissing, 'book', 'books')} you did not like`,
      gain: lowGain,
      cost: lowMissing,
    });
  }
  if (tagStep > 0) {
    candidates.push({
      action: components[3].next?.action ?? '',
      gain: tagGain,
      cost: tagStep,
    });
  }
  if (difficultyStep > 0) {
    candidates.push({
      action: components[4].next?.action ?? '',
      gain: difficultyGain,
      cost: difficultyStep,
    });
  }
  if (shelfGain > 0) {
    candidates.push({
      action: 'Name one more shelf by its theme',
      gain: shelfGain,
      cost: 1,
    });
  }
  const best = candidates
    .filter(c => c.action && Math.round(c.gain) >= 1)
    .sort((a, b) => b.gain / b.cost - a.gain / a.cost)[0];

  return {
    total: Math.round(sum),
    components,
    best: best
      ? { action: best.action, gain: Math.round(best.gain) }
      : undefined,
    books: total,
  };
}
