import { Recommendation } from '@local-types/pageTypes/vibesuite';

export type RecommendationModalProps = {
  recommendations: Recommendation[];
  onSelectSkill: (skillId: string) => void;
  onClose: () => void;
};
