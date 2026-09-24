// motion-passport: exempt — a server route; nothing here is drawn.
import { createHash, timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

import { journalPush, writeStoredGuide } from '@lib/aiAtlas/store';
import { stripGuide } from '@lib/aiAtlas/stripGuide';

/**
 * POST /api/ai-atlas/guide
 *
 * The Terminal pushes its Atlas guide here on every Atlas deploy, so
 * keepsimple.io/ai-atlas follows the Terminal's content without a rebuild
 * (Wolf, 2026-09-24). The body is the Terminal's full guide; it is cut to
 * the fields the page renders before anything is stored, stored on the
 * container's persistent mount, and the page is regenerated in every locale.
 *
 * Auth: `Authorization: Bearer <AI_ATLAS_PUSH_KEY>`. Without the variable
 * set on the server the route refuses every push.
 *
 * Nothing is readable here: the guide reaches visitors only as the HTML of
 * /ai-atlas, never as a standalone file.
 */

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

const PAGES = ['/ai-atlas', '/ru/ai-atlas', '/hy/ai-atlas'];

const digest = (value: string) => createHash('sha256').update(value).digest();

const authorised = (header: string | undefined) => {
  const key = process.env.AI_ATLAS_PUSH_KEY;
  if (!key || !header?.startsWith('Bearer ')) return false;
  return timingSafeEqual(digest(header.slice(7)), digest(key));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }
  if (!process.env.AI_ATLAS_PUSH_KEY) {
    await journalPush({ verdict: 'refused', reason: 'key not configured' });
    return res.status(503).json({ error: 'push key not configured' });
  }
  if (!authorised(req.headers.authorization)) {
    await journalPush({ verdict: 'refused', reason: 'bad key' });
    return res.status(401).json({ error: 'unauthorised' });
  }

  const result = stripGuide(req.body);
  if ('error' in result) {
    await journalPush({ verdict: 'refused', reason: result.error });
    return res.status(400).json({ error: result.error });
  }

  const { guide } = result;
  await writeStoredGuide(guide);

  const failed: string[] = [];
  for (const page of PAGES) {
    try {
      await res.revalidate(page);
    } catch {
      failed.push(page);
    }
  }

  const summary = {
    generatedAt: guide.generatedAt,
    steps: guide.steps.length,
    entries: guide.entries.length,
    nodes: guide.system.nodes.length,
    bytes: JSON.stringify(guide).length,
    revalidated: PAGES.filter(p => !failed.includes(p)),
    failed,
  };
  await journalPush({ verdict: failed.length ? 'stored' : 'live', ...summary });
  return res.status(failed.length ? 502 : 200).json(summary);
}
