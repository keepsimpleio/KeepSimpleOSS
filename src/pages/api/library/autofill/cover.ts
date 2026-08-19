import type { NextApiRequest, NextApiResponse } from 'next';

// Browser-side fetch of provider covers is blocked by CORS/hotlinking, so the
// client pulls them through this proxy. The host allowlist is the SSRF guard —
// only the cover/thumbnail CDNs of the three autofill providers are reachable.
const ALLOWED_HOSTS = [
  /^books\.google\.com$/,
  /^books\.googleusercontent\.com$/,
  /(^|\.)mzstatic\.com$/,
  /^i\.ytimg\.com$/,
  /^img\.youtube\.com$/,
];

const MAX_BYTES = 5 * 1024 * 1024; // matches the cover upload limit

function isAllowed(raw: string): boolean {
  try {
    const url = new URL(raw);
    return (
      url.protocol === 'https:' &&
      ALLOWED_HOSTS.some(re => re.test(url.hostname))
    );
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const rawUrl = typeof req.query.url === 'string' ? req.query.url : '';
  if (!isAllowed(rawUrl)) {
    res.status(400).json({ error: 'URL is not an allowed cover source.' });
    return;
  }

  try {
    const upstream = await fetch(rawUrl);
    // Re-check after redirects so an allowed host can't bounce us elsewhere.
    if (!upstream.ok || !isAllowed(upstream.url)) {
      res.status(502).json({ error: 'Could not fetch the cover image.' });
      return;
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) {
      res.status(502).json({ error: 'Cover source did not return an image.' });
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    if (buffer.byteLength > MAX_BYTES) {
      res.status(413).json({ error: 'Cover image is too large.' });
      return;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(buffer);
  } catch {
    res.status(502).json({ error: 'Could not fetch the cover image.' });
  }
}
