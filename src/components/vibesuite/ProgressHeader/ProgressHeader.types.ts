import { UserProgress } from '@local-types/pageTypes/vibesuite';

export type ProgressHeaderProps = {
  progress: UserProgress;
  externalShowProgress?: boolean;
  onProgressShown?: () => void;
};
