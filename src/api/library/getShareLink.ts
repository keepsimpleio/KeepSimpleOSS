import axios from 'axios';

import type { IShareLinkView } from '@local-types/library/shareLink';

import axiosInstance from '@lib/library/axios';
import { mapSharedObject } from '@lib/library/mapSharedObject';

// Dig the ordered objects out of whatever wrapper the controller returns. The
// success shape isn't pinned, so probe the likely spots in turn: the share-link
// entity's `objects`, a Strapi relation list, or a bare array under `data`.
// TODO(backend): pin the success shape and drop the extra fallbacks.
function extractObjects(body: unknown): unknown[] {
  if (!body || typeof body !== 'object') return [];
  const b = body as Record<string, unknown>;
  const data = b.data as Record<string, unknown> | unknown[] | undefined;

  if (Array.isArray(data)) return data;
  if (Array.isArray(b.objects)) return b.objects;

  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.objects)) return d.objects;

    const relation = d.objects as { data?: unknown } | undefined;
    if (relation && Array.isArray(relation.data)) return relation.data;

    const attributes = d.attributes as Record<string, unknown> | undefined;
    const attrRelation = attributes?.objects as { data?: unknown } | undefined;
    if (attrRelation && Array.isArray(attrRelation.data))
      return attrRelation.data;
  }

  return [];
}

// Open a share link by its token (public — the token is the credential). Returns
// a discriminated view so the recipient page can show a distinct UI for expired
// (410), unknown/bad token (404/400), and transport failures.
export const getShareLink = async (token: string): Promise<IShareLinkView> => {
  try {
    const { data } = await axiosInstance.get(
      `/api/share-links/${encodeURIComponent(token)}`,
    );
    const objects = extractObjects(data)
      .map(mapSharedObject)
      .filter((o): o is NonNullable<typeof o> => o !== null);
    return { status: 'ok', objects };
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    if (status === 410) return { status: 'expired', objects: [] };
    if (status === 404) return { status: 'notFound', objects: [] };
    if (status === 400) return { status: 'invalid', objects: [] };
    console.error('getShareLink failed:', error);
    return { status: 'error', objects: [] };
  }
};
