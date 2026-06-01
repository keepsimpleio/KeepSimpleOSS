import type {
  IUpdateMePayload,
  IUpdateMeResponse,
} from '@local-types/library/user';

import axiosInstance from '@lib/library/axios';

export const updateMe = async (
  payload: IUpdateMePayload,
): Promise<IUpdateMeResponse> => {
  // Note the singular `user` — see docs/user-api.md §1.
  const { data } = await axiosInstance.put<IUpdateMeResponse>(
    '/api/user/me',
    payload,
  );
  return data;
};
