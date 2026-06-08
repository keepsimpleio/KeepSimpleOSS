import type { IReorderShelvesPayload } from '@local-types/library/shelf';

import axiosInstance from '@lib/library/axios';

// Unlike create/update, the reorder endpoint expects a RAW body that is a bare
// array (no `{ data }` wrapper): `[{ id, order }]`. Backend default-sorts
// shelves by `order` ASC on subsequent reads.
export const reorderShelves = async (
  payload: IReorderShelvesPayload,
): Promise<void> => {
  await axiosInstance.post('/api/single-shelves/reorder', payload);
};
