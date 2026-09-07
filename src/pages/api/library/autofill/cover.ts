import type { NextApiRequest, NextApiResponse } from 'next';

// The client pulls provider covers through an allowlisted proxy because
// provider CDNs restrict browser-side downloads.
const ALLOWED_HOSTS = [
  /^books\.google\.com$/,
  /^books\.googleusercontent\.com$/,
  /^covers\.openlibrary\.org$/,
  /^archive\.org$/,
  // Open Library redirects stored cover scans to Internet Archive.
  /^ia\d+\.(us|eu)\.archive\.org$/,
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
      !url.username &&
      !url.password &&
      (!url.port || url.port === '443') &&
      (url.hostname !== 'archive.org' ||
        /^\/download\/[a-z]_covers_\d+\//.test(url.pathname)) &&
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
    const signal = AbortSignal.timeout(8000);
    let upstream: Response;
    for (let redirects = 0; redirects <= 3; redirects++) {
      if (!isAllowed(url)) return null;
      upstream = await fetch(url, { redirect: 'manual', signal });
      if (![301, 302, 303, 307, 308].includes(upstream.status)) break;
      const location = upstream.headers.get('location');
      await upstream.body?.cancel();
      if (!location || redirects === 3) return null;
      url = new URL(location, url).toString();
    }
    if (!upstream.ok) {
      await upstream.body?.cancel();
      return null;
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (
      !contentType.startsWith('image/') ||
      Number(upstream.headers.get('content-length')) > MAX_BYTES
    ) {
      await upstream.body?.cancel();
      return null;
    }

    const reader = upstream.body?.getReader();
    if (!reader) return null;
    const chunks: Buffer[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(Buffer.from(value));
    }
    if (!length) return null;
    const buffer = Buffer.concat(chunks, length);

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
  const fallback =
    typeof req.query.fallback === 'string' ? req.query.fallback : '';
  if (!isAllowed(rawUrl) || (fallback && !isAllowed(fallback))) {
    res.status(400).json({ error: 'URL is not an allowed cover source.' });
    return;
  }

  const candidates = [
    rawUrl,
    ...fallbacksFor(rawUrl),
    ...(fallback ? [fallback] : []),
  ];
  for (let attempt = 0; attempt < candidates.length; attempt++) {
    const candidate = candidates[attempt];
    const image = await pull(candidate);
    if (!image) continue;

    res.setHeader('Content-Type', image.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    console.info(
      JSON.stringify({
        mechanism: 'library.autofill.cover',
        at: new Date().toISOString(),
        outcome: 'served',
        host: new URL(candidate).hostname,
        attempt,
      }),
    );
    res.status(200).send(image.buffer);
    return;
  }

  console.warn(
    JSON.stringify({
      mechanism: 'library.autofill.cover',
      at: new Date().toISOString(),
      outcome: 'unavailable',
      host: new URL(rawUrl).hostname,
    }),
  );
  res.status(502).json({ error: 'Could not fetch the cover image.' });
}
