import type { StrapiSingleLibraryResponse } from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

/**
 * Everything a library page renders: the owner panel, the shelves, and each
 * object with its cover and tags. Shared with `getLibraryByUsername` so both
 * entry points return the same tree.
 */
export const LIBRARY_POPULATE = {
  'populate[avatar]': true,
  'populate[user]': true,
  'populate[libraryDetails]': true,
  'populate[singleShelves][populate][objects][populate][coverImage]': true,
  'populate[singleShelves][populate][objects][populate][tags]': true,
  // The schema's `config.list.defaultSortBy` only sorts the admin
  // content-manager — the public REST API defaults to id order. Sort
  // the populated relations explicitly so persisted `order` is honored
  // (the client also sorts as a fallback for older Strapi populate).
  'populate[singleShelves][sort][0]': 'order:asc',
  'populate[singleShelves][populate][objects][sort][0]': 'order:asc',
};

export const getSingleLibrary = async (
  id: number | string,
): Promise<StrapiSingleLibraryResponse | null> => {
  try {
    const { data } = await axiosInstance.get<StrapiSingleLibraryResponse>(
      `/api/libraries/${id}`,
      { params: { ...LIBRARY_POPULATE } },
    );

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};
