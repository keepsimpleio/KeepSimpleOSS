import type {
  IShelfSingleResponse,
  IUpdateShelfPayload,
} from '@local-types/library/shelf';

import axiosInstance from '@lib/library/axios';

export const updateShelf = async (
  id: number,
  payload: IUpdateShelfPayload,
): Promise<IShelfSingleResponse> => {
  const { data } = await axiosInstance.put<IShelfSingleResponse>(
    `/api/single-shelves/${id}`,
    {
      data: payload,
    },
  );

  return data;
};
