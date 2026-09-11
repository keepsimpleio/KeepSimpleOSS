import type {
  MagicBook,
  MagicRubric,
  MagicShelfResult,
} from '@local-types/library/magicBook';

import type { DigestBook, DigestShelf, LibraryDigest } from './digest';
import { normaliseTitle } from './digest';
import { askRelay, parseJsonReply, RelayError } from './relay';
import { verifyBook } from './verify';

/**
 * The engine behind the magic book. One model call per batch of shelves;
 * the model reads the owner's whole library (ratings, notes, tags,
 * difficulty, shelf names where they carry a subject) and proposes ranked
 * candidates per shelf with a rubric each. The percent is worked out here,
 * from the rubric and a fixed formula, never taken from the model's mouth.
 * Every candidate is verified against a book source before it is shown.
 */

export const MAGIC_MODEL = 'claude-opus-5';
/** Wolf's setting for the Library's picks: Opus 5 at high effort. */
export const MAGIC_EFFORT = 'high' as const;

/** Which subscription track and model answered a run. */
export interface MagicServed {
  slot: string;
  model: string;
  transport: string;
}
/** Shelves per model call: beyond this the batch is chunked. */
export const MAGIC_BATCH_SIZE = 10;
/** Candidates asked for per shelf: the first verified one stands. */
const CANDIDATES_PER_SHELF = 5;
/** Rated books below which no percent is shown. */
export const MAGIC_MIN_RATED_FOR_MATCH = 3;
/** Rated books held out for calibration, by how many there are. */
const heldOutCount = (rated: number) => (rated >= 10 ? 5 : rated >= 6 ? 3 : 0);
/** Each rating point the model is off moves the shown percent this much. */
const CALIBRATION_PERCENT_PER_POINT = 8;
const CALIBRATION_CLAMP = 16;

/** Weights of the rubric dimensions. A dimension the library carries no
 * data for is dropped and the rest are renormalised. */
const RUBRIC_WEIGHTS: Record<keyof MagicRubric, number> = {
  notes: 30,
  theme: 20,
  tags: 20,
  difficulty: 15,
  distance: 15,
};

interface ModelCandidate {
  title: string;
  author?: string;
  about: string;
  reason: string;
  rubric: MagicRubric;
}

interface ModelShelf {
  shelfId: number;
  candidates: ModelCandidate[];
}

interface ModelAnswer {
  shelves: ModelShelf[];
  calibration?: { bookId: number; predicted: number }[];
}

const TOOL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['shelves', 'calibration'],
  properties: {
    shelves: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['shelfId', 'candidates'],
        properties: {
          shelfId: { type: 'integer' },
          candidates: {
            type: 'array',
            maxItems: CANDIDATES_PER_SHELF,
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['title', 'author', 'about', 'reason', 'rubric'],
              properties: {
                title: { type: 'string' },
                author: { type: 'string' },
                about: {
                  type: 'string',
                  description:
                    'What the book is: subject, argument and shape, in two or three sentences, for a reader who has never heard of it. Third person, no second person, no marketing.',
                },
                reason: {
                  type: 'string',
                  description:
                    'One or two sentences to the owner, second person, grounded in what they wrote. No marketing.',
                },
                rubric: {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'theme',
                    'notes',
                    'tags',
                    'difficulty',
                    'distance',
                  ],
                  properties: {
                    theme: { type: 'integer', minimum: 0, maximum: 5 },
                    notes: { type: 'integer', minimum: 0, maximum: 5 },
                    tags: { type: 'integer', minimum: 0, maximum: 5 },
                    difficulty: { type: 'integer', minimum: 0, maximum: 5 },
                    distance: { type: 'integer', minimum: 0, maximum: 5 },
                  },
                },
              },
            },
          },
        },
      },
    },
    calibration: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['bookId', 'predicted'],
        properties: {
          bookId: { type: 'integer' },
          predicted: { type: 'integer', minimum: 1, maximum: 5 },
        },
      },
    },
  },
};

const SYSTEM = `You recommend one book per shelf to the owner of a personal library.

You are given the owner's library: shelves with their books, and for each book whatever the owner wrote: a rating 1-5, a difficulty (very_hard, hard, moderate, easy), tags from the owner's own vocabulary, and a note (the owner's takeaways). A shelf carries its name only when the name is a subject; a shelf without a name is defined by its books alone. Fields that are absent were never written: do not guess them, do not treat absence as average.

How to read the signals, in order of weight:
1. Ratings are labels. Books rated 5 define what this owner likes; books rated 1 or 2 are negative examples and matter as much. Never recommend toward a negative example.
2. Notes say why. Find the axis the owner praises (method, density, applicability, tone, structure) and recommend along that axis, not along genre.
3. Tags are the owner's ontology; a match on a rarely used tag is worth more than a match on a common one.
4. Difficulty is calibration: the pick should land in the band where the owner's ratings are highest.
5. The shelf name, when given, sets the subject the pick must belong to; the books on the shelf set the level and the style. When name and books disagree, the name wins on subject, the books on level and style.

Rules:
- Propose up to ${CANDIDATES_PER_SHELF} candidates per shelf, best first. Only real, published books with their real author. No invented titles.
- Never propose a book on the exclusion lists, nor any book already in the library, nor another edition of one.
- For a shelf with no books, propose nothing.
- Score each candidate on the rubric, 0-5 integers: theme (fits the shelf's subject), notes (runs along the praised axis), tags (fits the owner's vocabulary), difficulty (lands in the owner's best band), distance (far from the owner's negative examples). Score 0 on a dimension when the library carries no data for it.
- Two separate texts per candidate, and neither may do the other's work. \`about\` says what the book IS: subject, argument, shape, two or three sentences, third person, as an encyclopedia entry would, never addressed to the owner. \`reason\` says why THIS owner gets it: one or two sentences, second person, grounded in their own notes and ratings. No adjectives that cannot be checked, no dashes.
- Calibration: for each book in the calibration block, predict the rating this owner gave it, 1-5, from everything else you know about them.`;

export const describeBook = (book: DigestBook, withRating: boolean): string => {
  const parts: string[] = [`#${book.id} "${book.title}"`];
  if (book.author) parts.push(`by ${book.author}`);
  if (book.year) parts.push(`(${book.year})`);
  if (withRating && book.rating != null) parts.push(`rating ${book.rating}/5`);
  if (book.difficulty) parts.push(`difficulty ${book.difficulty}`);
  if (book.tags?.length) parts.push(`tags: ${book.tags.join(', ')}`);
  let line = parts.join(' ');
  if (book.note) line += `\n    note: ${book.note.replace(/\n+/g, ' ')}`;
  return line;
};

const buildUserBlock = (
  digest: LibraryDigest,
  batch: DigestShelf[],
  heldOut: DigestBook[],
  exclusions: Map<number, string[]>,
  banned: string[],
): string => {
  const held = new Set(heldOut.map(b => b.id));
  const lines: string[] = [];
  lines.push('LIBRARY');
  for (const shelf of digest.shelves) {
    const head = shelf.name
      ? `Shelf #${shelf.id} "${shelf.name}"`
      : `Shelf #${shelf.id} (no subject in the name)`;
    lines.push(
      head + (shelf.description ? `\n  about: ${shelf.description}` : ''),
    );
    if (shelf.books.length === 0) lines.push('  (empty)');
    for (const book of shelf.books) {
      lines.push(`  ${describeBook(book, !held.has(book.id))}`);
    }
  }
  lines.push('');
  lines.push(
    `SIGNALS PRESENT: notes ${digest.signals.notes ? 'yes' : 'no'}, tags ${digest.signals.tags ? 'yes' : 'no'}, difficulty ${digest.signals.difficulty ? 'yes' : 'no'}, negative examples ${digest.signals.lowRated ? 'yes' : 'no'}.`,
  );
  lines.push('');
  lines.push(`RECOMMEND FOR SHELVES: ${batch.map(s => `#${s.id}`).join(', ')}`);
  for (const shelf of batch) {
    const ex = exclusions.get(shelf.id) ?? [];
    if (ex.length)
      lines.push(`Shelf #${shelf.id} already rolled past: ${ex.join('; ')}`);
  }
  if (banned.length)
    lines.push(`BANNED BY THE OWNER (never propose): ${banned.join('; ')}`);
  lines.push('');
  if (heldOut.length) {
    lines.push('CALIBRATION (ratings withheld above; predict them):');
    for (const book of heldOut)
      lines.push(
        `  #${book.id} "${book.title}"${book.author ? ` by ${book.author}` : ''}`,
      );
  } else {
    lines.push('CALIBRATION: none.');
  }
  return lines.join('\n');
};

/**
 * One turn on the subscription relay. The relay runs Opus through the Claude
 * Code CLI, which answers in text and takes no tools, so the schema is put
 * in the prompt and the JSON is read back out of the text. Every failure
 * the relay could not cure with another track surfaces as a RelayError.
 */
async function callModel(
  userBlock: string,
): Promise<{ answer: ModelAnswer | null; served: MagicServed }> {
  const reply = await askRelay({
    model: MAGIC_MODEL,
    effort: MAGIC_EFFORT,
    maxTokens: 6000,
    system: `${SYSTEM}

OUTPUT. Answer with one JSON object and nothing else, no prose before or after it, matching this JSON schema exactly:
${JSON.stringify(TOOL_SCHEMA)}`,
    prompt: userBlock,
  });
  const served = {
    slot: reply.slot,
    model: reply.model,
    transport: reply.transport,
  };
  let answer: ModelAnswer | null = null;
  try {
    answer = parseJsonReply<ModelAnswer>(reply.text);
  } catch {
    answer = null;
  }
  if (answer && !Array.isArray(answer.shelves)) answer = null;
  return { answer, served };
}

/** Held-out books: the strongest and weakest verdicts, spread over shelves,
 * chosen deterministically so a re-roll calibrates on the same set. */
export const pickHeldOut = (digest: LibraryDigest): DigestBook[] => {
  const count = heldOutCount(digest.ratedBooks);
  if (count === 0) return [];
  const rated = digest.shelves
    .flatMap(s => s.books)
    .filter(b => b.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.id - b.id);
  const out: DigestBook[] = [];
  let lo = 0;
  let hi = rated.length - 1;
  while (out.length < count && lo <= hi) {
    out.push(rated[lo]);
    lo += 1;
    if (out.length < count && hi >= lo) {
      out.push(rated[hi]);
      hi -= 1;
    }
  }
  return out;
};

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/** Rubric to percent: weighted mean of the dimensions the library carries
 * data for, over 5, as a whole percent, moved by the calibration offset. */
export function rubricToPercent(
  rubric: MagicRubric,
  signals: LibraryDigest['signals'],
  calibration: number,
): number {
  const active: (keyof MagicRubric)[] = ['theme'];
  if (signals.notes) active.push('notes');
  if (signals.tags) active.push('tags');
  if (signals.difficulty) active.push('difficulty');
  if (signals.lowRated) active.push('distance');
  const weight = active.reduce((acc, k) => acc + RUBRIC_WEIGHTS[k], 0);
  const raw =
    active.reduce(
      (acc, k) => acc + RUBRIC_WEIGHTS[k] * clamp(rubric[k] ?? 0, 0, 5),
      0,
    ) /
    (weight * 5);
  return Math.round(clamp(raw * 100 + calibration, 5, 97));
}

export const calibrationOffset = (
  answer: { calibration?: { bookId: number; predicted: number }[] },
  heldOut: DigestBook[],
): { offset: number; samples: number } => {
  const predictions = new Map(
    (answer.calibration ?? []).map(c => [c.bookId, c.predicted]),
  );
  const errors: number[] = [];
  for (const book of heldOut) {
    const predicted = predictions.get(book.id);
    if (predicted == null || book.rating == null) continue;
    errors.push(book.rating - predicted);
  }
  if (errors.length === 0) return { offset: 0, samples: 0 };
  const mean = errors.reduce((a, b) => a + b, 0) / errors.length;
  return {
    offset: clamp(
      mean * CALIBRATION_PERCENT_PER_POINT,
      -CALIBRATION_CLAMP,
      CALIBRATION_CLAMP,
    ),
    samples: errors.length,
  };
};

export interface EngineRun {
  results: MagicShelfResult[];
  /** Model calls made. */
  calls: number;
  /** Candidates that no source could confirm, by shelf. */
  unverified: Record<number, string[]>;
  calibration: { offset: number; samples: number };
  errors: string[];
  /** Which track and model answered, or null when none did. */
  served: MagicServed | null;
  /** True when the relay reported every track failed, or is unreachable. */
  tracksExhausted: boolean;
  /** Shelves whose run ended in a model failure rather than a verdict:
   * nothing about them is to be remembered, so the next load tries again. */
  failed: number[];
}

/**
 * Picks for the given shelves. `exclusions` carries, per shelf, the titles
 * rolled past; `banned` the library-wide bans; `owned` every title in the
 * library. Shelves without books come back ineligible without a call.
 */
export async function runEngine(
  digest: LibraryDigest,
  shelves: DigestShelf[],
  exclusions: Map<number, string[]>,
  banned: string[],
): Promise<EngineRun> {
  const results: MagicShelfResult[] = [];
  const unverified: Record<number, string[]> = {};
  const errors: string[] = [];
  let calls = 0;
  let calibration = { offset: 0, samples: 0 };
  let served: MagicServed | null = null;
  let tracksExhausted = false;
  const failed: number[] = [];

  const eligible = shelves.filter(shelf => {
    if (shelf.books.length > 0) return true;
    results.push({
      shelfId: shelf.id,
      status: 'ineligible',
      note: 'Put a book on this shelf and one will be recommended.',
    });
    return false;
  });

  const owned = new Set(digest.ownedTitles.map(normaliseTitle));
  const bannedSet = new Set(banned.map(normaliseTitle));
  const heldOut = pickHeldOut(digest);
  const showMatch = digest.ratedBooks >= MAGIC_MIN_RATED_FOR_MATCH;

  for (let i = 0; i < eligible.length; i += MAGIC_BATCH_SIZE) {
    let batch = eligible.slice(i, i + MAGIC_BATCH_SIZE);
    const batchExclusions = new Map(
      batch.map(s => [s.id, [...(exclusions.get(s.id) ?? [])]]),
    );
    // Two passes: the second lists what the first proposed that no source
    // could confirm, so the model does not offer it again.
    for (let pass = 0; pass < 2 && batch.length > 0; pass++) {
      let answer: ModelAnswer | null = null;
      try {
        calls += 1;
        const reply = await callModel(
          buildUserBlock(digest, batch, heldOut, batchExclusions, banned),
        );
        answer = reply.answer;
        served = reply.served;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'model');
        if (
          error instanceof RelayError &&
          (error.exhausted || error.status === 0)
        ) {
          tracksExhausted = true;
        }
        failed.push(...batch.map(s => s.id));
        break;
      }
      if (!answer) {
        errors.push('model reply was not the JSON asked for');
        failed.push(...batch.map(s => s.id));
        break;
      }
      if (pass === 0 && heldOut.length) {
        calibration = calibrationOffset(answer, heldOut);
      }
      const byShelf = new Map(
        answer.shelves.map(s => [s.shelfId, s.candidates]),
      );
      const stillEmpty: DigestShelf[] = [];
      await Promise.all(
        batch.map(async shelf => {
          const candidates = (byShelf.get(shelf.id) ?? []).filter(c => {
            const key = normaliseTitle(c.title);
            const past = new Set(
              (batchExclusions.get(shelf.id) ?? []).map(normaliseTitle),
            );
            return (
              key && !owned.has(key) && !bannedSet.has(key) && !past.has(key)
            );
          });
          for (const candidate of candidates) {
            const { book, errors: verifyErrors } = await verifyBook(
              candidate.title,
              candidate.author,
            );
            errors.push(...verifyErrors);
            if (!book) {
              (unverified[shelf.id] ??= []).push(candidate.title);
              batchExclusions.get(shelf.id)?.push(candidate.title);
              continue;
            }
            const verifiedKey = normaliseTitle(book.title);
            if (owned.has(verifiedKey) || bannedSet.has(verifiedKey)) continue;
            const pick: MagicBook = {
              id: `magic-${digest.libraryId}-${shelf.id}-${verifiedKey.replace(/\s+/g, '-').slice(0, 40)}`,
              title: book.title,
              author: book.author ?? candidate.author,
              year: book.year,
              about: candidate.about,
              reason: candidate.reason,
              rubric: candidate.rubric,
              coverUrl: book.coverUrl,
              source: book.source,
              at: new Date().toISOString(),
            };
            if (showMatch) {
              pick.match = rubricToPercent(
                candidate.rubric,
                digest.signals,
                calibration.offset,
              );
            }
            results.push({ shelfId: shelf.id, status: 'ready', pick });
            return;
          }
          stillEmpty.push(shelf);
        }),
      );
      batch = stillEmpty;
    }
    for (const shelf of batch) {
      results.push({
        shelfId: shelf.id,
        status: 'empty',
        note: tracksExhausted
          ? 'The engine is out of reach right now. Roll again in a while.'
          : 'Nothing could be confirmed for this shelf this time. Roll again.',
      });
    }
  }

  return {
    results,
    calls,
    unverified,
    calibration,
    errors,
    served,
    tracksExhausted,
    failed,
  };
}
