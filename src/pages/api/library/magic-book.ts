// motion-passport: exempt — a server route; nothing here is drawn.
import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  MagicBooksResponse,
  MagicShelfResult,
} from '@local-types/library/magicBook';

import type { DigestShelf } from '@lib/library/magic/digest';
import { digestLibrary, normaliseTitle } from '@lib/library/magic/digest';
import { runEngine } from '@lib/library/magic/engine';
import type { StoredLibrary, StoredShelf } from '@lib/library/magic/store';
import {
  callsToday,
  journal,
  MAGIC_DAILY_CALL_CAP,
  readLibrary,
  updateLibrary,
} from '@lib/library/magic/store';
import { ownerOfLibrary } from '@lib/library/owner';

/**
 * POST /api/library/magic-book
 *
 * The owner's magic books: one per book shelf, made by the engine when the
 * owner asks and kept until the owner rolls again. Editing the shelf does
 * not unseat the pick: a book that stands there is the owner's to keep
 * until they roll it away (Wolf, 2026-09-11), so no engine work is ever
 * spent on a shelf nobody asked about.
 * Nothing is made unasked (Wolf, 2026-09-10). Owner-only: the caller's
 * Strapi session is asked who it is, the library is read with that session,
 * and the library's owner must be that account. Nothing here is readable by
 * a visitor or another owner.
 *
 * Body: { libraryId, action: 'load' | 'roll', shelfId? }
 *   load    every book shelf as the store has it; no model call
 *   roll    one shelf; the standing pick, if any, joins that shelf's exclusions
 *   reroll  the same as roll, kept for older callers
 */

interface Body {
  libraryId?: number;
  action?: 'load' | 'roll' | 'reroll';
  shelfId?: number;
}

const fromStore = (
  shelf: DigestShelf,
  gone: (title: string) => boolean,
  stored?: StoredShelf,
): MagicShelfResult => {
  if (shelf.books.length === 0) {
    return {
      shelfId: shelf.id,
      status: 'ineligible',
      note: 'Put a book on this shelf and one will be recommended.',
    };
  }
  const idle: MagicShelfResult = {
    shelfId: shelf.id,
    status: 'idle',
    note: 'Roll to get a book for this shelf.',
  };
  if (!stored) return idle;
  // The pick outlives every edit to the shelf. It gives up its place for two
  // reasons only: the owner now has that book, or has banned it, and neither
  // is something to go on recommending.
  if (stored.pick) {
    return gone(stored.pick.title)
      ? idle
      : { shelfId: shelf.id, status: 'ready', pick: stored.pick };
  }
  return {
    shelfId: shelf.id,
    status: 'empty',
    note: 'Nothing could be confirmed for this shelf last time. Roll again.',
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MagicBooksResponse | { error: string }>,
) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const body = (req.body ?? {}) as Body;
  const libraryId = Number(body.libraryId);
  const action =
    body.action === 'roll' || body.action === 'reroll' ? 'roll' : 'load';
  const shelfId = body.shelfId != null ? Number(body.shelfId) : null;
  if (!Number.isInteger(libraryId) || libraryId <= 0) {
    res.status(400).json({ error: 'libraryId is required.' });
    return;
  }
  if (action === 'roll' && (shelfId == null || !Number.isInteger(shelfId))) {
    res.status(400).json({ error: 'shelfId is required to roll again.' });
    return;
  }
  // Who is asking, and do they own this library: the same check the AI shelf
  // makes, in the one place both routes read it from.
  const owner = await ownerOfLibrary(req, libraryId, {
    signIn: 'Sign in to see your magic books.',
    forbidden: 'Only the owner sees the magic books.',
  });
  if (owner.status !== 200 || !owner.library) {
    if (owner.status === 403)
      await journal({
        outcome: 'forbidden',
        libraryId,
        userId: owner.userId,
        action,
      });
    res.status(owner.status).json({ error: owner.error ?? 'Not allowed.' });
    return;
  }
  const library = owner.library;

  const digest = digestLibrary(library);
  const stored = await readLibrary(libraryId);
  // A standing pick the owner has since acquired or banned, the two things
  // that take a book off the shelf without a roll.
  const owned = new Set(digest.ownedTitles.map(normaliseTitle));
  const bannedTitles = new Set(stored.banned.map(b => normaliseTitle(b.title)));
  const gone = (title: string) => {
    const key = normaliseTitle(title);
    return owned.has(key) || bannedTitles.has(key);
  };
  const results: MagicShelfResult[] = [];
  const toRun: DigestShelf[] = [];
  const exclusions = new Map<number, string[]>();

  if (action === 'roll') {
    const shelf = digest.shelves.find(s => s.id === shelfId);
    if (!shelf) {
      res.status(404).json({ error: 'No such shelf on this library.' });
      return;
    }
    const current = stored.shelves[String(shelf.id)];
    const history = [...(current?.history ?? [])];
    if (current?.pick) history.push(current.pick.title);
    exclusions.set(shelf.id, history);
    toRun.push(shelf);
  } else {
    for (const shelf of digest.shelves) {
      results.push(fromStore(shelf, gone, stored.shelves[String(shelf.id)]));
    }
    res.status(200).json({ shelves: results, ratedBooks: digest.ratedBooks });
    return;
  }

  const needsModel = toRun.some(s => s.books.length > 0);
  if (needsModel && callsToday(stored) >= MAGIC_DAILY_CALL_CAP) {
    await journal({
      outcome: 'capped',
      libraryId,
      action,
      callsToday: callsToday(stored),
    });
    // What stands stays; what is stale is reported as empty for today.
    for (const shelf of toRun) {
      const current = stored.shelves[String(shelf.id)];
      results.push(
        current?.pick
          ? { shelfId: shelf.id, status: 'ready', pick: current.pick }
          : {
              shelfId: shelf.id,
              status: 'empty',
              note: 'The engine has done its day of work. Roll again tomorrow.',
            },
      );
    }
    res.status(200).json({ shelves: results, ratedBooks: digest.ratedBooks });
    return;
  }

  const started = Date.now();
  const run = toRun.length
    ? await runEngine(
        digest,
        toRun,
        exclusions,
        stored.banned.map(b => b.title),
      )
    : {
        results: [],
        calls: 0,
        unverified: {},
        calibration: { offset: 0, samples: 0 },
        errors: [],
        served: null,
        tracksExhausted: false,
        failed: [],
      };
  results.push(...run.results);

  const now = new Date().toISOString();
  await updateLibrary(libraryId, (current: StoredLibrary) => {
    const shelves = { ...current.shelves };
    for (const result of run.results) {
      const shelf = toRun.find(s => s.id === result.shelfId);
      // A shelf the model never answered for keeps whatever it had, so the
      // next load asks again instead of remembering a failure as a verdict.
      if (!shelf || run.failed.includes(shelf.id)) continue;
      const previous = shelves[String(shelf.id)];
      shelves[String(shelf.id)] = {
        pick: result.pick ?? null,
        history: exclusions.get(shelf.id) ?? previous?.history ?? [],
        updatedAt: now,
      };
    }
    const day = now.slice(0, 10);
    const calls = [
      ...current.calls.filter(at => at.startsWith(day)),
      ...Array.from({ length: run.calls }, () => now),
    ];
    return { ...current, shelves, calls };
  });

  await journal({
    outcome:
      run.errors.length && run.results.every(r => r.status !== 'ready')
        ? 'failed'
        : 'served',
    libraryId,
    action,
    shelfId: shelfId ?? undefined,
    shelvesRun: toRun.map(s => s.id),
    ready: run.results.filter(r => r.status === 'ready').length,
    empty: run.results.filter(r => r.status === 'empty').length,
    modelCalls: run.calls,
    served: run.served,
    tracksExhausted: run.tracksExhausted,
    failed: run.failed,
    calibration: run.calibration,
    unverified: Object.values(run.unverified).flat().length,
    errors: run.errors.slice(0, 5),
    ms: Date.now() - started,
    picks: run.results
      .filter(r => r.pick)
      .map(r => ({
        shelfId: r.shelfId,
        title: normaliseTitle(r.pick?.title ?? ''),
        match: r.pick?.match ?? null,
      })),
  });

  results.sort((a, b) => a.shelfId - b.shelfId);
  res.status(200).json({ shelves: results, ratedBooks: digest.ratedBooks });
}
