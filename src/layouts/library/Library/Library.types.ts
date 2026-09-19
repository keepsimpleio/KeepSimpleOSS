import type { StrapiLibraryEntry } from '@local-types/library/library';

export interface LibraryTemplateProps {
  libraryId: string;
  /**
   * Leave the owner's share-selection bar out. The share-link recipient page
   * renders its own read-only bar in the same fixed slot, and an owner opening
   * their own link would otherwise get one buried under the other.
   */
  hideSharePanel?: boolean;
  /**
   * The library as the server read it for this request, anonymously. The page
   * used to leave the browser with a shell and fetch every word after load,
   * which is a page with nothing in it for a reader that runs no scripts.
   * Seeded here, the first paint already holds the shelves; the browser still
   * re-reads in the background, silently, so an owner's own view (private
   * shelves included) arrives without the shelves ever blinking out.
   */
  initialLibrary?: StrapiLibraryEntry | null;
}
