import axiosInstance from '@/libraries/axios';

import type { IObjectSingleResponse } from '@/types/object';

export const deleteObject = async (id: number): Promise<IObjectSingleResponse> => {
  const { data } = await axiosInstance.delete<IObjectSingleResponse>(`/api/objects/${id}`);

  return data;
};
