import type { NextApiRequest, NextApiResponse } from 'next';

import type { IAutofillSuggestion } from '@local-types/library/autofill';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_COVER = 'https://covers.openlibrary.org/b/id';
const UPSTREAM_TIMEOUT_MS = 8000;

// Google's `imageLinks.thumbnail` is a tiny ~128px crop (zoom=1) with a folded
// page-corner effect. `zoom=0` returns the full-resolution cover scan, and
// dropping `edge=curl` removes the curl — a much cleaner cover to autofill.
function upgradeGoogleBooksCover(raw?: string): string | undefined {
  if (!raw) return undefined;
  return raw
    .replace(/^http:\/\//, 'https://')
    .replace(/([?&])zoom=\d+/, '$1zoom=0')
    .replace(/&edge=curl/, '');
}

interface IGoogleVolume {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    canonicalVolumeLink?: string;
    infoLink?: string;
  };
}

interface IOpenLibraryDoc {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  key?: string;
}

function fetchWithTimeout(url: string): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
}

/**
 * Google Books — richest metadata (descriptions, per-edition covers), but it
 * needs GOOGLE_APIS_KEY to be worth anything: the keyless anonymous quota is
 * shared across every caller on the internet and sits exhausted most days.
 */
async function searchGoogleBooks(q: string): Promise<IAutofillSuggestion[]> {
  const params = new URLSearchParams({
    q: `intitle:${q}`,
    maxResults: '6',
    printType: 'books',
    // Bias toward English editions — foreign editions otherwise surface with
    // transliterated author names (e.g. "Fëdor Michajlovič Dostoevskij").
    // Google's per-edition metadata is still inconsistent; the author field
    // stays editable so the user can correct an odd spelling.
    langRestrict: 'en',
  });
  if (process.env.GOOGLE_APIS_KEY) {
    params.set('key', process.env.GOOGLE_APIS_KEY);
  }

  // Google Books 503s intermittently on perfectly valid keyed requests (seen
  // roughly one call in three), so a single immediate retry recovers most of
  // them before we fall through to the second provider.
  const url = `${GOOGLE_BOOKS_URL}?${params.toString()}`;
  let upstream = await fetchWithTimeout(url);
  if (upstream.status >= 500) {
    upstream = await fetchWithTimeout(url);
  }
  if (!upstream.ok) {
    throw new Error(`google-books ${upstream.status}`);
  }
  const body = (await upstream.json()) as { items?: IGoogleVolume[] };

  return (body.items ?? [])
    .map(item => item.volumeInfo)
    .filter((v): v is NonNullable<IGoogleVolume['volumeInfo']> => !!v?.title)
    .map(v => ({
      title: v.title as string,
      author: v.authors?.join(', ') || undefined,
      publicationDate: v.publishedDate || undefined,
      description: v.description || undefined,
      coverUrl: upgradeGoogleBooksCover(
        v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail,
      ),
      sourceUrl: v.canonicalVolumeLink ?? v.infoLink ?? undefined,
    }));
}

/**
 * Open Library — no key, no quota, so it keeps title search alive whenever
 * Google is rate-limited or the key is missing on this environment. Thinner
 * metadata: title, author, year and a cover, no description.
 */
async function searchOpenLibrary(q: string): Promise<IAutofillSuggestion[]> {
  const params = new URLSearchParams({
    title: q,
    limit: '6',
    fields: 'key,title,author_name,first_publish_year,cover_i',
  });

  const upstream = await fetchWithTimeout(
    `${OPEN_LIBRARY_URL}?${params.toString()}`,
  );
  if (!upstream.ok) {
    throw new Error(`open-library ${upstream.status}`);
  }
  const body = (await upstream.json()) as { docs?: IOpenLibraryDoc[] };

  return (body.docs ?? [])
    .filter((d): d is IOpenLibraryDoc & { title: string } => !!d?.title)
    .map(d => ({
      title: d.title,
      author: d.author_name?.join(', ') || undefined,
      publicationDate: d.first_publish_year
        ? String(d.first_publish_year)
        : undefined,
      coverUrl:
        d.cover_i != null
          ? `${OPEN_LIBRARY_COVER}/${d.cover_i}-L.jpg`
          : undefined,
      sourceUrl: d.key ? `https://openlibrary.org${d.key}` : undefined,
    }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { suggestions: IAutofillSuggestion[] } | { error: string }
  >,
) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (q.length < 3) {
    res.status(400).json({ error: 'Query must be at least 3 characters.' });
    return;
  }

  // Google first for the richer records, Open Library whenever Google fails or
  // comes back empty. One provider being down (or unkeyed on this deploy) must
  // never leave the user typing everything by hand.
  const providers: Array<
    [string, (q: string) => Promise<IAutofillSuggestion[]>]
  > = [
    ['google-books', searchGoogleBooks],
    ['open-library', searchOpenLibrary],
  ];

  for (const [name, search] of providers) {
    try {
      const suggestions = await search(q);
      if (suggestions.length > 0) {
        res.setHeader('X-Autofill-Provider', name);
        res.status(200).json({ suggestions });
        return;
      }
      console.info(`[autofill/book] ${name} returned no matches`);
    } catch (e) {
      console.warn(
        `[autofill/book] ${name} failed:`,
        e instanceof Error ? e.message : e,
      );
    }
  }

  // Every provider answered, none had a match — an empty list, not an outage,
  // so the field says "no matches" instead of "search is unavailable".
  res.setHeader('X-Autofill-Provider', 'none');
  res.status(200).json({ suggestions: [] });
}
