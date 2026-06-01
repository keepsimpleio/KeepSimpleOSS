import type { ObjectType } from '@local-types/library/object';
import type { IShelf } from '@local-types/library/shelf';
import type { IStrapiListResponse } from '@local-types/library/strapi';

import axiosInstance from '@lib/library/axios';

export type IShelvesListResponse = IStrapiListResponse<IShelf>;

export const getShelvesList = async (
  filterType?: ObjectType,
): Promise<IShelvesListResponse | null> => {
  try {
    const params = filterType
      ? { 'filters[type][$eq]': filterType, sort: 'order:asc' }
      : { sort: 'order:asc' };
    const { data } = await axiosInstance.get<IShelvesListResponse>(
      '/api/single-shelves',
      {
        params,
      },
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
