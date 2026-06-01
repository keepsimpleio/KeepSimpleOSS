import axiosInstance from '@/libraries/axios';

import type { IShelfSingleResponse, IUpdateShelfPayload } from '@/types/shelf';

export const updateShelf = async (
  id: number,
  payload: IUpdateShelfPayload
): Promise<IShelfSingleResponse> => {
  const { data } = await axiosInstance.put<IShelfSingleResponse>(`/api/single-shelves/${id}`, {
    data: payload,
  });

  return data;
};
