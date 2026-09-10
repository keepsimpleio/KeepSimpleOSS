import { createHash } from 'crypto';

import type { StrapiLibraryEntry } from '@local-types/library/library';
import type { Difficulty, OverallRating } from '@local-types/library/object';

import { isTopicalShelfName, noteWordCount } from '@lib/library/aiAccuracy';
import { htmlToPlainText } from '@lib/library/objectMeta';

/**
 * The library as the engine reads it: every field the owner wrote, and
 * nothing for the fields they did not. A missing rating, note, tag or
 * difficulty is simply absent from the digest, never defaulted, so the
 * model cannot mistake silence for a middling verdict.
 */

/** Notes longer than this are cut: the axis is in the first paragraphs. */
const NOTE_CHARS = 900;

export interface DigestBook {
  id: number;
  title: string;
  author?: string;
  year?: number;
  tags?: string[];
  rating?: OverallRating;
  difficulty?: Difficulty;
  /** Plain text of the owner's note, cut to NOTE_CHARS. */
  note?: string;
}

export interface DigestShelf {
  id: number;
  /** The owner's name for the shelf, only when it carries a subject. */
  name?: string;
  /** What the owner wrote about the shelf, when they did. */
  description?: string;
  books: DigestBook[];
  /** Hash of everything above: the pick is stale once it changes. */
  fingerprint: string;
}

export interface LibraryDigest {
  libraryId: number;
  shelves: DigestShelf[];
  /** Every title in the library, on any shelf, so none is picked. */
  ownedTitles: string[];
  /** Rated books across the library. */
  ratedBooks: number;
  /** Which signals exist anywhere in the library. A signal absent from the
   * whole library is dropped from the rubric and its weight redistributed. */
  signals: {
    notes: boolean;
    tags: boolean;
    difficulty: boolean;
    lowRated: boolean;
  };
}

const yearOf = (date?: string): number | undefined => {
  const m = date?.match(/^(\d{4})/);
  return m ? Number(m[1]) : undefined;
};

export const normaliseTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function digestLibrary(library: StrapiLibraryEntry): LibraryDigest {
  const shelves = [...(library.attributes.singleShelves?.data ?? [])]
    .filter(shelf => shelf.attributes.type === 'book')
    .sort((a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0));

  const ownedTitles: string[] = [];
  let ratedBooks = 0;
  const signals = {
    notes: false,
    tags: false,
    difficulty: false,
    lowRated: false,
  };

  const digested: DigestShelf[] = shelves.map(shelf => {
    const books: DigestBook[] = [...(shelf.attributes.objects?.data ?? [])]
      .filter(object => object.attributes.type === 'book')
      .sort((a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0))
      .map(object => {
        const a = object.attributes;
        ownedTitles.push(a.title);
        const book: DigestBook = { id: object.id, title: a.title };
        if (a.author) book.author = a.author;
        const year = yearOf(a.publicationDate);
        if (year) book.year = year;
        const tags = (a.tags?.data ?? []).map(t => t.attributes.name);
        if (tags.length) {
          book.tags = tags;
          signals.tags = true;
        }
        if (a.overall != null) {
          book.rating = a.overall;
          ratedBooks += 1;
          if (a.overall <= 2) signals.lowRated = true;
        }
        if (a.difficulty) {
          book.difficulty = a.difficulty;
          signals.difficulty = true;
        }
        if (noteWordCount(a.description) > 0) {
          const text = htmlToPlainText(a.description ?? '');
          book.note =
            text.length > NOTE_CHARS ? `${text.slice(0, NOTE_CHARS)}…` : text;
          if (noteWordCount(a.description) >= 40) signals.notes = true;
        }
        return book;
      });

    const entry: DigestShelf = { id: shelf.id, books, fingerprint: '' };
    if (isTopicalShelfName(shelf.attributes.name)) {
      entry.name = shelf.attributes.name;
    }
    const description = shelf.attributes.description?.trim();
    if (description) entry.description = description;
    entry.fingerprint = createHash('sha1')
      .update(
        JSON.stringify({
          name: entry.name ?? null,
          description: entry.description ?? null,
          books,
        }),
      )
      .digest('hex')
      .slice(0, 16);
    return entry;
  });

  return {
    libraryId: library.id,
    shelves: digested,
    ownedTitles,
    ratedBooks,
    signals,
  };
}
