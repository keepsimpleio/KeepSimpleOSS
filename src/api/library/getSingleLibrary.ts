import axios from 'axios';

import type { StrapiSingleLibraryResponse } from '@local-types/library/library';

import axiosInstance from '@lib/library/axios';

// Thrown when the library could not be loaded at all (network, 5xx, 401/403).
// A 404 is not an error: it is the normal "no such library" answer and resolves
// to null, so the page can tell "empty" from "unreachable".
export class LibraryLoadError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'LibraryLoadError';
    this.status = status;
  }
}

export const isNotFoundError = (e: unknown): boolean =>
  axios.isAxiosError(e) && e.response?.status === 404;

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
    if (isNotFoundError(e)) return null;
    console.error('getSingleLibrary failed:', e);
    throw new LibraryLoadError(
      'Could not load this library.',
      axios.isAxiosError(e) ? e.response?.status : undefined,
    );
  }
};
