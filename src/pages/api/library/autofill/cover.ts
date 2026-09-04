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

// The full-resolution Google scan (zoom=0) is the cover worth having, but it is
// not always there: some volumes answer it with an error, some rate-limit the
// image endpoint, and a large scan blows the 5 MB cap. When it fails, the
// thumbnail the API actually advertised still beats an empty cover slot.
function fallbacksFor(raw: string): string[] {
  try {
    const url = new URL(raw);
    if (url.hostname !== 'books.google.com') return [];
    if (url.searchParams.get('zoom') !== '0') return [];
    url.searchParams.set('zoom', '1');
    return [url.toString()];
  } catch {
    return [];
  }
}

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

async function pull(
  url: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const upstream = await fetch(url);
    // Re-check after redirects so an allowed host can't bounce us elsewhere.
    if (!upstream.ok || !isAllowed(upstream.url)) return null;

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) return null;

    const buffer = Buffer.from(await upstream.arrayBuffer());
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) return null;

    return { buffer, contentType };
  } catch {
    return null;
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

  for (const candidate of [rawUrl, ...fallbacksFor(rawUrl)]) {
    const image = await pull(candidate);
    if (!image) continue;

    res.setHeader('Content-Type', image.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(image.buffer);
    return;
  }

  res.status(502).json({ error: 'Could not fetch the cover image.' });
}
