import axiosInstance from '@/libraries/axios';

import type { ILibrary } from '@/types/library';
import type { IStrapiListResponse } from '@/types/strapi';

export const getMyLibrary = async (userId: number | string): Promise<ILibrary | null> => {
  try {
    const { data } = await axiosInstance.get<IStrapiListResponse<ILibrary>>('/api/libraries', {
      params: {
        'filters[user][id][$eq]': userId,
        'pagination[pageSize]': 1,
        'populate[avatar]': true,
        'populate[libraryDetails]': true,
      },
    });
    return data.data[0] ?? null;
  } catch (error) {
    console.error('getMyLibrary failed:', error);
    return null;
  }
};
