import type { StrapiLibrariesResponse } from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

// Resolve a `/library/[username]` slug to a numeric library id. Returns null
// when the username has no library (or the lookup fails).
export const getLibraryIdByUsername = async (
  username: string,
): Promise<number | null> => {
  try {
    const { data } = await axiosInstance.get<StrapiLibrariesResponse>(
      '/api/libraries',
      {
        params: {
          'filters[user][username][$eqi]': username,
          'pagination[pageSize]': 1,
        },
      },
    );
    return data.data?.[0]?.id ?? null;
  } catch (error) {
    console.error('getLibraryIdByUsername failed:', error);
    return null;
  }
};
