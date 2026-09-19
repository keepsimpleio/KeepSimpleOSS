import { autofillCoverUrl } from '@lib/library/autofillCoverUrl';

import { normaliseTitle } from './digest';

/**
 * A candidate is a string the model wrote. Before it stands on a shelf it
 * must be a book somebody printed: Google Books first, Open Library when
 * Google is down or keyless. What comes back is the source's own title,
 * author, year and cover, never the model's.
 */

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_COVER = 'https://covers.openlibrary.org/b/id';
const UPSTREAM_TIMEOUT_MS = 8000;

export interface VerifiedBook {
  title: string;
  author?: string;
  year?: number;
  coverUrl?: string;
  source: { name: string; url?: string };
}

interface GoogleVolume {
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    canonicalVolumeLink?: string;
    infoLink?: string;
  };
}

interface OpenLibraryDoc {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  key?: string;
}

const fetchWithTimeout = (url: string) =>
  fetch(url, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });

const tokens = (s: string) =>
  normaliseTitle(s)
    .split(' ')
    .filter(t => t.length > 2 && !STOP.has(t));

const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'how']);

/** Share of the wanted title's words present in the found one. */
const titleOverlap = (wanted: string, found: string): number => {
  const want = tokens(wanted);
  if (want.length === 0) return 0;
  const have = new Set(tokens(found));
  const hits = want.filter(t => have.has(t)).length;
  return hits / want.length;
};

const surname = (author?: string): string | undefined => {
  if (!author) return undefined;
  const first = author.split(/,|&| and /)[0]?.trim();
  const parts = first?.split(/\s+/).filter(Boolean) ?? [];
  return parts.length ? normaliseTitle(parts[parts.length - 1]) : undefined;
};

const authorMatches = (wanted?: string, found?: string[]): boolean => {
  const want = surname(wanted);
  if (!want) return true;
  const have = (found ?? []).map(a => normaliseTitle(a));
  return have.some(a => a.includes(want));
};

const upgradeGoogleCover = (raw?: string) =>
  raw
    ? raw
        .replace(/^http:\/\//, 'https://')
        .replace(/([?&])zoom=\d+/, '$1zoom=0')
        .replace(/&edge=curl/, '')
    : undefined;

const isbnCover = (
  identifiers?: Array<{ type: string; identifier: string }>,
): string | undefined => {
  const isbn =
    identifiers?.find(i => i.type === 'ISBN_13')?.identifier ??
    identifiers?.find(i => i.type === 'ISBN_10')?.identifier;
  return isbn && /^(?:\d{13}|\d{9}[\dXx])$/.test(isbn)
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`
    : undefined;
};

const yearOf = (date?: string) => {
  const m = date?.match(/^(\d{4})/);
  return m ? Number(m[1]) : undefined;
};

async function viaGoogle(
  title: string,
  author?: string,
): Promise<VerifiedBook | null> {
  const q = [
    `intitle:"${title}"`,
    surname(author) ? `inauthor:${surname(author)}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const params = new URLSearchParams({
    q,
    maxResults: '5',
    printType: 'books',
  });
  if (process.env.GOOGLE_APIS_KEY)
    params.set('key', process.env.GOOGLE_APIS_KEY);
  const url = `${GOOGLE_BOOKS_URL}?${params.toString()}`;
  let upstream = await fetchWithTimeout(url);
  if (upstream.status >= 500) upstream = await fetchWithTimeout(url);
  if (!upstream.ok) throw new Error(`google-books ${upstream.status}`);
  const body = (await upstream.json()) as { items?: GoogleVolume[] };
  for (const item of body.items ?? []) {
    const v = item.volumeInfo;
    if (!v?.title) continue;
    const full = v.subtitle ? `${v.title}: ${v.subtitle}` : v.title;
    if (titleOverlap(title, full) < 0.6) continue;
    if (!authorMatches(author, v.authors)) continue;
    const raw = upgradeGoogleCover(
      v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail,
    );
    const fallback = isbnCover(v.industryIdentifiers);
    const cover = raw ?? fallback;
    return {
      title: v.title,
      author: v.authors?.join(', ') || undefined,
      year: yearOf(v.publishedDate),
      coverUrl: cover
        ? autofillCoverUrl(cover, raw && fallback ? fallback : undefined)
        : undefined,
      source: {
        name: 'Google Books',
        url: v.canonicalVolumeLink ?? v.infoLink ?? undefined,
      },
    };
  }
  return null;
}

async function viaOpenLibrary(
  title: string,
  author?: string,
): Promise<VerifiedBook | null> {
  const params = new URLSearchParams({
    title,
    limit: '5',
    fields: 'key,title,author_name,first_publish_year,cover_i',
  });
  if (surname(author)) params.set('author', surname(author) as string);
  const upstream = await fetchWithTimeout(
    `${OPEN_LIBRARY_URL}?${params.toString()}`,
  );
  if (!upstream.ok) throw new Error(`open-library ${upstream.status}`);
  const body = (await upstream.json()) as { docs?: OpenLibraryDoc[] };
  for (const d of body.docs ?? []) {
    if (!d.title) continue;
    if (titleOverlap(title, d.title) < 0.6) continue;
    if (!authorMatches(author, d.author_name)) continue;
    const cover = d.cover_i
      ? `${OPEN_LIBRARY_COVER}/${d.cover_i}-L.jpg?default=false`
      : undefined;
    return {
      title: d.title,
      author: d.author_name?.join(', ') || undefined,
      year: d.first_publish_year,
      coverUrl: cover ? autofillCoverUrl(cover) : undefined,
      source: {
        name: 'Open Library',
        url: d.key ? `https://openlibrary.org${d.key}` : undefined,
      },
    };
  }
  return null;
}

/**
 * The first source that knows the book answers. A source that errors is
 * skipped, not trusted; a book neither source knows is not a book here.
 */
export async function verifyBook(
  title: string,
  author?: string,
): Promise<{ book: VerifiedBook | null; errors: string[] }> {
  const errors: string[] = [];
  try {
    const book = await viaGoogle(title, author);
    if (book) return { book, errors };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'google-books');
  }
  try {
    const book = await viaOpenLibrary(title, author);
    if (book) return { book, errors };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'open-library');
  }
  return { book: null, errors };
}
