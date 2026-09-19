import type { NextApiRequest, NextApiResponse } from 'next';

import { COVER_MAX_BYTES } from '@constants/library/cover';
import {
  SHARED_LIBRARY_MAX_MATCHES,
  SHARED_LIBRARY_OWNERS,
} from '@constants/library/sharedLibraries';

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
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
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

function isbnCover(volume: NonNullable<IGoogleVolume['volumeInfo']>) {
  const identifiers = volume.industryIdentifiers ?? [];
  const isbn =
    identifiers.find(i => i.type === 'ISBN_13')?.identifier ??
    identifiers.find(i => i.type === 'ISBN_10')?.identifier;
  return isbn && /^(?:\d{13}|\d{9}[\dXx])$/.test(isbn)
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`
    : undefined;
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
      coverUrl:
        upgradeGoogleBooksCover(
          v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail,
        ) ?? isbnCover(v),
      fallbackCoverUrl:
        v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail
          ? isbnCover(v)
          : undefined,
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
          ? `${OPEN_LIBRARY_COVER}/${d.cover_i}-L.jpg?default=false`
          : undefined,
      sourceUrl: d.key ? `https://openlibrary.org${d.key}` : undefined,
    }));
}

/* ------------------------------------------------------------------------ */
/* Shared member libraries                                                   */
/* ------------------------------------------------------------------------ */

interface IStrapiCoverFormat {
  url?: string;
  /** Kilobytes, as Strapi reports it. */
  size?: number;
}

interface IMemberCover {
  data?: {
    attributes?: IStrapiCoverFormat & {
      formats?: Record<string, IStrapiCoverFormat | undefined>;
    };
  } | null;
}

interface IMemberObject {
  id: number;
  attributes?: {
    title?: string;
    author?: string | null;
    publicationDate?: string | null;
    sourceUrl?: string | null;
    coverImage?: IMemberCover;
  };
}

interface IDirectoryLibrary {
  id: number;
  attributes?: {
    user?: { data?: { attributes?: { username?: string } } | null };
  };
}

interface ISharedLibrary {
  id: number;
  /** The owner's username as the CMS spells it, for "From Wolf’s library". */
  username: string;
}

const DIRECTORY_TTL_MS = 10 * 60 * 1000;
let directoryCache: { at: number; libraries: ISharedLibrary[] } | null = null;

function cmsApiBase(): string | undefined {
  const base = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI;
  return base ? base.replace(/\/+$/, '') : undefined;
}

function cmsMediaBase(): string | undefined {
  const base = process.env.NEXT_PUBLIC_STRAPI || process.env.STRAPI_URL;
  return base ? base.replace(/\/+$/, '') : undefined;
}

function logMember(record: Record<string, unknown>) {
  console.info(
    JSON.stringify({
      mechanism: 'library.autofill.member',
      at: new Date().toISOString(),
      ...record,
    }),
  );
}

/**
 * The shared owners are named by username; the CMS wants library ids. The
 * public directory already lists every library with its owner, so resolve
 * once and keep the answer for a while: a library id never changes.
 */
async function resolveSharedLibraries(
  apiBase: string,
): Promise<ISharedLibrary[]> {
  if (directoryCache && Date.now() - directoryCache.at < DIRECTORY_TTL_MS) {
    return directoryCache.libraries;
  }
  const wanted = new Set(SHARED_LIBRARY_OWNERS.map(u => u.toLowerCase()));
  const found: ISharedLibrary[] = [];
  let page = 1;
  let pageCount = 1;
  do {
    const params = new URLSearchParams({
      'pagination[page]': String(page),
      'pagination[pageSize]': '100',
      'sort[0]': 'id:asc',
    });
    const upstream = await fetchWithTimeout(
      `${apiBase}/api/libraries?${params.toString()}`,
    );
    if (!upstream.ok) throw new Error(`libraries ${upstream.status}`);
    const body = (await upstream.json()) as {
      data?: IDirectoryLibrary[];
      meta?: { pagination?: { pageCount?: number } };
    };
    for (const library of body.data ?? []) {
      const username = library.attributes?.user?.data?.attributes?.username;
      if (username && wanted.has(username.toLowerCase())) {
        found.push({ id: library.id, username });
      }
    }
    pageCount = body.meta?.pagination?.pageCount ?? 1;
    page += 1;
  } while (page <= pageCount && found.length < wanted.size);
  directoryCache = { at: Date.now(), libraries: found };
  return found;
}

// The cover the owner uploaded, in the largest rendition that fits the upload
// cap: the original when it does, else Strapi's resized formats from large
// down. An oversized original is not a missing cover.
function memberCoverUrl(
  cover: IMemberCover | undefined,
  mediaBase: string,
): string | undefined {
  const attributes = cover?.data?.attributes;
  if (!attributes) return undefined;
  const candidates: IStrapiCoverFormat[] = [
    attributes,
    ...['large', 'medium', 'small', 'thumbnail'].map(
      key => attributes.formats?.[key] ?? {},
    ),
  ];
  const fit = candidates.find(
    c => c.url && (c.size == null || c.size * 1024 <= COVER_MAX_BYTES),
  );
  if (!fit?.url) return undefined;
  return /^https?:\/\//i.test(fit.url) ? fit.url : `${mediaBase}${fit.url}`;
}

/**
 * Books on the public shelves of the shared libraries whose title contains
 * the query, offered ahead of every provider. Read anonymously, exactly as a
 * visitor sees the library, so a private shelf can never leak through the
 * wizard. The owner's notes, rating and difficulty are not requested.
 * Never throws: a failure here is logged and costs the member rows only.
 */
async function searchMemberLibraries(
  q: string,
): Promise<IAutofillSuggestion[]> {
  const started = Date.now();
  const apiBase = cmsApiBase();
  const mediaBase = cmsMediaBase();
  if (!apiBase || !mediaBase) {
    logMember({ outcome: 'skipped', reason: 'no CMS base URL' });
    return [];
  }
  try {
    const libraries = await resolveSharedLibraries(apiBase);
    const results = await Promise.all(
      libraries.map(async library => {
        const params = new URLSearchParams({
          'filters[type][$eq]': 'book',
          'filters[title][$containsi]': q,
          'filters[shelf][visibility][$eq]': 'public',
          'filters[shelf][library][id][$eq]': String(library.id),
          'fields[0]': 'title',
          'fields[1]': 'author',
          'fields[2]': 'publicationDate',
          'fields[3]': 'sourceUrl',
          'populate[coverImage][fields][0]': 'url',
          'populate[coverImage][fields][1]': 'formats',
          'populate[coverImage][fields][2]': 'size',
          'sort[0]': 'title:asc',
          'pagination[pageSize]': String(SHARED_LIBRARY_MAX_MATCHES),
        });
        const upstream = await fetchWithTimeout(
          `${apiBase}/api/objects?${params.toString()}`,
        );
        if (!upstream.ok) throw new Error(`objects ${upstream.status}`);
        const body = (await upstream.json()) as { data?: IMemberObject[] };
        return (body.data ?? [])
          .filter(o => !!o.attributes?.title)
          .map<IAutofillSuggestion>(o => ({
            title: o.attributes?.title as string,
            author: o.attributes?.author || undefined,
            publicationDate: o.attributes?.publicationDate || undefined,
            sourceUrl: o.attributes?.sourceUrl || undefined,
            coverUrl: memberCoverUrl(o.attributes?.coverImage, mediaBase),
            memberLibrary: { username: library.username, objectId: o.id },
          }));
      }),
    );
    const suggestions = results.flat();
    logMember({
      outcome: 'served',
      libraries: libraries.length,
      matches: suggestions.length,
      ms: Date.now() - started,
    });
    return suggestions;
  } catch (e) {
    logMember({
      outcome: 'failed',
      error: e instanceof Error ? e.message : String(e),
      ms: Date.now() - started,
    });
    return [];
  }
}

const normalizeTitle = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/* ------------------------------------------------------------------------ */

async function searchProviders(
  q: string,
): Promise<{ provider: string; suggestions: IAutofillSuggestion[] }> {
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
      if (suggestions.length > 0) return { provider: name, suggestions };
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
  return { provider: 'none', suggestions: [] };
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

  // Member libraries and the providers are asked together; the members answer
  // first in the list, the providers fill in below without repeating a title
  // a member already has.
  const [member, providers] = await Promise.all([
    searchMemberLibraries(q),
    searchProviders(q),
  ]);
  const memberTitles = new Set(member.map(s => normalizeTitle(s.title)));
  const suggestions = [
    ...member,
    ...providers.suggestions.filter(
      s => !memberTitles.has(normalizeTitle(s.title)),
    ),
  ];
  res.setHeader(
    'X-Autofill-Provider',
    member.length > 0 ? `member+${providers.provider}` : providers.provider,
  );
  res.status(200).json({ suggestions });
}
