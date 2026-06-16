import type { NextApiRequest, NextApiResponse } from 'next';

import type { IAutofillSuggestion } from '@local-types/library/autofill';

const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

// watch?v=ID | youtu.be/ID | shorts/ID | embed/ID | live/ID
export function extractYouTubeId(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, '');
  const isValidId = (id: string | null | undefined): id is string =>
    !!id && /^[A-Za-z0-9_-]{11}$/.test(id);

  if (host === 'youtu.be') {
    const id = url.pathname.split('/')[1];
    return isValidId(id) ? id : null;
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const v = url.searchParams.get('v');
    if (isValidId(v)) return v;
    const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/);
    if (match && isValidId(match[1])) return match[1];
  }
  return null;
}

interface IYouTubeItem {
  snippet?: {
    title?: string;
    channelTitle?: string;
    publishedAt?: string;
    description?: string;
    thumbnails?: Partial<
      Record<
        'maxres' | 'standard' | 'high' | 'medium' | 'default',
        { url?: string }
      >
    >;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ suggestion: IAutofillSuggestion } | { error: string }>,
) {
  const rawUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
  const videoId = rawUrl ? extractYouTubeId(rawUrl) : null;
  if (!videoId) {
    res.status(422).json({ error: 'unsupported_url' });
    return;
  }

  // Prefer a dedicated YouTube key; fall back to the shared Google key when a
  // single key covers both Books + YouTube Data API v3.
  const key = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_APIS_KEY;
  if (!key) {
    res.status(500).json({ error: 'Video autofill is not configured.' });
    return;
  }

  const params = new URLSearchParams({
    part: 'snippet',
    id: videoId,
    key,
  });

  try {
    const upstream = await fetch(`${YOUTUBE_VIDEOS_URL}?${params.toString()}`);
    if (!upstream.ok) {
      res.status(502).json({ error: 'Video lookup is unavailable right now.' });
      return;
    }
    const body = (await upstream.json()) as { items?: IYouTubeItem[] };
    const snippet = body.items?.[0]?.snippet;
    if (!snippet?.title) {
      res.status(404).json({ error: 'Video not found.' });
      return;
    }

    const thumbs = snippet.thumbnails;
    const suggestion: IAutofillSuggestion = {
      title: snippet.title,
      author: snippet.channelTitle || undefined,
      publicationDate: snippet.publishedAt?.slice(0, 10) || undefined,
      description: snippet.description || undefined,
      coverUrl:
        (thumbs?.maxres ?? thumbs?.standard ?? thumbs?.high ?? thumbs?.medium)
          ?.url || undefined,
      sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };

    res.status(200).json({ suggestion });
  } catch {
    res.status(502).json({ error: 'Video lookup is unavailable right now.' });
  }
}
