import { ITag } from '@local-types/library/tag';

import axiosInstance from '@lib/library/axios';

export interface GetTagsListResponse {
  data: ITag[];
}

export const getTagsList = async (): Promise<GetTagsListResponse> => {
  try {
    const { data } = await axiosInstance.get<GetTagsListResponse>('/api/tags');

    return data;
  } catch (error) {
    console.error(error);

    return { data: [] };
  }
};
