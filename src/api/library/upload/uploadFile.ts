import type { IUploadedFile } from '@local-types/library/media';

import axiosInstance from '@lib/library/axios';

export const uploadFile = async (file: File): Promise<IUploadedFile> => {
  const formData = new FormData();
  formData.append('files', file);

  const { data } = await axiosInstance.post<IUploadedFile[]>(
    '/api/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return data[0];
};
