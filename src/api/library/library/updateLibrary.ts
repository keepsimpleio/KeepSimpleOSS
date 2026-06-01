import type {
  ILibrarySingleResponse,
  IUpdateLibraryPayload,
} from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

export const updateLibrary = async (
  id: number,
  payload: IUpdateLibraryPayload,
): Promise<ILibrarySingleResponse> => {
  const { data } = await axiosInstance.put<ILibrarySingleResponse>(
    `/api/libraries/${id}`,
    {
      data: payload,
    },
  );

  return data;
};
