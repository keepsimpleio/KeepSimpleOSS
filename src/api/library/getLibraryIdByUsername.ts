import axios from 'axios';

import type { StrapiLibrariesResponse } from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

import { LibraryLoadError } from './getSingleLibrary';

// Resolve a `/library/[username]` slug to a numeric library id. Returns null
// when the username has no library; throws LibraryLoadError when the lookup
// itself failed, so a dead backend is never mistaken for "no library yet".
export const getLibraryIdByUsername = async (
  username: string,
): Promise<number | null> => {
  try {
    const normalized = username.trim().toLowerCase();
    if (!normalized) return null;

    // The CMS rejects user-relation filters for guests before its controller
    // can resolve them. Read the public directory, whose owner usernames are
    // already allowlisted, without requiring access to user accounts.
    let page = 1;
    let pageCount = 1;
    do {
      const { data } = await axiosInstance.get<StrapiLibrariesResponse>(
        '/api/libraries',
        {
          params: {
            'pagination[page]': page,
            'pagination[pageSize]': 100,
            'sort[0]': 'id:asc',
          },
        },
      );
      const entry = data.data.find(
        library =>
          library.attributes.user?.data?.attributes.username?.toLowerCase() ===
          normalized,
      );
      if (entry) return entry.id;
      pageCount = data.meta.pagination.pageCount;
      page += 1;
    } while (page <= pageCount);
    return null;
  } catch (error) {
    console.error('getLibraryIdByUsername failed:', error);
    throw new LibraryLoadError(
      'Could not load this library.',
      axios.isAxiosError(error) ? error.response?.status : undefined,
    );
  }
};
