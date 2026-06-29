import type { StrapiLibrariesResponse } from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

import { LIBRARY_CARD_POPULATE } from '@api/library/libraryCardPopulate';

export const getLibrariesPaginated = async (
  page = 1,
  pageSize = 8,
  query = '',
): Promise<StrapiLibrariesResponse | null> => {
  try {
    // Libraries are owner-scoped and shown as "<username>'s library", so search
    // the owner's username — the same relation filter `getLibraryIdByUsername`
    // uses for routing. `$containsi` = case-insensitive partial match. An `$or`
    // that also covered the raw `name` field silently returned no rows through
    // this controller, so keep to the single proven relation filter.
    const trimmed = query.trim();
    const filters = trimmed
      ? { 'filters[user][username][$containsi]': trimmed }
      : {};

    const { data } = await axiosInstance.get<StrapiLibrariesResponse>(
      '/api/libraries',
      {
        params: {
          ...LIBRARY_CARD_POPULATE,
          ...filters,
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
