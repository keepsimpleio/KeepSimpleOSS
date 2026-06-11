import axiosInstance from '@lib/library/axios';

// Backend cascades — deletes every object on the shelf too. See docs/shelf-api.md.
export const deleteShelf = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/single-shelves/${id}`);
};
