import axiosInstance from '@/libraries/axios';

import type { IObjectSingleResponse, IUpdateObjectPayload } from '@/types/object';

export const updateObject = async (
  id: number,
  payload: IUpdateObjectPayload
): Promise<IObjectSingleResponse> => {
  // See createObject.ts — populate params on write endpoints trigger a
  // relation-permission 403 for the Authenticated role. Skip them here too.
  const { data } = await axiosInstance.put<IObjectSingleResponse>(`/api/objects/${id}`, {
    data: payload,
  });

  return data;
};
