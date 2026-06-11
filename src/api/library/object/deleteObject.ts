import type { IObjectSingleResponse } from '@local-types/library/object';

import axiosInstance from '@lib/library/axios';

export const deleteObject = async (
  id: number,
): Promise<IObjectSingleResponse> => {
  const { data } = await axiosInstance.delete<IObjectSingleResponse>(
    `/api/objects/${id}`,
  );

  return data;
};
