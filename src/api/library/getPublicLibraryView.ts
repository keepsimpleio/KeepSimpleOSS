import axios from 'axios';

import type {
  StrapiLibrariesResponse,
  StrapiLibraryEntry,
  StrapiSingleLibraryResponse,
} from '@local-types/library/library';
import type { IObject } from '@local-types/library/object';
import type { LibraryTag } from '@local-types/library/tag';

import { librarySeo } from '@lib/library/seo';

/**
 * The library as a reader arrives at it, read on the server.
 *
 * A library used to reach the browser as a shell: the title, the description
 * and the schema.org list were in the first response, and every word a person
 * (or a crawler that does not run scripts) could actually read was fetched
 * afterwards by script. This is the same read the page makes, made once, on
 * the request, so the shelves, the books and the About text are in the HTML
 * that leaves the server.
 *
 * Always anonymous, including on an owner's own request: what the server
 * paints is what a visitor sees, and the owner's own view arrives a moment
 * later from their own session. A private shelf therefore never reaches the
 * page source.
 */

export interface PublicLibraryView {
  seo: ReturnType<typeof librarySeo>;
  /** The library trimmed to what the first paint draws, or null. */
  library: StrapiLibraryEntry | null;
  /** The library's tags, as the right panel lists them. */
  tags: LibraryTag[];
}

const client = () =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_STRAPI,
    timeout: 5000,
  });

const listPopulate = {
  'populate[avatar]': true,
  'populate[user]': true,
  'populate[libraryDetails]': true,
  'populate[singleShelves][populate][objects][populate][coverImage]': true,
  'populate[singleShelves][populate][objects][populate][tags]': true,
  'populate[singleShelves][sort][0]': 'order:asc',
  'populate[singleShelves][populate][objects][sort][0]': 'order:asc',
};

/**
 * A cover carries every rendition Strapi cut for it, which is six sizes of
 * metadata the page never reads: the card asks for `url` and nothing else.
 * Dropping the rest keeps a 165-book library from shipping a third of a
 * megabyte of image bookkeeping in the page source.
 */
const trimCover = (cover: IObject['attributes']['coverImage']) => {
  const media = cover?.data;

  if (!media) return cover ?? { data: null };

  const { url, name, mime, size } = media.attributes;

  return { data: { id: media.id, attributes: { url, name, mime, size } } };
};

/**
 * Notes are the longest thing a library holds and the shelves do not draw
 * them: a note is read on the book's own page, which is where it is written
 * into the HTML in full. The one book the URL names keeps its note here so
 * that page is complete on arrival.
 */
const trimObject = (object: IObject, keepNoteFor: number | null): IObject => {
  // The key is dropped rather than emptied: Next refuses to serialize an
  // `undefined` into the page's own data, and an empty string would read as a
  // note the owner had cleared.
  const { description, ...attributes } = object.attributes;

  return {
    ...object,
    attributes: {
      ...attributes,
      ...(object.id === keepNoteFor && description !== undefined
        ? { description }
        : {}),
      coverImage: trimCover(object.attributes.coverImage),
    },
  };
};

const forFirstPaint = (
  entry: StrapiLibraryEntry,
  keepNoteFor: number | null,
): StrapiLibraryEntry => ({
  ...entry,
  attributes: {
    ...entry.attributes,
    singleShelves: {
      data: (entry.attributes.singleShelves?.data ?? [])
        // A visitor's reading of the shelf list, decided here rather than in
        // the components: a private shelf must not travel to the browser at
        // all, drawn or not.
        .filter(shelf => shelf.attributes.visibility !== 'private')
        .map(shelf => ({
          ...shelf,
          attributes: {
            ...shelf.attributes,
            objects: {
              data: (shelf.attributes.objects?.data ?? []).map(object =>
                trimObject(object, keepNoteFor),
              ),
            },
          },
        })),
    },
  },
});

/** The numeric id of the library a username owns, or null. */
const findLibraryId = async (username: string): Promise<number | null> => {
  const wanted = username.trim().toLowerCase();

  if (!wanted) return null;

  let page = 1;
  let pageCount = 1;

  do {
    const { data } = await client().get<StrapiLibrariesResponse>(
      '/api/libraries',
      {
        params: {
          'pagination[page]': page,
          'pagination[pageSize]': 100,
          'sort[0]': 'id:asc',
        },
      },
    );

    const entry = data.data.find(
      item =>
        item.attributes.user?.data?.attributes.username?.toLowerCase() ===
        wanted,
    );

    if (entry) return entry.id;

    pageCount = data.meta.pagination.pageCount;
    page += 1;
  } while (page <= pageCount);

  return null;
};

export async function getPublicLibraryView(
  username: string,
  /** The object the URL names, so its note travels with the first paint. */
  keepNoteFor: number | null = null,
): Promise<PublicLibraryView> {
  const id = await findLibraryId(username);

  if (id == null) return { seo: librarySeo(), library: null, tags: [] };

  const { data } = await client().get<StrapiSingleLibraryResponse>(
    `/api/libraries/${id}`,
    { params: listPopulate },
  );

  const entry = data.data;

  if (!entry) return { seo: librarySeo(), library: null, tags: [] };

  const seo = librarySeo(entry);
  const library = forFirstPaint(entry, keepNoteFor);

  let tags: LibraryTag[] = [];

  try {
    const answer = await client().get<{
      data: {
        id: number;
        attributes: {
          name: string;
          color: string;
          description?: string;
          slug: string;
          objects?: number[];
        };
      }[];
    }>('/api/tags', { params: { libraryId: id } });

    tags = (answer.data?.data ?? []).map(tag => ({
      id: tag.id,
      name: tag.attributes.name,
      color: tag.attributes.color,
      // Omitted rather than undefined: the page's own data is JSON.
      ...(tag.attributes.description
        ? { description: tag.attributes.description }
        : {}),
      slug: tag.attributes.slug,
      objects: tag.attributes.objects ?? [],
    }));
  } catch {
    // The shelves stand without the filter panel; the browser re-reads it.
    console.error('Library tags unavailable');
  }

  return { seo, library, tags };
}
