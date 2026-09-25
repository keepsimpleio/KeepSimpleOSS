import {
  LIBRARY_AI_BOOKS_OVER,
  LIBRARY_AI_FLAG,
} from '@constants/library/common';

import type { StrapiLibraryEntry } from '@local-types/library/library';

/**
 * Account feature flags, as `GET /api/users/me` reports them in
 * `featureNames`. One pure check, shared by the page (what is drawn) and the
 * API routes (what is allowed), so the two cannot disagree.
 */
export const holdsFlag = (
  me: { featureNames?: unknown } | null | undefined,
  flag: string,
): boolean => Array.isArray(me?.featureNames) && me.featureNames.includes(flag);

/** Books in the library across every shelf, private ones included. Audio and
 * video do not count. */
export const countBooks = (
  library: StrapiLibraryEntry | null | undefined,
): number =>
  (library?.attributes.singleShelves?.data ?? []).reduce(
    (sum, shelf) =>
      sum +
      (shelf.attributes.objects?.data ?? []).filter(
        object => object.attributes.type === 'book',
      ).length,
    0,
  );

/**
 * The AI shelf and the magic books open to an owner who holds the
 * `library-ai` flag, or whose library holds more than LIBRARY_AI_BOOKS_OVER
 * books (Wolf, 2026-09-25). The count is read from the library each time, so
 * the AI arrives with the book that crosses the line and nothing is stored.
 */
export const opensLibraryAi = (
  me: { featureNames?: unknown } | null | undefined,
  library: StrapiLibraryEntry | null | undefined,
): boolean =>
  holdsFlag(me, LIBRARY_AI_FLAG) || countBooks(library) > LIBRARY_AI_BOOKS_OVER;
