import axiosInstance from '@/libraries/axios';

import type { ICreateObjectPayload, IObjectSingleResponse } from '@/types/object';

export const createObject = async (
  payload: ICreateObjectPayload
): Promise<IObjectSingleResponse> => {
  // No `populate` query params here: Strapi users-permissions runs a
  // relation-level permission check on each populated field, and the
  // Authenticated role typically lacks find/findOne on shelf/tag/upload,
  // which surfaces as a 403 on the whole POST. AddObjectModal backfills
  // coverImage + tags from local data; the next library refetch returns
  // the canonical populated shape.
  const { data } = await axiosInstance.post<IObjectSingleResponse>('/api/objects', {
    data: payload,
  });

  return data;
};
