import type { IObject } from '@local-types/library/object';

// The Favorites shelf is not a shelf the backend knows: it is every book the
// owner starred, gathered from the shelves that are on screen. It borrows the
// Shelf component with a synthetic entry, and this id is how the rest of the
// library tells that entry from a real one.
export const FAVORITES_SHELF_ID = -1;
export const FAVORITES_SHELF_NAME = 'Favorites';

/** Only books can be starred; the backend refuses the flag on anything else. */
export const canBeFavorite = (object: IObject): boolean =>
  object.attributes.type === 'book';

export const isFavorite = (object: IObject): boolean =>
  canBeFavorite(object) && object.attributes.favorite === true;

/**
 * Favorites in shelf order: books the owner has dragged into place first, by
 * that position, then the rest by when they were starred (newest last, so a
 * fresh star lands at the end of the row as an added book does). Stable, so
 * two books starred in the same second keep their relative order.
 */
export function sortFavorites(objects: IObject[]): IObject[] {
  return objects
    .map((object, index) => ({ object, index }))
    .sort((a, b) => {
      const ao = a.object.attributes.favoriteOrder;
      const bo = b.object.attributes.favoriteOrder;
      const aPlaced = ao != null;
      const bPlaced = bo != null;
      if (aPlaced && bPlaced && ao !== bo) return ao - bo;
      if (aPlaced !== bPlaced) return aPlaced ? -1 : 1;
      const at = Date.parse(a.object.attributes.favoritedAt ?? '') || 0;
      const bt = Date.parse(b.object.attributes.favoritedAt ?? '') || 0;
      if (at !== bt) return at - bt;
      return a.index - b.index;
    })
    .map(({ object }) => object);
}

/**
 * A saved object as the library tree should hold it. Until the backend
 * carries the favorite fields, a save's response comes back without them,
 * and taking it as-is would knock the book off the Favorites shelf on every
 * edit. Whatever the response does not say about favorites is kept from the
 * copy already on the shelf; once the fields are live the response wins.
 */
export function keepFavoriteFields(
  previous: IObject | undefined,
  updated: IObject,
): IObject {
  if (!previous) return updated;
  const next = updated.attributes;
  const prev = previous.attributes;
  if (next.favorite !== undefined) return updated;
  return {
    ...updated,
    attributes: {
      ...next,
      favorite: prev.favorite,
      favoritedAt: next.favoritedAt ?? prev.favoritedAt,
      favoriteOrder: next.favoriteOrder ?? prev.favoriteOrder,
    },
  };
}
