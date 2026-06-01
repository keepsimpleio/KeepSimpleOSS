import axiosInstance from '@/libraries/axios';

// Bootstrap a published library for the given user. Returns the new library id,
// or null on failure.
export const createLibrary = async (userId: number | string): Promise<number | null> => {
  try {
    const { data } = await axiosInstance.post<{ data: { id: number } }>('/api/libraries', {
      data: {
        user: userId,
        publishedAt: new Date().toISOString(),
      },
    });
    return data?.data?.id ?? null;
  } catch (error) {
    console.error('createLibrary failed:', error);
    return null;
  }
};
