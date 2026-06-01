import type { HomeLibraryCardView } from '@/types/library';

export interface HomeTemplateProps {
  /** When set, skips API fetch (e.g. Storybook). */
  data?: HomeLibraryCardView[];
}
