import type { HomeLibraryCardView } from '@local-types/library/library';

export interface HomeTemplateProps {
  /** When set, skips API fetch (e.g. Storybook). */
  data?: HomeLibraryCardView[];
  /**
   * Cards rendered into the static HTML by getStaticProps. Anonymous visitors
   * show these without a client fetch; a signed-in account still refetches so
   * the grid reflects what that account may see.
   */
  initialItems?: HomeLibraryCardView[] | null;
}
