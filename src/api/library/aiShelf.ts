import type {
  RecommendedPreference,
  RecommendedShelfState,
} from '@local-types/library/recommendation';

import { getAccessToken } from '@lib/library/cookie';

/**
 * The owner's AI shelf, from this app's own route rather than Strapi: the
 * route holds the engine, the board and the relay. The session token goes
 * along so the route can ask Strapi who is asking.
 */
const call = async (
  body: Record<string, unknown>,
): Promise<RecommendedShelfState> => {
  const token = getAccessToken();
  if (!token) throw new Error('Sign in to see this shelf.');
  const r = await fetch('/api/library/ai-shelf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await r.json().catch(() => null)) as
    | RecommendedShelfState
    | { error?: string }
    | null;
  if (!r.ok || !data || !('picks' in data)) {
    throw new Error(
      (data && 'error' in data && data.error) ||
        'The shelf could not be read right now.',
    );
  }
  return data;
};

export const getAiShelf = (libraryId: number) =>
  call({ libraryId, action: 'load' });

export const rollAiShelf = (libraryId: number) =>
  call({ libraryId, action: 'roll' });

export const setAiShelfPreference = (
  libraryId: number,
  preference: RecommendedPreference,
) => call({ libraryId, action: 'preference', preference });

export const lockAiShelfPick = (
  libraryId: number,
  pickId: string,
  on: boolean,
) => call({ libraryId, action: 'lock', pickId, on });

export const banAiShelfPick = (
  libraryId: number,
  book: { pickId?: string; title?: string; author?: string },
  on: boolean,
) => call({ libraryId, action: 'ban', ...book, on });
