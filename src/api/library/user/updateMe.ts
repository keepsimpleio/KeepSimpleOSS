import axiosInstance from '@/libraries/axios';

import type { IUpdateMePayload, IUpdateMeResponse } from '@/types/user';

export const updateMe = async (payload: IUpdateMePayload): Promise<IUpdateMeResponse> => {
  // Note the singular `user` — see docs/user-api.md §1.
  const { data } = await axiosInstance.put<IUpdateMeResponse>('/api/user/me', payload);
  return data;
};
