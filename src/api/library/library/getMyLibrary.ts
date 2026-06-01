import type { ILibrary } from '@local-types/library/library';
import type { IStrapiListResponse } from '@local-types/library/strapi';

import axiosInstance from '@lib/library/axios';

export const getMyLibrary = async (
  userId: number | string,
): Promise<ILibrary | null> => {
  try {
    const { data } = await axiosInstance.get<IStrapiListResponse<ILibrary>>(
      '/api/libraries',
      {
        params: {
          'filters[user][id][$eq]': userId,
          'pagination[pageSize]': 1,
          'populate[avatar]': true,
          'populate[libraryDetails]': true,
        },
      },
    );
    return data.data[0] ?? null;
  } catch (error) {
    console.error('getMyLibrary failed:', error);
    return null;
  }
};
