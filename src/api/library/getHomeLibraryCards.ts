import { mapStrapiLibrariesResponseToCards } from '@utils/library/mapStrapiLibraries';

import type {
  HomeLibraryCardView,
  StrapiLibrariesResponse,
} from '@local-types/library/library';

import { LIBRARY_CARD_POPULATE } from '@api/library/libraryCardPopulate';

/**
 * Server-side twin of getLibrariesPaginated for getStaticProps: plain fetch,
 * no cookie interceptor, no browser globals. Same anonymous query the browser
 * sends, so the static HTML already carries the cards a visitor would
 * otherwise wait a Strapi round trip for. Returns null on any failure so the
 * page falls back to the client fetch instead of failing the build.
 */
export async function getHomeLibraryCards(): Promise<
  HomeLibraryCardView[] | null
> {
  const apiBase = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI;
  const mediaBase = process.env.NEXT_PUBLIC_STRAPI;
  if (!apiBase) {
    return null;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(LIBRARY_CARD_POPULATE)) {
    params.set(key, String(value));
  }
  params.set('pagination[page]', '1');
  params.set('pagination[pageSize]', '100');

  try {
    const response = await fetch(
      `${apiBase.replace(/\/$/, '')}/api/libraries?${params.toString()}`,
      { headers: { Accept: 'application/json' } },
    );
    if (!response.ok) {
      console.error('library.home.static', response.status);
      return null;
    }
    const data = (await response.json()) as StrapiLibrariesResponse;
    const cards = mapStrapiLibrariesResponseToCards(data, mediaBase);
    // getStaticProps rejects undefined values; the JSON round trip drops
    // those keys the same way the client fetch never had them.
    return JSON.parse(JSON.stringify(cards)) as HomeLibraryCardView[];
  } catch (error) {
    console.error('library.home.static', error);
    return null;
  }
}
