import type { IReorderObjectEntry } from '@local-types/library/object';

import axiosInstance from '@lib/library/axios';

/**
 * The tag's own sequence: where its books stand when the library is filtered
 * down to this tag. It belongs to the tag, not to any shelf, so a book keeps a
 * different position in every tag that carries it. The CMS accepts this only
 * from the library's owner, and only when the list names every book the tag
 * carries.
 */
export const reorderTag = async (payload: {
  tagId: number;
  objects: IReorderObjectEntry[];
}) => {
  const { data } = await axiosInstance.post('/api/tags/reorder', payload);

  return data;
};
