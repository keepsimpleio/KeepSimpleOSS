import { promises as fs } from 'fs';
import path from 'path';

import type { MagicBook } from '@local-types/library/magicBook';

/**
 * Where the picks live between requests, and the journal every run leaves.
 *
 * A JSON file beside the journal, under `logs/library-magic/`, gitignored.
 * One pick per shelf with the fingerprint it was made for, the titles the
 * owner has rolled past on that shelf, and the library's banned titles.
 * Moving this into the CMS is a schema change and a separate release; the
 * file is what DEV runs on until then.
 */

const ROOT = path.join(process.cwd(), 'logs', 'library-magic');
const STORE = path.join(ROOT, 'store.json');
const JOURNAL = path.join(ROOT, 'journal.jsonl');

export interface StoredShelf {
  fingerprint: string;
  pick: MagicBook | null;
  /** Titles rolled past on this shelf, normalised, never dealt again. */
  history: string[];
  updatedAt: string;
}

export interface StoredLibrary {
  shelves: Record<string, StoredShelf>;
  /** Titles the owner banned, normalised, library-wide. */
  banned: string[];
  /** UTC timestamps of model calls, for the daily cap. */
  calls: string[];
}

interface Store {
  libraries: Record<string, StoredLibrary>;
}

/** Model calls one library may make in a UTC day. */
export const MAGIC_DAILY_CALL_CAP = 60;

let queue: Promise<unknown> = Promise.resolve();

/** Reads and writes are serialised: two requests for one library at once
 * must not lose each other's picks. */
const serial = <T>(task: () => Promise<T>): Promise<T> => {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
};

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE, 'utf8');
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === 'object' && parsed.libraries
      ? parsed
      : { libraries: {} };
  } catch {
    return { libraries: {} };
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
  const tmp = `${STORE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2));
  await fs.rename(tmp, STORE);
}

const emptyLibrary = (): StoredLibrary => ({
  shelves: {},
  banned: [],
  calls: [],
});

export const readLibrary = (libraryId: number): Promise<StoredLibrary> =>
  serial(async () => {
    const store = await readStore();
    return store.libraries[String(libraryId)] ?? emptyLibrary();
  });

export const updateLibrary = (
  libraryId: number,
  mutate: (library: StoredLibrary) => StoredLibrary,
): Promise<StoredLibrary> =>
  serial(async () => {
    const store = await readStore();
    const key = String(libraryId);
    const next = mutate(store.libraries[key] ?? emptyLibrary());
    store.libraries[key] = next;
    await writeStore(store);
    return next;
  });

/** Calls made today, UTC. */
export const callsToday = (library: StoredLibrary): number => {
  const day = new Date().toISOString().slice(0, 10);
  return library.calls.filter(at => at.startsWith(day)).length;
};

export interface JournalLine {
  mechanism: 'library.magic-book';
  at: string;
  outcome: string;
  libraryId: number;
  [key: string]: unknown;
}

/** One line per run, UTC inside. Never the token, never the key. */
export async function journal(line: {
  outcome: string;
  libraryId: number;
  [key: string]: unknown;
}): Promise<void> {
  const record: JournalLine = {
    mechanism: 'library.magic-book',
    at: new Date().toISOString(),
    ...line,
  };
  try {
    await fs.mkdir(ROOT, { recursive: true });
    await fs.appendFile(JOURNAL, `${JSON.stringify(record)}\n`);
  } catch (error) {
    console.warn('[library.magic-book] journal write failed', error);
  }
  console.info(JSON.stringify(record));
}
