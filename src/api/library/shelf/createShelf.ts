import axiosInstance from '@/libraries/axios';

import type { ICreateShelfPayload, IShelfSingleResponse } from '@/types/shelf';

export const createShelf = async (payload: ICreateShelfPayload): Promise<IShelfSingleResponse> => {
  const { data } = await axiosInstance.post<IShelfSingleResponse>('/api/single-shelves', {
    data: {
      visibility: 'public',
      order: 0,
      objects: [],
      // single-shelf has draftAndPublish: true. Direct queries filter by
      // publication state, so publish explicitly to keep the new shelf visible.
      publishedAt: new Date().toISOString(),
      ...payload,
    },
  });

  return data;
};
