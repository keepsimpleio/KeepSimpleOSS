import axiosInstance from '@/libraries/axios';

import type { ILibrarySingleResponse, IUpdateLibraryPayload } from '@/types/library';

export const updateLibrary = async (
  id: number,
  payload: IUpdateLibraryPayload
): Promise<ILibrarySingleResponse> => {
  const { data } = await axiosInstance.put<ILibrarySingleResponse>(`/api/libraries/${id}`, {
    data: payload,
  });

  return data;
};
