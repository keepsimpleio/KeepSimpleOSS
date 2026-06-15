import type { NextApiRequest, NextApiResponse } from 'next';

import type { IAutofillSuggestion } from '@local-types/library/autofill';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

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
  // Works keyless (lower anonymous quota); the shared Google key lifts it.
  if (process.env.GOOGLE_APIS_KEY) {
    params.set('key', process.env.GOOGLE_APIS_KEY);
  }

  try {
    const upstream = await fetch(`${GOOGLE_BOOKS_URL}?${params.toString()}`);
    if (!upstream.ok) {
      res.status(502).json({ error: 'Book search is unavailable right now.' });
      return;
    }
    const body = (await upstream.json()) as { items?: IGoogleVolume[] };

    const suggestions: IAutofillSuggestion[] = (body.items ?? [])
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

    res.status(200).json({ suggestions });
  } catch {
    res.status(502).json({ error: 'Book search is unavailable right now.' });
  }
}
