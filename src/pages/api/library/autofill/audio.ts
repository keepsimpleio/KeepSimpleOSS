import type { NextApiRequest, NextApiResponse } from 'next';

import type { IAutofillSuggestion } from '@local-types/library/autofill';

const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';

// `media=all` would also return movies/TV; query each audio media type we care
// about instead, in parallel, and interleave so each kind gets a fair slot.
const AUDIO_MEDIA = ['music', 'podcast', 'audiobook'] as const;

interface IItunesResult {
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  releaseDate?: string;
  description?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
  trackTimeMillis?: number;
}

function toSuggestion(r: IItunesResult): IAutofillSuggestion | null {
  const title = r.trackName ?? r.collectionName;
  if (!title) return null;
  return {
    title,
    author: r.artistName || undefined,
    publicationDate: r.releaseDate?.slice(0, 10) || undefined,
    description: r.description || undefined,
    // 100x100 is part of the artwork path — swap for a usable cover size.
    coverUrl: r.artworkUrl100?.replace('100x100', '600x600') || undefined,
    sourceUrl: r.trackViewUrl ?? r.collectionViewUrl ?? undefined,
    durationSeconds:
      typeof r.trackTimeMillis === 'number'
        ? Math.round(r.trackTimeMillis / 1000)
        : undefined,
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

  try {
    const batches = await Promise.all(
      AUDIO_MEDIA.map(async media => {
        const params = new URLSearchParams({ term: q, media, limit: '3' });
        const upstream = await fetch(`${ITUNES_SEARCH_URL}?${params}`);
        if (!upstream.ok) return [];
        const body = (await upstream.json()) as { results?: IItunesResult[] };
        return body.results ?? [];
      }),
    );

    const interleaved: IItunesResult[] = [];
    for (let i = 0; i < 3; i += 1) {
      for (const batch of batches) {
        if (batch[i]) interleaved.push(batch[i]);
      }
    }

    const seen = new Set<string>();
    const suggestions: IAutofillSuggestion[] = [];
    for (const result of interleaved) {
      const suggestion = toSuggestion(result);
      if (!suggestion) continue;
      const key =
        `${suggestion.title}::${suggestion.author ?? ''}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      suggestions.push(suggestion);
      if (suggestions.length === 6) break;
    }

    res.status(200).json({ suggestions });
  } catch {
    res.status(502).json({ error: 'Audio search is unavailable right now.' });
  }
}
