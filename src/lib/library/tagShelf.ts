import type { StrapiSingleShelfEntry } from '@local-types/library/library';
import type { IObject } from '@local-types/library/object';
import type { LibraryTag } from '@local-types/library/tag';

// The gathered shelf a tag filter draws is not a shelf the backend knows: it
// is every book the tag labels, taken off the shelves they stand on, in the
// tag's own order. It borrows the Shelf component with a synthetic entry, and
// this id is how the rest of the library tells that entry from a real one.
export const TAG_SHELF_ID = -2;

export interface GatheredTagShelf {
  shelf: StrapiSingleShelfEntry;
  /**
   * Books standing on a private shelf. Only their owner ever sees them here —
   * a visitor's sequence never names them — and they are marked, because in
   * this row nothing else says the shelf they came from is closed.
   */
  hiddenObjectIds: Set<number>;
}

/**
 * The tag's books, gathered off the shelves on screen. Order is the tag's own;
 * anything the viewer cannot open (a private shelf while previewing as a
 * guest, a book since deleted) is simply not there.
 */
export function gatherTagShelf(
  tag: LibraryTag,
  shelves: StrapiSingleShelfEntry[],
): GatheredTagShelf {
  const standing = new Map<number, { object: IObject; hidden: boolean }>();

  for (const shelf of shelves) {
    const hidden = shelf.attributes.visibility === 'private';
    for (const object of shelf.attributes.objects?.data ?? []) {
      standing.set(object.id, { object, hidden });
    }
  }

  const objects: IObject[] = [];
  const hiddenObjectIds = new Set<number>();

  for (const id of tag.objects) {
    const found = standing.get(id);
    if (!found) continue;
    objects.push(found.object);
    if (found.hidden) hiddenObjectIds.add(id);
  }

  return {
    shelf: {
      id: TAG_SHELF_ID,
      attributes: {
        name: tag.name,
        visibility: 'public',
        type: 'book',
        order: -2,
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
        objects: { data: objects },
      },
    },
    hiddenObjectIds,
  };
}

/**
 * The tag's whole sequence after a drag. The books on screen land in the order
 * they were dropped into, each taking one of the places they already occupied;
 * anything the viewer never saw keeps the position it had.
 */
export function applyDragToSequence(
  sequence: number[],
  draggedIds: number[],
): number[] {
  const dragged = new Set(draggedIds);
  let cursor = 0;
  const next = sequence.map(id =>
    dragged.has(id) ? draggedIds[cursor++] : id,
  );
  const held = new Set(next);

  return [...next, ...draggedIds.filter(id => !held.has(id))];
}
