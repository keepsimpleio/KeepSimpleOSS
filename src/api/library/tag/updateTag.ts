import axiosInstance from '@lib/library/axios';

export interface UpdateTagRequest {
  name: string;
  slug: string;
  user: string;
  color: string;
  description?: string;
}

export const updateTag = async (
  tagId: number | string,
  tagData: UpdateTagRequest,
) => {
  const { data } = await axiosInstance.put(`/api/tags/${tagId}`, {
    data: tagData,
  });

  return data;
};
