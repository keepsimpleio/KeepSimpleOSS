import axiosInstance from '@/libraries/axios';

import { ITag } from '@/types/tag';

export interface GetTagsListResponse {
  data: ITag[];
}

export const getTagsList = async (): Promise<GetTagsListResponse> => {
  try {
    // The axios interceptor reads `accessToken` from document.cookie, which
    // doesn't exist during SSR. When called from a Server Component, pull the
    // token from the request cookies and attach it explicitly.
    const headers: Record<string, string> = {};
    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers');
      const token = (await cookies()).get('accessToken')?.value;
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const { data } = await axiosInstance.get<GetTagsListResponse>('/api/tags', { headers });

    return data;
  } catch (error) {
    console.error(error);

    return { data: [] };
  }
};
