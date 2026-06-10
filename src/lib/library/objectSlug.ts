import type { IObject } from '@local-types/library/object';

// Title → URL-safe slug: lowercase, accents stripped (NFKD splits an accented
// letter into base + combining mark, which the non-alphanumeric pass below then
// drops), every run of non-alphanumerics collapsed to one hyphen, no
// leading/trailing hyphens.
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Public URL segment for an object: a readable slugified title with the object
// id appended. The id keeps two objects that share a title (or a title that
// slugifies to nothing) addressable and unique, and makes the slug reversible —
// `objectIdFromSlug` reads it back without needing the title to be unchanged.
export function objectSlug(object: IObject): string {
  const base = slugifyTitle(object.attributes.title || '');
  return base ? `${base}-${object.id}` : String(object.id);
}

// Recover the object id from a slug produced by `objectSlug`. Matches on the
// trailing `-<id>` (or a bare numeric slug) so a title edit never breaks an
// already-open object URL — the id is the stable part.
export function objectIdFromSlug(slug: string | undefined): number | null {
  if (!slug) return null;
  const match = /-(\d+)$/.exec(slug) ?? /^(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
}
