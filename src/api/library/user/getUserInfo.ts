import type { IUser } from '@local-types/library/user';

import axiosInstance from '@lib/library/axios';

export const getUserInfo = async (): Promise<IUser | null> => {
  try {
    const { data } = await axiosInstance.get<IUser>('/api/users/me');

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};
