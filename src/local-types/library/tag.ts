export interface ITagAttributes {
  name: string;
  description: string;
  color: string;
  slug: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ITag {
  id: number;
  attributes: ITagAttributes;
}

// Subset returned when tags are populated as a relation on another entity.
export interface ITagRef {
  id: number;
  attributes: Pick<ITagAttributes, 'name' | 'color'>;
}

/**
 * A tag as the library page reads it: `GET /api/tags?libraryId=N` answers with
 * the tags one library offers as filters, each carrying its own sequence of
 * book ids. A visitor is answered with only the tags labelling a book they can
 * open, and only the ids of those books.
 */
export interface LibraryTag {
  id: number;
  name: string;
  color: string;
  description?: string;
  slug: string;
  /** Book ids this tag carries, in the tag's own order. */
  objects: number[];
}
