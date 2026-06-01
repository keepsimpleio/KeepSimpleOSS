import axiosInstance from '@lib/library/axios';

export interface CreateTagRequest {
  name: string;
  slug: string;
  user: string;
  color: string;
  description?: string;
}

export const createTag = async (tagData: CreateTagRequest) => {
  const { data } = await axiosInstance.post('/api/tags', { data: tagData });

  return data;
};
