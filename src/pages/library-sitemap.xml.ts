import axios from 'axios';
import type { GetServerSideProps } from 'next';

import type { StrapiLibrariesResponse } from '@local-types/library/library';

import { libraryPath } from '@lib/library/libraryPath';
import { objectSlug } from '@lib/library/objectSlug';

/**
 * The libraries, and every page inside them, offered to search.
 *
 * The site's own sitemap is written by Strapi's plugin, which knows the
 * content types it was configured for and nothing about a library: on
 * 2026-09-10 not one library URL was in it, so the whole surface, one library
 * page and 165 book pages for Wolf alone, was left for a crawler to find by
 * following links. This is that surface, listed.
 *
 * Public only, and public in the same sense the pages are: a private shelf is
 * left out, and so is everything standing on it.
 */

const ORIGIN = 'https://keepsimple.io';

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const entry = (loc: string, lastmod?: string) =>
  `<url><loc>${escape(loc)}</loc>${
    lastmod ? `<lastmod>${escape(lastmod)}</lastmod>` : ''
  }</url>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls: string[] = [entry(`${ORIGIN}/library`)];

  try {
    const client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_STRAPI,
      timeout: 8000,
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
            'populate[user]': true,
            'populate[singleShelves][fields][0]': 'visibility',
            'populate[singleShelves][populate][objects][fields][0]': 'title',
            'populate[singleShelves][populate][objects][fields][1]':
              'updatedAt',
          },
        },
      );

      for (const library of data.data) {
        const username = library.attributes.user?.data?.attributes.username;

        if (!username) continue;

        const path = libraryPath(username);
        const shelves = (library.attributes.singleShelves?.data ?? []).filter(
          shelf => shelf.attributes.visibility !== 'private',
        );

        urls.push(entry(`${ORIGIN}${path}`, library.attributes.updatedAt));

        for (const shelf of shelves) {
          for (const object of shelf.attributes.objects?.data ?? []) {
            urls.push(
              entry(
                `${ORIGIN}${path}/${objectSlug(object)}`,
                object.attributes.updatedAt,
              ),
            );
          }
        }
      }

      pageCount = data.meta.pagination.pageCount;
      page += 1;
    } while (page <= pageCount);
  } catch {
    // A reachable sitemap holding the library index beats a 500: a crawler
    // reads the failure as the whole surface being gone.
    console.error('Library sitemap could not read the libraries');
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // Read by machines on their own schedule; an hour old is current enough and
  // keeps a crawl from re-reading every library on every hit.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  res.write(body);
  res.end();

  return { props: {} };
};

const LibrarySitemap = () => null;

export default LibrarySitemap;
