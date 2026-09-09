import type { LibraryTag } from '@local-types/library/tag';

import axiosInstance from '@lib/library/axios';

interface LibraryTagEntry {
  id: number;
  attributes: {
    name: string;
    color: string;
    description?: string;
    slug: string;
    objects?: number[];
  };
}

/**
 * The tags one library offers as filters, each with its own book sequence.
 * Anyone may ask: the CMS decides what the caller is allowed to see, answering
 * a visitor with only the tags that label a book on a public shelf. Never
 * filtered by account here — a tag belongs to a library, not to whoever looks.
 */
export const getLibraryTags = async (
  libraryId?: number | string | null,
): Promise<LibraryTag[]> => {
  if (libraryId == null || libraryId === '') return [];

  try {
    const { data } = await axiosInstance.get<{ data: LibraryTagEntry[] }>(
      '/api/tags',
      { params: { libraryId } },
    );

    return (data?.data ?? []).map(entry => ({
      id: entry.id,
      name: entry.attributes.name,
      color: entry.attributes.color,
      description: entry.attributes.description,
      slug: entry.attributes.slug,
      objects: entry.attributes.objects ?? [],
    }));
  } catch (error) {
    console.error('[Library] tags could not be loaded', error);

    return [];
  }
};
