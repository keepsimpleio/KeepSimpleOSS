import type { IReorderObjectsPayload } from '@local-types/library/object';

import axiosInstance from '@lib/library/axios';

// Unlike create/update, the reorder endpoint expects a RAW body (no `{ data }`
// wrapper): `{ shelfId, objects: [{ id, order }] }`. Backend default-sorts
// objects by `order` ASC on subsequent reads.
export const reorderObjects = async (
  payload: IReorderObjectsPayload,
): Promise<void> => {
  await axiosInstance.post('/api/objects/reorder', payload);
};
