import type { StrapiLibrariesResponse } from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

import { LIBRARY_CARD_POPULATE } from '@api/library/libraryCardPopulate';

export const getLibrariesPaginated = async (
  page = 1,
  pageSize = 8,
): Promise<StrapiLibrariesResponse | null> => {
  try {
    const { data } = await axiosInstance.get<StrapiLibrariesResponse>(
      '/api/libraries',
      {
        params: {
          ...LIBRARY_CARD_POPULATE,
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      },
    );

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};
