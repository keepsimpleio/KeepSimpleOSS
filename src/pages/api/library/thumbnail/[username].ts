import type { NextApiRequest, NextApiResponse } from 'next';

import { renderLibraryThumbnail } from '@lib/library/thumbnail';

import { getPublicLibrarySeo } from '@api/library/getPublicLibrarySeo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let status = 500;
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      status = 405;
      res.setHeader('Allow', 'GET, HEAD');
      return res.status(status).end();
    }
    const username = req.query.username;
    if (
      typeof username !== 'string' ||
      !username.length ||
      username.length > 30
    ) {
      status = 400;
      return res.status(status).end();
    }
    const seo = await getPublicLibrarySeo(username);
    if (!seo.username || !seo.displayName) {
      status = 404;
      return res.status(status).end();
    }
    const png = await renderLibraryThumbnail(seo.displayName, seo.username);
    status = 200;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('Content-Length', png.length);
    return req.method === 'HEAD'
      ? res.status(status).end()
      : res.status(status).send(png);
  } catch {
    status = 503;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(status).end();
  } finally {
    console.info(
      JSON.stringify({
        at: new Date().toISOString(),
        event: 'library-thumbnail',
        status,
      }),
    );
  }
}
