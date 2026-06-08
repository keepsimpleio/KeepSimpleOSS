import type { StrapiSingleLibraryResponse } from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

export const getSingleLibrary = async (
  id: number | string,
): Promise<StrapiSingleLibraryResponse | null> => {
  try {
    const { data } = await axiosInstance.get<StrapiSingleLibraryResponse>(
      `/api/libraries/${id}`,
      {
        params: {
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
        },
      },
    );

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};
