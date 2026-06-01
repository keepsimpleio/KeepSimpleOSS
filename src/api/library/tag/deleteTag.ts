import axiosInstance from '@/libraries/axios';

export const deleteTag = async (tagId: number | string) => {
  const { data } = await axiosInstance.delete(`/api/tags/${tagId}`);

  return data;
};
