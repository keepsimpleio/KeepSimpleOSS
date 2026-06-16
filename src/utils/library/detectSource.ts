// Map a media URL to a human-readable platform name for the object's `source`
// field. Used to auto-fill Source from a pasted/autofilled audio or video link
// so the user never types it. Returns undefined for empty/unparseable input.
const KNOWN_SOURCES: { test: RegExp; name: string }[] = [
  { test: /(^|\.)open\.spotify\.com$/, name: 'Spotify' },
  { test: /(^|\.)spotify\.com$/, name: 'Spotify' },
  { test: /(^|\.)soundcloud\.com$/, name: 'SoundCloud' },
  { test: /(^|\.)music\.apple\.com$/, name: 'Apple Music' },
  { test: /(^|\.)podcasts\.apple\.com$/, name: 'Apple Podcasts' },
  { test: /(^|\.)itunes\.apple\.com$/, name: 'Apple Music' },
  { test: /(^|\.)music\.youtube\.com$/, name: 'YouTube Music' },
  { test: /(^|\.)youtube\.com$/, name: 'YouTube' },
  { test: /(^|\.)youtu\.be$/, name: 'YouTube' },
  { test: /(^|\.)youtube-nocookie\.com$/, name: 'YouTube' },
  { test: /(^|\.)vimeo\.com$/, name: 'Vimeo' },
  { test: /(^|\.)bandcamp\.com$/, name: 'Bandcamp' },
  { test: /(^|\.)deezer\.com$/, name: 'Deezer' },
  { test: /(^|\.)tidal\.com$/, name: 'Tidal' },
  { test: /(^|\.)mixcloud\.com$/, name: 'Mixcloud' },
  { test: /(^|\.)audible\.com$/, name: 'Audible' },
];

export function detectSource(rawUrl: string): string | undefined {
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  let url: URL;
  try {
    url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
  } catch {
    return undefined;
  }

  const host = url.hostname.replace(/^www\./, '');
  const match = KNOWN_SOURCES.find(s => s.test.test(host));
  if (match) return match.name;

  // Unknown host: fall back to the second-level domain, capitalized
  // (e.g. "podcasts.example.com" → "Example").
  const parts = host.split('.');
  const base = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : undefined;
}
