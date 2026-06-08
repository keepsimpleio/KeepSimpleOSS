/**
 * Resolve a Strapi media URL to an absolute URL.
 *
 * Strapi REST returns relative paths (`/uploads/foo.jpg`) when the local
 * upload provider is in use, and absolute URLs when a CDN/S3 provider is
 * configured. Both need to work — prefix the relative ones with the public
 * Strapi base, pass absolute ones through unchanged.
 */
export function resolveStrapiUrl(raw?: string | null): string | null {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = process.env.NEXT_PUBLIC_STRAPI ?? '';
  return `${base}${raw}`;
}
