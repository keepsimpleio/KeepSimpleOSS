import {
  Skill,
  SkillCategory,
  UserProgress,
} from '@local-types/pageTypes/vibesuite';

export type SkillDetailPanelProps = {
  skill: Skill;
  category: SkillCategory;
  progress: UserProgress;
  onToggle: (skillId: string, completed: boolean) => void;
  onClose: () => void;
  onSelectSkill: (skillId: string) => void;
  prevSkillId: string | null;
  nextSkillId: string | null;
  requestClose?: boolean;
};
