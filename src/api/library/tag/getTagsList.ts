import { ITag } from '@local-types/library/tag';

import axiosInstance from '@lib/library/axios';

export interface GetTagsListResponse {
  data: ITag[];
}

// Tags are owner-scoped: each is stamped with `user` on create. The default
// GET /api/tags returns every account's tags, so always filter by the current
// user's id. Without an id there's nothing safe to return — refuse rather than
// fall back to the unscoped list, which would leak other accounts' tags.
export const getTagsList = async (
  userId?: number | string,
): Promise<GetTagsListResponse> => {
  if (userId == null || userId === '') {
    return { data: [] };
  }

  try {
    const { data } = await axiosInstance.get<GetTagsListResponse>('/api/tags', {
      params: { 'filters[user][id][$eq]': userId },
    });

    return data;
  } catch (error) {
    console.error(error);

    return { data: [] };
  }
};
