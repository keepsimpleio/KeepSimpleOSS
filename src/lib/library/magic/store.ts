import { promises as fs } from 'fs';
import path from 'path';

import type { MagicBook } from '@local-types/library/magicBook';
import type {
  BannedBook,
  RecommendedPick,
  RecommendedPreference,
} from '@local-types/library/recommendation';

/**
 * Where the Library's picks live between requests, and the journal every run
 * leaves.
 *
 * A JSON file beside the journal, under `logs/library-magic/`, gitignored.
 * One pick per shelf with the fingerprint it was made for, the titles the
 * owner has rolled past on that shelf, the AI shelf's board, and the
 * library's banned titles, which the magic book and the AI shelf share: a
 * book banned on one is never proposed by the other. Moving this into the
 * CMS is a schema change and a separate release; the file is what DEV runs
 * on until then.
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

/** The AI shelf's board as it stands, and the spares behind it. */
export interface StoredBoard {
  /** The picks on the board, in the order they stand. */
  picks: RecommendedPick[];
  /** Verified spares. One steps up when a pick is banned or taken, so a
   * single departure costs no model call. */
  bench: RecommendedPick[];
  /** Ids of the picks the owner locked in; a re-roll leaves them standing. */
  locked: string[];
  /** Titles the board has already dealt, normalised, never dealt again. */
  history: string[];
  /** The setting this board was rolled with. */
  rolledWith: RecommendedPreference;
  updatedAt: string;
}

export interface StoredLibrary {
  shelves: Record<string, StoredShelf>;
  /** Books the owner banned, library-wide, shared by both surfaces. */
  banned: BannedBook[];
  /** UTC timestamps of model calls, for the daily cap. */
  calls: string[];
  /** The AI shelf's board, once one has been rolled. */
  board?: StoredBoard;
  /** The owner's standing setting for the AI shelf. It outlives every
   * board: set to non-fiction, the shelf stays non-fiction. */
  preference: RecommendedPreference;
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

const PREFERENCES: RecommendedPreference[] = ['any', 'nonfiction', 'fiction'];

export const isPreference = (value: unknown): value is RecommendedPreference =>
  typeof value === 'string' &&
  PREFERENCES.includes(value as RecommendedPreference);

/** Store files written before the AI shelf carry `banned` as bare titles and
 * no preference. They are read as what they meant, never dropped. */
const migrate = (library: StoredLibrary): StoredLibrary => ({
  ...library,
  banned: (library.banned ?? []).map(entry =>
    typeof entry === 'string'
      ? { title: entry as string, at: '' }
      : (entry as BannedBook),
  ),
  preference: isPreference(library.preference) ? library.preference : 'any',
});

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
  preference: 'any',
});

export const readLibrary = (libraryId: number): Promise<StoredLibrary> =>
  serial(async () => {
    const store = await readStore();
    const held = store.libraries[String(libraryId)];
    return held ? migrate(held) : emptyLibrary();
  });

export const updateLibrary = (
  libraryId: number,
  mutate: (library: StoredLibrary) => StoredLibrary,
): Promise<StoredLibrary> =>
  serial(async () => {
    const store = await readStore();
    const key = String(libraryId);
    const held = store.libraries[key];
    const next = mutate(held ? migrate(held) : emptyLibrary());
    store.libraries[key] = next;
    await writeStore(store);
    return next;
  });

/** Calls made today, UTC. */
export const callsToday = (library: StoredLibrary): number => {
  const day = new Date().toISOString().slice(0, 10);
  return library.calls.filter(at => at.startsWith(day)).length;
};

/** Today's calls plus the ones a run just made, older days dropped. */
export const withCalls = (library: StoredLibrary, made: number): string[] => {
  const now = new Date().toISOString();
  const day = now.slice(0, 10);
  return [
    ...library.calls.filter(at => at.startsWith(day)),
    ...Array.from({ length: made }, () => now),
  ];
};

export interface JournalLine {
  mechanism: string;
  at: string;
  outcome: string;
  libraryId: number;
  [key: string]: unknown;
}

/** One line per run, UTC inside. Never the token, never the key. */
export async function journal(line: {
  outcome: string;
  libraryId: number;
  mechanism?: string;
  [key: string]: unknown;
}): Promise<void> {
  const { mechanism = 'library.magic-book', ...rest } = line;
  const record: JournalLine = {
    mechanism,
    at: new Date().toISOString(),
    ...rest,
  } as JournalLine;
  try {
    await fs.mkdir(ROOT, { recursive: true });
    await fs.appendFile(JOURNAL, `${JSON.stringify(record)}\n`);
  } catch (error) {
    console.warn(`[${mechanism}] journal write failed`, error);
  }
  console.info(JSON.stringify(record));
}
