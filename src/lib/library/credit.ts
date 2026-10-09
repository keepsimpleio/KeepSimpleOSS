/**
 * Who a library is credited to, and which library is offered to search.
 *
 * A username is an address, not a name: `/library/wolf` belongs to Wolf
 * Alexanyan and every surface of it says so in the same words, on the page and
 * in its schema.org entry, so the credit a visitor reads is the credit search
 * records.
 *
 * Search is a separate decision and Wolf's (2026-09-12): only the libraries
 * named here are listed in `library-sitemap.xml` and left indexable, and every
 * other library answers `noindex, nofollow` while staying open to anyone
 * holding its link. Offering one more library to search is one entry below.
 */

const DISPLAY_NAMES: Record<string, string> = {
  wolf: 'Wolf Alexanyan',
};

/** The libraries offered to search engines. */
const SEARCHABLE = new Set(Object.keys(DISPLAY_NAMES));

const normalize = (username?: string | null) =>
  username?.trim().toLowerCase() ?? '';

/** The owner as a reader should see them named; the username when unknown. */
export const ownerDisplayName = (username?: string | null): string | null => {
  const owner = normalize(username);
  if (!owner) return null;
  return DISPLAY_NAMES[owner] ?? username?.trim() ?? null;
};

/** True when this library is listed in the sitemap and left indexable. */
export const isSearchableLibrary = (username?: string | null): boolean =>
  SEARCHABLE.has(normalize(username));

/**
 * The owner as a schema.org `Person`, carrying the name search should credit.
 * `url` is the library itself, the page the name is signed on.
 */
export const ownerPerson = (username?: string | null) => {
  const name = ownerDisplayName(username);
  if (!name) return null;
  return {
    '@type': 'Person' as const,
    name,
    url: `https://keepsimple.io/library/${normalize(username)}`,
  };
};
