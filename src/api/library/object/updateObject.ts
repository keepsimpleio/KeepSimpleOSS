import type {
  IObjectSingleResponse,
  IUpdateObjectPayload,
} from '@local-types/library/object';

import axiosInstance from '@lib/library/axios';

export const updateObject = async (
  id: number,
  payload: IUpdateObjectPayload,
): Promise<IObjectSingleResponse> => {
  // See createObject.ts — populate params on write endpoints trigger a
  // relation-permission 403 for the Authenticated role. Skip them here too.
  const { data } = await axiosInstance.put<IObjectSingleResponse>(
    `/api/objects/${id}`,
    {
      data: payload,
    },
  );

  if (
    payload.favorite !== undefined &&
    data.data?.attributes.favorite !== payload.favorite
  ) {
    throw new Error('The server did not save the favorite setting.');
  }

  return data;
};
