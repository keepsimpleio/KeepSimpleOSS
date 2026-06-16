import type { HomeLibraryCardView } from '@local-types/library/library';

export interface HomeTemplateProps {
  /** When set, skips API fetch (e.g. Storybook). */
  data?: HomeLibraryCardView[];
}
