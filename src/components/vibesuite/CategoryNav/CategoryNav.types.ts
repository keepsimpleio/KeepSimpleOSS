import { UserProgress } from '@local-types/pageTypes/vibesuite';

export type CategoryNavProps = {
  progress: UserProgress;
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onOpenRecommendations: () => void;
  onOpenWhyModal: () => void;
  allCompleted: boolean;
};
