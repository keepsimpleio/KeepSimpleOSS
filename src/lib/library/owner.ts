import type { NextApiRequest } from 'next';

import type { StrapiLibraryEntry } from '@local-types/library/library';

import { holdsFlag } from '@lib/library/flags';

/**
 * Who is asking, and do they own the library they are asking about. Every
 * Library route that reads a private surface answers this first: the
 * caller's own Strapi session is used for the read, so a token that cannot
 * see the library cannot borrow ours to see it.
 */

// Read when asked, not at load: the release checks load this module outside
// Next, where there is no process.env to read.
const strapiBase = () => process.env.NEXT_PUBLIC_STRAPI ?? '';
const STRAPI_TIMEOUT_MS = 10_000;

const POPULATE = new URLSearchParams({
  'populate[user]': 'true',
  'populate[singleShelves][populate][objects][populate][tags]': 'true',
  'populate[singleShelves][sort][0]': 'order:asc',
  'populate[singleShelves][populate][objects][sort][0]': 'order:asc',
}).toString();

export const bearer = (req: NextApiRequest): string | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
};

const strapi = async <T>(path: string, token: string): Promise<T | null> => {
  const r = await fetch(`${strapiBase()}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(STRAPI_TIMEOUT_MS),
  });
  if (!r.ok) return null;
  return (await r.json()) as T;
};

/** A route says who its private surface is, so the reader is told about the
 * thing they asked for rather than about "this shelf". */
export interface OwnerWording {
  /** No session at all. */
  signIn?: string;
  /** A session, but not the owner of this library. */
  forbidden?: string;
  /** The owner, but without the account flag this surface needs. */
  locked?: string;
}

/** What the surface needs of the account beyond owning the library. */
export interface OwnerRequires {
  /** A `featureNames` entry from /api/users/me, e.g. LIBRARY_AI_FLAG. */
  flag?: string;
}

export interface OwnerCheck {
  status: number;
  error?: string;
  userId?: number;
  library?: StrapiLibraryEntry;
}

export async function ownerOfLibrary(
  req: NextApiRequest,
  libraryId: number,
  wording: OwnerWording = {},
  requires: OwnerRequires = {},
): Promise<OwnerCheck> {
  const token = bearer(req);
  if (!token)
    return {
      status: 401,
      error: wording.signIn ?? 'Sign in to see this shelf.',
    };
  if (!strapiBase())
    return { status: 500, error: 'The library backend is not configured.' };

  const me = await strapi<{ id?: number; featureNames?: string[] }>(
    '/api/users/me',
    token,
  );
  if (!me?.id)
    return { status: 401, error: 'Your session has expired. Sign in again.' };

  const read = await strapi<{ data: StrapiLibraryEntry }>(
    `/api/libraries/${libraryId}?${POPULATE}`,
    token,
  );
  const library = read?.data;
  if (!library) return { status: 404, error: 'No such library.' };

  const ownerId = library.attributes.user?.data?.id;
  if (ownerId == null || String(ownerId) !== String(me.id))
    return {
      status: 403,
      error: wording.forbidden ?? 'Only the owner sees this shelf.',
      userId: me.id,
    };

  // The owner, but the surface is behind an account flag they do not hold:
  // the page does not draw it, and this is what stops a direct call.
  if (requires.flag && !holdsFlag(me, requires.flag))
    return {
      status: 403,
      error: wording.locked ?? 'This surface is not open to your account.',
      userId: me.id,
    };

  return { status: 200, userId: me.id, library };
}
