import type { MagicRubric } from '@local-types/library/magicBook';
import type {
  RecommendedKind,
  RecommendedPick,
  RecommendedPreference,
} from '@local-types/library/recommendation';

import type { DigestBook, LibraryDigest } from '@lib/library/magic/digest';
import { normaliseTitle } from '@lib/library/magic/digest';
import {
  calibrationOffset,
  clamp,
  describeBook,
  MAGIC_MIN_RATED_FOR_MATCH,
  type MagicServed,
  pickHeldOut,
  rubricToPercent,
} from '@lib/library/magic/engine';
import { askRelay, parseJsonReply, RelayError } from '@lib/library/magic/relay';
import { verifyBook } from '@lib/library/magic/verify';

/**
 * The engine behind the AI shelf. It reads the owner's whole library and
 * stocks a board of thirteen books they do not own: ten that answer the
 * library as it stands, three that stand beyond it, on ground the library
 * does not cover but the owner is ready for.
 *
 * The two halves are asked for in two calls that run side by side. They are
 * independent questions, and one call carrying both took long enough to
 * meet the edge's request timeout on a proxied host; two shorter answers in
 * parallel cost the same subscription and land in about half the time.
 *
 * The percent is worked out here, from the rubric and a fixed formula,
 * never taken from the model's mouth, and every candidate is confirmed
 * against a book source before it stands. The owner's fiction setting is a
 * hard constraint on the call, not a filter after it.
 */

export const AI_SHELF_MODEL = 'claude-opus-5';
/** Wolf's setting for the Library's picks: Opus 5 at high effort. */
export const AI_SHELF_EFFORT = 'high' as const;

/** Books the library must hold before the shelf opens (Wolf, 2026-09-10). */
export const AI_SHELF_MIN_BOOKS = 30;
/** Picks standing on the board. */
export const AI_SHELF_SIZE = 13;
/** Of those, the ones that stand beyond the library. */
export const AI_SHELF_STRETCH = 3;
export const AI_SHELF_FIT = AI_SHELF_SIZE - AI_SHELF_STRETCH;
/** Verified spares kept behind the board, so a single departure costs no
 * model call. */
export const AI_SHELF_BENCH = 6;
/** Where the stretch picks stand when nothing is locked: they punctuate the
 * row rather than being exiled to its end. */
const STRETCH_SLOTS = [3, 7, 11];

/**
 * Asked for per half: more than the board needs, because a candidate no
 * source can confirm never stands, and what is left over sits on the bench.
 *
 * The ceiling that sets these numbers is not the model, it is the road to it.
 * Between a project container and the relay stands an edge that closes a
 * request at 100 seconds, and two opus calls measured from production at
 * high effort took 107 and 117. Latency here is mostly what the model
 * writes, so the ask is cut to what the board actually needs plus a little,
 * and the second pass covers a candidate no source could confirm. Nothing
 * about the picks themselves is lowered: still opus 5, still high effort.
 */
const ASK: Record<RecommendedKind, number> = { fit: 12, stretch: 5 };
/** Book sources queried at once. */
const VERIFY_CONCURRENCY = 6;

/** A stretch pick is scored on the same dimensions read differently, so it
 * carries its own weights: can the owner reach it, does it connect to
 * something they care about, and is the ground genuinely new. */
const STRETCH_WEIGHTS: Record<keyof MagicRubric, number> = {
  difficulty: 30,
  theme: 20,
  notes: 20,
  distance: 20,
  tags: 10,
};

interface ModelCandidate {
  title: string;
  author?: string;
  reason: string;
  newGround?: string;
  rubric: MagicRubric;
}

interface ModelAnswer {
  candidates: ModelCandidate[];
  calibration?: { bookId: number; predicted: number }[];
}

const RUBRIC_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['theme', 'notes', 'tags', 'difficulty', 'distance'],
  properties: {
    theme: { type: 'integer', minimum: 0, maximum: 5 },
    notes: { type: 'integer', minimum: 0, maximum: 5 },
    tags: { type: 'integer', minimum: 0, maximum: 5 },
    difficulty: { type: 'integer', minimum: 0, maximum: 5 },
    distance: { type: 'integer', minimum: 0, maximum: 5 },
  },
};

const schemaFor = (kind: RecommendedKind, count: number) => {
  const stretch = kind === 'stretch';
  return {
    type: 'object',
    additionalProperties: false,
    required: stretch ? ['candidates'] : ['candidates', 'calibration'],
    properties: {
      candidates: {
        type: 'array',
        maxItems: count,
        items: {
          type: 'object',
          additionalProperties: false,
          required: stretch
            ? ['title', 'author', 'reason', 'newGround', 'rubric']
            : ['title', 'author', 'reason', 'rubric'],
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            reason: {
              type: 'string',
              description: stretch
                ? 'One or two sentences on what this opens for the owner and why they can take it on now.'
                : 'One or two sentences to the owner, second person, grounded in what they wrote. No marketing.',
            },
            ...(stretch
              ? {
                  newGround: {
                    type: 'string',
                    description:
                      'The ground it opens, three or four words, lower case.',
                  },
                }
              : {}),
            rubric: RUBRIC_SCHEMA,
          },
        },
      },
      ...(stretch
        ? {}
        : {
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
          }),
    },
  };
};

const PREFERENCE_RULE: Record<RecommendedPreference, string> = {
  any: 'The owner reads both fiction and non-fiction. Either is welcome.',
  nonfiction:
    'NON-FICTION ONLY. Every candidate must be non-fiction. A novel, a short story collection, a play or any other work of fiction is a wrong answer, however well it would fit.',
  fiction:
    'FICTION ONLY. Every candidate must be a work of fiction: novels, story collections, plays, narrative verse. A textbook, a manual, a biography or any other non-fiction is a wrong answer, however well it would fit.',
};

const READING_THE_LIBRARY = `You are given the whole library: shelves with their books, and for each book whatever the owner wrote: a rating 1-5, a difficulty (very_hard, hard, moderate, easy), tags from the owner's own vocabulary, and a note (their takeaways). Fields that are absent were never written: do not guess them, do not treat absence as average.

How to read the signals, in order of weight:
1. Ratings are labels. Books rated 5 define what this owner likes; books rated 1 or 2 are negative examples and matter as much. Never recommend toward a negative example.
2. Notes say why. Find the axis the owner praises (method, density, applicability, tone, structure) and recommend along that axis, not along genre.
3. Tags are the owner's ontology; a match on a rarely used tag is worth more than a match on a common one.
4. Difficulty is calibration: a pick should land in the band where the owner's ratings are highest.
5. Shelf names, where they carry a subject, say what the library is about. The books say at what level.`;

const COMMON_RULES = `- Real, published books with their real author. No invented titles, no invented editions.
- Never propose a book the library already holds, nor another edition of one, nor anything on the exclusion lists below.
- No two candidates by the same author, and no more than two on the same narrow subject.
- The reason is addressed to the owner, plain, grounded in their own notes and ratings. No adjectives that cannot be checked, no dashes.`;

const systemFor = (
  kind: RecommendedKind,
  count: number,
  preference: RecommendedPreference,
) =>
  kind === 'fit'
    ? `You stock the private AI shelf of a personal library: books the owner does not own, standing above their own shelves, seen by nobody else.

${READING_THE_LIBRARY}

YOUR HALF OF THE BOARD: ${count} candidates, best first, that answer the library as it stands. The next thing along an axis the owner already reads on.

${PREFERENCE_RULE[preference]}

Rules:
${COMMON_RULES}
- Score each candidate on the rubric, 0-5 integers: theme (fits what the library is about), notes (runs along the praised axis), tags (fits the owner's vocabulary), difficulty (lands in the owner's best band), distance (far from their negative examples). Score 0 on a dimension the library carries no data for.
- Calibration: for each book in the calibration block, predict the rating this owner gave it, 1-5, from everything else you know about them.`
    : `You stock the private AI shelf of a personal library: books the owner does not own, standing above their own shelves, seen by nobody else.

${READING_THE_LIBRARY}

YOUR HALF OF THE BOARD: ${count} candidates, best first, that stand BEYOND this library and push the owner into something NEW: a subject, discipline, tradition or period their shelves do not cover at all.
- New ground, genuinely. If the library already holds books on it, it is not new ground.
- Within their reach. Choose ground their own habits make them ready for, and inside that ground choose the entry point a serious reader starts from, never the advanced or specialist work.
- Not random. Say, in one or two sentences, what this opens for them and why they can take it on now. Name the ground in \`newGround\`, three or four lower-case words.

${PREFERENCE_RULE[preference]}

Rules:
${COMMON_RULES}
- Score each candidate on the rubric, 0-5 integers, read for new ground: theme (connects to something the owner demonstrably cares about), notes (answers the axis their notes praise), tags (touches their vocabulary), difficulty (the owner can actually read it now), distance (how new the ground truly is, 5 = the library has nothing like it). Score 0 on a dimension the library carries no data for.`;

const buildUserBlock = (
  digest: LibraryDigest,
  heldOut: DigestBook[],
  standing: string[],
  history: string[],
  banned: string[],
  unverified: string[],
): string => {
  const held = new Set(heldOut.map(b => b.id));
  const lines: string[] = ['LIBRARY'];
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
  if (standing.length)
    lines.push(
      `ALREADY STANDING ON THE BOARD, kept by the owner (do not propose again): ${standing.join('; ')}`,
    );
  if (history.length)
    lines.push(
      `ROLLED PAST ON THIS SHELF (do not propose again): ${history.join('; ')}`,
    );
  if (banned.length)
    lines.push(`BANNED BY THE OWNER (never propose): ${banned.join('; ')}`);
  if (unverified.length)
    lines.push(
      `NO BOOK SOURCE COULD CONFIRM THESE, do not offer them again: ${unverified.join('; ')}`,
    );
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

/** The reach of a stretch pick, 0..100: its own weights, its own reading of
 * the rubric, and no calibration offset, which measures how well fit is
 * predicted and says nothing about new ground. */
export function reachPercent(
  rubric: MagicRubric,
  signals: LibraryDigest['signals'],
): number {
  const active: (keyof MagicRubric)[] = ['theme', 'distance'];
  if (signals.notes) active.push('notes');
  if (signals.tags) active.push('tags');
  if (signals.difficulty) active.push('difficulty');
  const weight = active.reduce((acc, k) => acc + STRETCH_WEIGHTS[k], 0);
  const raw =
    active.reduce(
      (acc, k) => acc + STRETCH_WEIGHTS[k] * clamp(rubric[k] ?? 0, 0, 5),
      0,
    ) /
    (weight * 5);
  return Math.round(clamp(raw * 100, 5, 97));
}

/** Runs `task` over `items`, `limit` at a time, results in input order. */
async function pooled<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    (async () => {
      for (;;) {
        const index = cursor++;
        if (index >= items.length) return;
        out[index] = await task(items[index]);
      }
    })(),
  );
  await Promise.all(workers);
  return out;
}

async function callModel(
  kind: RecommendedKind,
  count: number,
  preference: RecommendedPreference,
  userBlock: string,
): Promise<{ answer: ModelAnswer | null; served: MagicServed }> {
  const reply = await askRelay({
    model: AI_SHELF_MODEL,
    effort: AI_SHELF_EFFORT,
    maxTokens: 5000,
    system: `${systemFor(kind, count, preference)}

OUTPUT. Answer with one JSON object and nothing else, no prose before or after it, matching this JSON schema exactly:
${JSON.stringify(schemaFor(kind, count))}`,
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
  if (answer && !Array.isArray(answer.candidates)) answer = null;
  return { answer, served };
}

export interface BoardRun {
  /** Verified picks, in the model's own order of confidence. */
  fit: RecommendedPick[];
  stretch: RecommendedPick[];
  calls: number;
  /** Candidates no source could confirm. */
  unverified: string[];
  calibration: { offset: number; samples: number };
  errors: string[];
  served: MagicServed | null;
  tracksExhausted: boolean;
  /** True when the road to the engine closed mid-answer. */
  cutOff: boolean;
}

export interface BoardRequest {
  preference: RecommendedPreference;
  /** How many of each half the board is missing. */
  need: { fit: number; stretch: number };
  /** Titles standing on the board and kept by the owner. */
  standing: string[];
  /** Titles this shelf has already dealt. */
  history: string[];
  /** Titles the owner banned, library-wide. */
  banned: string[];
}

/** Statuses an edge returns when it gives up on a request that is still
 * being written on the other side. */
const CUT_OFF = new Set([408, 502, 504, 522, 524]);

interface HalfRun {
  picks: RecommendedPick[];
  calls: number;
  unverified: string[];
  errors: string[];
  served: MagicServed | null;
  tracksExhausted: boolean;
  /** The road to the engine closed while the model was still writing. */
  cutOff: boolean;
  calibration: { offset: number; samples: number };
}

/**
 * Stocks the board. The two halves are asked side by side, each in at most
 * two passes: the second names what the first proposed that no book source
 * could confirm, so the model does not offer it again. Everything that
 * verifies beyond the need is returned too, and the caller benches it.
 */
export async function runBoard(
  digest: LibraryDigest,
  request: BoardRequest,
): Promise<BoardRun> {
  const empty: BoardRun = {
    fit: [],
    stretch: [],
    calls: 0,
    unverified: [],
    calibration: { offset: 0, samples: 0 },
    errors: [],
    served: null,
    tracksExhausted: false,
    cutOff: false,
  };
  if (request.need.fit <= 0 && request.need.stretch <= 0) return empty;

  const owned = new Set(digest.ownedTitles.map(normaliseTitle));
  // Shared across both halves, so the same book never stands twice on one
  // board. Both halves add to it as they dress their picks, and dressing
  // happens in one synchronous pass per half.
  const blocked = new Set(
    [...request.standing, ...request.history, ...request.banned].map(
      normaliseTitle,
    ),
  );
  const heldOut = pickHeldOut(digest);
  const showMatch = digest.ratedBooks >= MAGIC_MIN_RATED_FOR_MATCH;

  const runHalf = async (
    kind: RecommendedKind,
    need: number,
  ): Promise<HalfRun> => {
    const half: HalfRun = {
      picks: [],
      calls: 0,
      unverified: [],
      errors: [],
      served: null,
      tracksExhausted: false,
      cutOff: false,
      calibration: { offset: 0, samples: 0 },
    };
    if (need <= 0) return half;
    // Only the fit half is calibrated: the offset measures how well this
    // owner's verdicts are predicted, which says nothing about new ground.
    const heldForHalf = kind === 'fit' ? heldOut : [];

    for (let pass = 0; pass < 2 && half.picks.length < need; pass++) {
      let answer: ModelAnswer | null = null;
      try {
        half.calls += 1;
        const reply = await callModel(
          kind,
          ASK[kind],
          request.preference,
          buildUserBlock(
            digest,
            heldForHalf,
            request.standing,
            request.history,
            request.banned,
            half.unverified,
          ),
        );
        answer = reply.answer;
        half.served = reply.served;
      } catch (error) {
        half.errors.push(error instanceof Error ? error.message : 'model');
        if (error instanceof RelayError) {
          if (error.exhausted || error.status === 0)
            half.tracksExhausted = true;
          if (CUT_OFF.has(error.status)) half.cutOff = true;
        }
        // A cut-off call is not retried here: the model kept writing on the
        // other side and the subscription has already paid for it once.
        break;
      }
      if (!answer) {
        half.errors.push('model reply was not the JSON asked for');
        break;
      }
      if (pass === 0 && heldForHalf.length) {
        half.calibration = calibrationOffset(answer, heldForHalf);
      }

      const candidates = (answer.candidates ?? []).filter(candidate => {
        const key = normaliseTitle(candidate.title ?? '');
        return !!key && !owned.has(key) && !blocked.has(key);
      });
      const checked = await pooled(candidates, VERIFY_CONCURRENCY, candidate =>
        verifyBook(candidate.title, candidate.author),
      );
      checked.forEach((result, index) => {
        half.errors.push(...result.errors);
        const candidate = candidates[index];
        if (!result.book) {
          half.unverified.push(candidate.title);
          return;
        }
        const key = normaliseTitle(result.book.title);
        if (!key || owned.has(key) || blocked.has(key)) return;
        blocked.add(key);
        const pick: RecommendedPick = {
          id: `ai-${digest.libraryId}-${kind}-${key.replace(/\s+/g, '-').slice(0, 40)}`,
          title: result.book.title,
          author: result.book.author ?? candidate.author,
          year: result.book.year,
          reason: candidate.reason,
          kind,
          rubric: candidate.rubric,
          coverUrl: result.book.coverUrl,
          source: result.book.source,
          at: new Date().toISOString(),
        };
        if (kind === 'stretch') {
          const ground = candidate.newGround?.trim();
          if (ground) pick.newGround = ground;
          pick.match = reachPercent(candidate.rubric, digest.signals);
        } else if (showMatch) {
          pick.match = rubricToPercent(
            candidate.rubric,
            digest.signals,
            half.calibration.offset,
          );
        }
        half.picks.push(pick);
      });
    }
    return half;
  };

  const [fit, stretch] = await Promise.all([
    runHalf('fit', request.need.fit),
    runHalf('stretch', request.need.stretch),
  ]);

  return {
    fit: fit.picks,
    stretch: stretch.picks,
    calls: fit.calls + stretch.calls,
    unverified: [...fit.unverified, ...stretch.unverified],
    calibration: fit.calibration,
    errors: [...fit.errors, ...stretch.errors],
    served: fit.served ?? stretch.served,
    tracksExhausted: fit.tracksExhausted || stretch.tracksExhausted,
    cutOff: fit.cutOff || stretch.cutOff,
  };
}

/**
 * The board as it stands: locked picks hold the exact places they were in,
 * the free places take the fresh picks, and the three stretch picks are
 * spread through the row rather than parked at its end.
 */
export function arrangeBoard(
  keep: (RecommendedPick | null)[],
  fresh: { fit: RecommendedPick[]; stretch: RecommendedPick[] },
): RecommendedPick[] {
  const slots: (RecommendedPick | null)[] = Array.from(
    { length: AI_SHELF_SIZE },
    (_, i) => keep[i] ?? null,
  );
  const free = slots
    .map((pick, index) => (pick ? -1 : index))
    .filter(index => index >= 0);
  const heldStretch = slots.filter(p => p?.kind === 'stretch').length;
  let stretchLeft = Math.max(0, AI_SHELF_STRETCH - heldStretch);

  // Free places that are stretch places by the pattern go first, so the
  // three stand apart from each other when nothing is locked.
  const ordered = [
    ...free.filter(index => STRETCH_SLOTS.includes(index)),
    ...free.filter(index => !STRETCH_SLOTS.includes(index)),
  ];
  const forStretch = new Set<number>();
  for (const index of ordered) {
    if (stretchLeft <= 0) break;
    forStretch.add(index);
    stretchLeft -= 1;
  }

  const queues = { fit: [...fresh.fit], stretch: [...fresh.stretch] };
  for (const index of free) {
    const first = forStretch.has(index) ? 'stretch' : 'fit';
    const second = first === 'stretch' ? 'fit' : 'stretch';
    const pick = queues[first].shift() ?? queues[second].shift() ?? null;
    slots[index] = pick;
  }
  return slots.filter((pick): pick is RecommendedPick => !!pick);
}
