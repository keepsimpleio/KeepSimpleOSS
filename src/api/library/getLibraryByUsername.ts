import type {
  StrapiLibrariesResponse,
  StrapiSingleLibraryResponse,
} from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

import { LIBRARY_POPULATE } from './getSingleLibrary';

/**
 * Fetch a library by its owner's username in one request.
 *
 * `/library/[username]` used to resolve the slug to a numeric id first and then
 * GET that id, so every visit paid two sequential round trips and held the
 * loader for both. The list endpoint accepts the same populate tree and returns
 * the identical entry (verified against `GET /api/libraries/:id`), so the
 * filtered read replaces the pair. Shaped like the single-library response so
 * callers stay unchanged.
 */
export const getLibraryByUsername = async (
  username: string,
): Promise<StrapiSingleLibraryResponse | null> => {
  try {
    const { data } = await axiosInstance.get<StrapiLibrariesResponse>(
      '/api/libraries',
      {
        params: {
          'filters[user][username][$eqi]': username,
          'pagination[pageSize]': 1,
          ...LIBRARY_POPULATE,
        },
      },
    );

    const entry = data.data?.[0];
    return entry ? { data: entry } : null;
  } catch (e) {
    console.error('getLibraryByUsername failed:', e);

    return null;
  }
};
