import axiosInstance from '@/libraries/axios';

import type { StrapiLibrariesResponse, StrapiSingleLibraryResponse } from '@/types/library';
import type { IUser } from '@/types/user';

export const getUserInfo = async (): Promise<IUser | null> => {
  try {
    const { data } = await axiosInstance.get<IUser>('/api/users/me');

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};

// Populate the relations the home/sidebar library cards need: avatar (image),
// user (for the `/library/[username]` URL), and shelves + their objects (so the
// per-type counts reflect object totals, not shelf totals).
const LIBRARY_CARD_POPULATE = {
  'populate[avatar]': true,
  'populate[user]': true,
  'populate[singleShelves][populate][objects]': true,
} as const;

export const getLibrariesList = async <T = unknown>(): Promise<T | null> => {
  try {
    const { data } = await axiosInstance.get<T>('/api/libraries', {
      params: LIBRARY_CARD_POPULATE,
    });

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};

export const getLibrariesPaginated = async (
  page = 1,
  pageSize = 8
): Promise<StrapiLibrariesResponse | null> => {
  try {
    const { data } = await axiosInstance.get<StrapiLibrariesResponse>('/api/libraries', {
      params: {
        ...LIBRARY_CARD_POPULATE,
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      },
    });

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};

export const getSingleLibrary = async (
  id: number | string
): Promise<StrapiSingleLibraryResponse | null> => {
  try {
    const { data } = await axiosInstance.get<StrapiSingleLibraryResponse>(`/api/libraries/${id}`, {
      params: {
        'populate[avatar]': true,
        'populate[libraryDetails]': true,
        'populate[singleShelves][populate][objects][populate][coverImage]': true,
        'populate[singleShelves][populate][objects][populate][tags]': true,
      },
    });

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};

export const getShelves = async <T = unknown>(): Promise<T | null> => {
  try {
    const { data } = await axiosInstance.get<T>('/api/single-shelves');

    return data ?? null;
  } catch (e) {
    console.error(e);

    return null;
  }
};
