// motion-passport: exempt — a server route; nothing here is drawn.
import type { NextApiRequest, NextApiResponse } from 'next';

import type { StrapiLibraryEntry } from '@local-types/library/library';
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

/**
 * POST /api/library/magic-book
 *
 * The owner's magic books: one per book shelf, made by the engine and kept
 * until the shelf changes or the owner rolls again. Owner-only: the caller's
 * Strapi session is asked who it is, the library is read with that session,
 * and the library's owner must be that account. Nothing here is readable by
 * a visitor or another owner.
 *
 * Body: { libraryId, action: 'load' | 'reroll', shelfId? }
 *   load    every book shelf; stale or missing picks are made now
 *   reroll  one shelf; the standing pick joins that shelf's exclusions
 */

const STRAPI = process.env.NEXT_PUBLIC_STRAPI ?? '';
const STRAPI_TIMEOUT_MS = 10_000;

const POPULATE = new URLSearchParams({
  'populate[user]': 'true',
  'populate[singleShelves][populate][objects][populate][tags]': 'true',
  'populate[singleShelves][sort][0]': 'order:asc',
  'populate[singleShelves][populate][objects][sort][0]': 'order:asc',
}).toString();

interface Body {
  libraryId?: number;
  action?: 'load' | 'reroll';
  shelfId?: number;
}

const bearer = (req: NextApiRequest): string | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token || null;
};

const strapi = async <T>(path: string, token: string): Promise<T | null> => {
  const r = await fetch(`${STRAPI}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(STRAPI_TIMEOUT_MS),
  });
  if (!r.ok) return null;
  return (await r.json()) as T;
};

const fromStore = (
  shelf: DigestShelf,
  stored?: StoredShelf,
): MagicShelfResult | null => {
  if (!stored || stored.fingerprint !== shelf.fingerprint) return null;
  if (shelf.books.length === 0) {
    return {
      shelfId: shelf.id,
      status: 'ineligible',
      note: 'Put a book on this shelf and one will be recommended.',
    };
  }
  if (stored.pick)
    return { shelfId: shelf.id, status: 'ready', pick: stored.pick };
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
  const action = body.action === 'reroll' ? 'reroll' : 'load';
  const shelfId = body.shelfId != null ? Number(body.shelfId) : null;
  if (!Number.isInteger(libraryId) || libraryId <= 0) {
    res.status(400).json({ error: 'libraryId is required.' });
    return;
  }
  if (action === 'reroll' && (shelfId == null || !Number.isInteger(shelfId))) {
    res.status(400).json({ error: 'shelfId is required to roll again.' });
    return;
  }
  const token = bearer(req);
  if (!token) {
    res.status(401).json({ error: 'Sign in to see your magic books.' });
    return;
  }
  if (!STRAPI) {
    res.status(500).json({ error: 'The library backend is not configured.' });
    return;
  }

  const me = await strapi<{ id?: number }>('/api/users/me', token);
  if (!me?.id) {
    res.status(401).json({ error: 'Your session has expired. Sign in again.' });
    return;
  }
  const read = await strapi<{ data: StrapiLibraryEntry }>(
    `/api/libraries/${libraryId}?${POPULATE}`,
    token,
  );
  const library = read?.data;
  if (!library) {
    res.status(404).json({ error: 'No such library.' });
    return;
  }
  const ownerId = library.attributes.user?.data?.id;
  if (ownerId == null || String(ownerId) !== String(me.id)) {
    await journal({ outcome: 'forbidden', libraryId, userId: me.id, action });
    res.status(403).json({ error: 'Only the owner sees the magic books.' });
    return;
  }

  const digest = digestLibrary(library);
  const stored = await readLibrary(libraryId);
  const results: MagicShelfResult[] = [];
  const toRun: DigestShelf[] = [];
  const exclusions = new Map<number, string[]>();

  if (action === 'reroll') {
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
      const kept = fromStore(shelf, stored.shelves[String(shelf.id)]);
      if (kept) {
        results.push(kept);
        continue;
      }
      exclusions.set(shelf.id, stored.shelves[String(shelf.id)]?.history ?? []);
      toRun.push(shelf);
    }
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
    ? await runEngine(digest, toRun, exclusions, stored.banned)
    : {
        results: [],
        calls: 0,
        unverified: {},
        calibration: { offset: 0, samples: 0 },
        errors: [],
        engine: null,
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
        fingerprint: shelf.fingerprint,
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
    engine: run.engine,
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
