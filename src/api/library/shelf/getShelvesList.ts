import axiosInstance from '@/libraries/axios';

import type { ObjectType } from '@/types/object';
import type { IShelf } from '@/types/shelf';
import type { IStrapiListResponse } from '@/types/strapi';

export type IShelvesListResponse = IStrapiListResponse<IShelf>;

export const getShelvesList = async (
  filterType?: ObjectType
): Promise<IShelvesListResponse | null> => {
  try {
    const params = filterType
      ? { 'filters[type][$eq]': filterType, sort: 'order:asc' }
      : { sort: 'order:asc' };
    const { data } = await axiosInstance.get<IShelvesListResponse>('/api/single-shelves', {
      params,
    });
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
