// motion-passport: exempt — a server route; nothing here is drawn.
import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  BannedBook,
  RecommendedPick,
  RecommendedPreference,
  RecommendedShelfState,
} from '@local-types/library/recommendation';

import {
  AI_SHELF_BENCH,
  AI_SHELF_FIT,
  AI_SHELF_MIN_BOOKS,
  AI_SHELF_SIZE,
  AI_SHELF_STRETCH,
  arrangeBoard,
  runBoard,
} from '@lib/library/aishelf/engine';
import { digestLibrary, normaliseTitle } from '@lib/library/magic/digest';
import type { StoredBoard, StoredLibrary } from '@lib/library/magic/store';
import {
  callsToday,
  isPreference,
  journal,
  MAGIC_DAILY_CALL_CAP,
  readLibrary,
  updateLibrary,
  withCalls,
} from '@lib/library/magic/store';
import { ownerOfLibrary } from '@lib/library/owner';

/**
 * POST /api/library/ai-shelf
 *
 * The owner's AI shelf: thirteen books from outside the library, ten of
 * them answering it and three standing beyond it. Owner-only, on the
 * caller's own Strapi session.
 *
 * Actions:
 *   load       what stands, no model call, except the first board: once the
 *              library holds ${AI_SHELF_MIN_BOOKS} books the shelf rolls
 *              itself once, unasked (Wolf, 2026-09-10). Every roll after
 *              that is the owner's click.
 *   roll       re-rolls every place the owner has not locked
 *   preference any | nonfiction | fiction, remembered for good; it takes
 *              effect on the next roll, so the standing board never changes
 *              under the owner's hands
 *   lock       keeps a pick through the next roll, or lets it go
 *   ban        never recommend this book again, here or on a magic book;
 *              the place it leaves is taken from the bench
 */

const MECHANISM = 'library.ai-shelf';
/** Titles remembered per shelf, so the prompt cannot grow without end. */
const HISTORY_CAP = 200;

/** One roll per library at a time: two at once would each read the board
 * before the other wrote it, and one would be lost. */
const rolling = new Set<number>();

interface Body {
  libraryId?: number;
  action?: 'load' | 'roll' | 'preference' | 'lock' | 'ban';
  preference?: RecommendedPreference;
  pickId?: string;
  title?: string;
  author?: string;
  on?: boolean;
}

const isBanned = (banned: BannedBook[], title: string): boolean => {
  const key = normaliseTitle(title);
  return banned.some(b => normaliseTitle(b.title) === key);
};

/** The board without the picks the library has since acquired or the owner
 * has banned, with the bench stepping into the places they leave. */
const settle = (
  board: StoredBoard,
  owned: Set<string>,
  banned: BannedBook[],
): StoredBoard => {
  const gone = (pick: RecommendedPick) =>
    owned.has(normaliseTitle(pick.title)) || isBanned(banned, pick.title);
  const bench = board.bench.filter(pick => !gone(pick));
  const picks: RecommendedPick[] = [];
  for (const pick of board.picks) {
    if (!gone(pick)) {
      picks.push(pick);
      continue;
    }
    const spare =
      bench.findIndex(b => b.kind === pick.kind) >= 0
        ? bench.splice(
            bench.findIndex(b => b.kind === pick.kind),
            1,
          )[0]
        : bench.shift();
    if (spare) picks.push(spare);
  }
  const locked = board.locked.filter(id => picks.some(p => p.id === id));
  return { ...board, picks, bench, locked };
};

const stateOf = (
  library: StoredLibrary,
  books: number,
  ratedBooks: number,
  note?: string,
): RecommendedShelfState => {
  const board = library.board;
  const picks = board?.picks ?? [];
  let status: RecommendedShelfState['status'] = 'idle';
  if (books < AI_SHELF_MIN_BOOKS) status = 'locked';
  else if (picks.length > 0) status = 'ready';
  else if (board) status = 'empty';

  const state: RecommendedShelfState = {
    status,
    books,
    required: AI_SHELF_MIN_BOOKS,
    ratedBooks,
    preference: library.preference,
    picks,
    locked: board?.locked ?? [],
    banned: library.banned,
  };
  if (board) state.rolledWith = board.rolledWith;
  if (note) state.note = note;
  return state;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecommendedShelfState | { error: string }>,
) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const body = (req.body ?? {}) as Body;
  const libraryId = Number(body.libraryId);
  if (!Number.isInteger(libraryId) || libraryId <= 0) {
    res.status(400).json({ error: 'libraryId is required.' });
    return;
  }
  const action = body.action ?? 'load';

  const owner = await ownerOfLibrary(req, libraryId);
  if (owner.status !== 200 || !owner.library) {
    if (owner.status === 403)
      await journal({
        mechanism: MECHANISM,
        outcome: 'forbidden',
        libraryId,
        action,
      });
    res.status(owner.status).json({ error: owner.error ?? 'Not allowed.' });
    return;
  }

  const digest = digestLibrary(owner.library);
  const owned = new Set(digest.ownedTitles.map(normaliseTitle));
  const books = digest.ownedTitles.length;
  let stored = await readLibrary(libraryId);

  // The setting is the owner's to keep, whatever the board holds, and it
  // outlives every roll: set to non-fiction, the shelf stays non-fiction.
  if (action === 'preference') {
    if (!isPreference(body.preference)) {
      res.status(400).json({ error: 'Unknown setting.' });
      return;
    }
    const preference = body.preference;
    stored = await updateLibrary(libraryId, current => ({
      ...current,
      preference,
    }));
    await journal({
      mechanism: MECHANISM,
      outcome: 'preference',
      libraryId,
      preference,
    });
    res
      .status(200)
      .json(
        stateOf(
          stored,
          books,
          digest.ratedBooks,
          stored.board && stored.board.rolledWith !== preference
            ? 'Re-roll to stock the shelf with this setting.'
            : undefined,
        ),
      );
    return;
  }

  if (action === 'lock') {
    const pickId = String(body.pickId ?? '');
    const on = body.on !== false;
    stored = await updateLibrary(libraryId, current => {
      if (!current.board) return current;
      const held = new Set(current.board.locked);
      if (on) held.add(pickId);
      else held.delete(pickId);
      return {
        ...current,
        board: {
          ...current.board,
          locked: Array.from(held).filter(id =>
            current.board?.picks.some(p => p.id === id),
          ),
        },
      };
    });
    await journal({
      mechanism: MECHANISM,
      outcome: on ? 'locked' : 'unlocked',
      libraryId,
      pickId,
    });
    res.status(200).json(stateOf(stored, books, digest.ratedBooks));
    return;
  }

  // A ban is library-wide and shared with the magic book: what the owner
  // threw off this shelf is never dealt on another.
  if (action === 'ban') {
    const on = body.on !== false;
    const pick = stored.board?.picks.find(p => p.id === body.pickId);
    const title = (pick?.title ?? body.title ?? '').trim();
    if (!title) {
      res.status(400).json({ error: 'Which book?' });
      return;
    }
    const author = pick?.author ?? body.author;
    stored = await updateLibrary(libraryId, current => {
      const key = normaliseTitle(title);
      const banned = current.banned.filter(
        b => normaliseTitle(b.title) !== key,
      );
      if (on) banned.push({ title, author, at: new Date().toISOString() });
      const board = current.board
        ? settle(current.board, owned, banned)
        : undefined;
      return { ...current, banned, board };
    });
    await journal({
      mechanism: MECHANISM,
      outcome: on ? 'banned' : 'unbanned',
      libraryId,
      title: normaliseTitle(title),
      standing: stored.board?.picks.length ?? 0,
    });
    res
      .status(200)
      .json(
        stateOf(
          stored,
          books,
          digest.ratedBooks,
          on && (stored.board?.picks.length ?? 0) < AI_SHELF_SIZE
            ? 'The bench is out. Re-roll to fill the shelf.'
            : undefined,
        ),
      );
    return;
  }

  // Below this line the shelf may reach for the engine. First the board is
  // settled against the library as it stands now: a pick the owner has since
  // bought, or banned on a magic book, gives up its place to the bench.
  const ids = (board?: StoredBoard) =>
    (board?.picks ?? []).map(p => p.id).join();
  if (
    stored.board &&
    ids(settle(stored.board, owned, stored.banned)) !== ids(stored.board)
  ) {
    stored = await updateLibrary(libraryId, current => ({
      ...current,
      board: current.board
        ? settle(current.board, owned, current.banned)
        : undefined,
    }));
  }

  if (books < AI_SHELF_MIN_BOOKS) {
    res
      .status(200)
      .json(
        stateOf(
          stored,
          books,
          digest.ratedBooks,
          `Read at least ${AI_SHELF_MIN_BOOKS} books to unlock this shelf.`,
        ),
      );
    return;
  }

  const board = stored.board;
  // The first board is the shelf's own doing; after that nothing is stocked
  // unasked, not even when the board came back empty.
  if (action === 'load' && board) {
    res
      .status(200)
      .json(
        stateOf(
          stored,
          books,
          digest.ratedBooks,
          board && board.rolledWith !== stored.preference
            ? 'Re-roll to stock the shelf with this setting.'
            : undefined,
        ),
      );
    return;
  }

  if (callsToday(stored) >= MAGIC_DAILY_CALL_CAP) {
    await journal({
      mechanism: MECHANISM,
      outcome: 'capped',
      libraryId,
      action,
      callsToday: callsToday(stored),
    });
    const state = stateOf(
      stored,
      books,
      digest.ratedBooks,
      'The engine has done its day of work. Roll again tomorrow.',
    );
    res.status(200).json({ ...state, status: 'capped' });
    return;
  }

  if (rolling.has(libraryId)) {
    res.status(409).json({ error: 'This shelf is already being stocked.' });
    return;
  }
  rolling.add(libraryId);
  const started = Date.now();
  try {
    // A roll keeps what the owner locked, where they locked it, and deals
    // fresh into every other place.
    const lockedIds = new Set(board?.locked ?? []);
    const keep: (RecommendedPick | null)[] = Array.from(
      { length: AI_SHELF_SIZE },
      (_, index) => {
        const pick = board?.picks[index];
        return pick && lockedIds.has(pick.id) ? pick : null;
      },
    );
    const kept = keep.filter((p): p is RecommendedPick => !!p);
    const need = {
      fit: AI_SHELF_FIT - kept.filter(p => p.kind === 'fit').length,
      stretch: AI_SHELF_STRETCH - kept.filter(p => p.kind === 'stretch').length,
    };
    const history = [
      ...(board?.history ?? []),
      ...(board?.picks ?? [])
        .filter(pick => !lockedIds.has(pick.id))
        .map(pick => pick.title),
    ].slice(-HISTORY_CAP);

    const run = await runBoard(digest, {
      preference: stored.preference,
      need,
      standing: kept.map(p => p.title),
      history,
      banned: stored.banned.map(b => b.title),
    });

    const picks = arrangeBoard(keep, {
      fit: run.fit.slice(0, Math.max(0, need.fit)),
      stretch: run.stretch.slice(0, Math.max(0, need.stretch)),
    });
    const bench = [
      ...run.fit.slice(Math.max(0, need.fit)),
      ...run.stretch.slice(Math.max(0, need.stretch)),
    ].slice(0, AI_SHELF_BENCH);

    // A roll the engine never answered leaves the board as it was, so the
    // next attempt starts from what stands rather than from a failure.
    const answered = run.fit.length + run.stretch.length > 0;
    stored = await updateLibrary(libraryId, current => ({
      ...current,
      calls: withCalls(current, run.calls),
      board: answered
        ? {
            picks,
            bench,
            locked: Array.from(lockedIds).filter(id =>
              picks.some(p => p.id === id),
            ),
            history,
            rolledWith: current.preference,
            updatedAt: new Date().toISOString(),
          }
        : // A board that failed is still a board: it stands empty and waits
          // for the owner to roll, so a load never spends another call.
          (current.board ?? {
            picks: [],
            bench: [],
            locked: [],
            history,
            rolledWith: current.preference,
            updatedAt: new Date().toISOString(),
          }),
    }));

    await journal({
      mechanism: MECHANISM,
      outcome: answered ? 'served' : 'failed',
      libraryId,
      action,
      auto: action === 'load',
      preference: stored.preference,
      books,
      need,
      stood: picks.length,
      stretch: picks.filter(p => p.kind === 'stretch').length,
      bench: bench.length,
      modelCalls: run.calls,
      served: run.served,
      tracksExhausted: run.tracksExhausted,
      calibration: run.calibration,
      unverified: run.unverified.length,
      errors: run.errors.slice(0, 5),
      ms: Date.now() - started,
      picks: picks.map(p => ({
        title: normaliseTitle(p.title),
        kind: p.kind,
        match: p.match ?? null,
      })),
    });

    const note = !answered
      ? run.tracksExhausted
        ? 'The engine is out of reach right now. Roll again in a while.'
        : 'Nothing could be confirmed this time. Roll again.'
      : picks.length < AI_SHELF_SIZE
        ? 'Some candidates could not be confirmed. Roll again to fill the shelf.'
        : undefined;
    res.status(200).json(stateOf(stored, books, digest.ratedBooks, note));
  } finally {
    rolling.delete(libraryId);
  }
}
