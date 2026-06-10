import type {
  ICreateShareLinkPayload,
  IShareLinkResult,
} from '@local-types/library/shareLink';

import axiosInstance from '@lib/library/axios';

// Pull the token out of whatever shape the backend returns. Strapi custom
// controllers vary between a bare body, a `{ data }` wrapper, and the full
// `{ data: { attributes } }` entity form — so probe each in turn.
// TODO(backend): pin the exact success shape and drop the extra fallbacks.
function readToken(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const data = b.data as Record<string, unknown> | undefined;
  const attributes = data?.attributes as Record<string, unknown> | undefined;
  const token = b.token ?? data?.token ?? attributes?.token;
  return typeof token === 'string' && token.length > 0 ? token : null;
}

// Mint a share link for the ordered object ids. Returns the token, or null on
// failure (the caller surfaces a retry message — the backend 400s on an empty
// selection, a non-public object, or more than 21 objects after expansion).
export const createShareLink = async (
  objectIds: number[],
): Promise<IShareLinkResult | null> => {
  try {
    const payload: ICreateShareLinkPayload = { objectIds };
    const { data } = await axiosInstance.post('/api/share-links', {
      data: payload,
    });
    const token = readToken(data);
    return token ? { token } : null;
  } catch (error) {
    console.error('createShareLink failed:', error);
    return null;
  }
};
