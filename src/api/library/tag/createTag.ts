import { ITag } from '@local-types/library/tag';

import axiosInstance from '@lib/library/axios';

export interface CreateTagRequest {
  name: string;
  slug: string;
  user: string;
  color: string;
  description?: string;
}

export interface CreateTagResponse {
  data: ITag;
  meta: Record<string, unknown>;
}

export const createTag = async (
  tagData: CreateTagRequest,
): Promise<CreateTagResponse> => {
  // The tag content-type has draftAndPublish enabled, so a plain POST creates
  // an unpublished draft: it comes back in this response (and shows in the UI)
  // but the default GET /api/tags only returns published entries, so it
  // vanishes on refresh. Stamp publishedAt to publish it immediately.
  const { data } = await axiosInstance.post<CreateTagResponse>('/api/tags', {
    data: { ...tagData, publishedAt: new Date().toISOString() },
  });

  return data;
};
