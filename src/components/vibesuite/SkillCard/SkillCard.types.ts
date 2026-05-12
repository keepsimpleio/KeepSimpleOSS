import { Skill, SkillCategory } from '@local-types/pageTypes/vibesuite';

export type SkillCardProps = {
  skill: Skill;
  category: SkillCategory;
  completed: boolean;
  selected: boolean;
  onClick: () => void;
};
