import axiosInstance from '@lib/library/axios';

import { LIBRARY_CARD_POPULATE } from '@api/library/libraryCardPopulate';

export const getLibrariesList = async <T = unknown>(): Promise<T | null> => {
  try {
    const { data } = await axiosInstance.get<T>('/api/libraries', {
      params: LIBRARY_CARD_POPULATE,
    });

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};
