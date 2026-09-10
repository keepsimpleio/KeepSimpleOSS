import { getPublicLibraryView } from './getPublicLibraryView';

/**
 * Crawler data is always fetched anonymously, including on owner requests.
 *
 * One read stands behind this and behind the page's own first paint: see
 * `getPublicLibraryView`. Kept as its own name because the share thumbnail
 * wants the metadata and nothing else.
 */
export async function getPublicLibrarySeo(username: string) {
  return (await getPublicLibraryView(username)).seo;
}
