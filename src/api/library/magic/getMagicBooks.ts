import type { MagicBooksResponse } from '@local-types/library/magicBook';

import { getAccessToken } from '@lib/library/cookie';

/**
 * The owner's magic books, from this app's own route rather than Strapi:
 * the route holds the engine, the store and the key. The session token
 * goes along so the route can ask Strapi who is asking.
 */
const call = async (
  body: Record<string, unknown>,
): Promise<MagicBooksResponse> => {
  const token = getAccessToken();
  if (!token) throw new Error('Sign in to see your magic books.');
  const r = await fetch('/api/library/magic-book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await r.json().catch(() => null)) as
    | MagicBooksResponse
    | { error?: string }
    | null;
  if (!r.ok || !data || !('shelves' in data)) {
    throw new Error(
      (data && 'error' in data && data.error) ||
        'The magic books could not be read.',
    );
  }
  return data;
};

export const getMagicBooks = (libraryId: number) =>
  call({ libraryId, action: 'load' });

export const rerollMagicBook = (libraryId: number, shelfId: number) =>
  call({ libraryId, shelfId, action: 'roll' });
