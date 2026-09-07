import type { IReorderFavoritesPayload } from '@local-types/library/object';

import axiosInstance from '@lib/library/axios';

// Same RAW body convention as `reorderObjects` (no `{ data }` wrapper), minus
// the shelf: favorites are gathered from every shelf of the library. Writes
// `favoriteOrder` on each listed object. Spec: docs/library-favorites-backend.md.
export const reorderFavorites = async (
  payload: IReorderFavoritesPayload,
): Promise<void> => {
  await axiosInstance.post('/api/objects/reorder-favorites', payload);
};
