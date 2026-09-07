import axios from 'axios';

import type {
  StrapiLibrariesResponse,
  StrapiSingleLibraryResponse,
} from '@local-types/library/library';

import { librarySeo } from '@lib/library/seo';

/** Crawler data is always fetched anonymously, including on owner requests. */
export async function getPublicLibrarySeo(username: string) {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_STRAPI,
    timeout: 5000,
  });
  let page = 1;
  let pageCount = 1;
  do {
    const { data } = await client.get<StrapiLibrariesResponse>(
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
        username.toLowerCase(),
    );
    if (entry) {
      const response = await client.get<StrapiSingleLibraryResponse>(
        `/api/libraries/${entry.id}`,
        {
          params: {
            'populate[user]': true,
            'populate[libraryDetails]': true,
            'populate[singleShelves][populate][objects]': true,
          },
        },
      );
      return librarySeo(response.data.data);
    }
    pageCount = data.meta.pagination.pageCount;
    page++;
  } while (page <= pageCount);
  return librarySeo();
}
