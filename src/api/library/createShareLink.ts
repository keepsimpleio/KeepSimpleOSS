import axios from 'axios';

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

// Read the backend's own reason out of a rejected mint. The 400s are
// deterministic (a non-public object, an empty selection, more than 21 after
// expansion): retrying changes nothing, so the reason must reach the owner.
function readErrorMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const body = error.response?.data as
    | { error?: { message?: string } }
    | undefined;
  const message = body?.error?.message;
  return typeof message === 'string' && message.trim() ? message : undefined;
}

// Mint a share link for the ordered object ids. Returns the token, or the
// backend's reason when it refused.
export const createShareLink = async (
  objectIds: number[],
): Promise<IShareLinkResult | { error: string; retryable: boolean }> => {
  try {
    const payload: ICreateShareLinkPayload = { objectIds };
    const { data } = await axiosInstance.post('/api/share-links', {
      data: payload,
    });
    const token = readToken(data);
    return token
      ? { token }
      : { error: 'The link came back without a token.', retryable: true };
  } catch (error) {
    console.error('createShareLink failed:', error);
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    const reason = readErrorMessage(error);
    if (status === 400 && reason) return { error: reason, retryable: false };
    if (status === 401 || status === 403) {
      return {
        error: 'Your session has expired. Reload the page and sign in again.',
        retryable: false,
      };
    }
    return {
      error: reason ?? 'Could not create the link. Please try again.',
      retryable: true,
    };
  }
};
