import { Skill, SkillCategory } from '@local-types/pageTypes/vibesuite';

import { categoriesRu, skillsRu } from './intl/skills.ru';

export function localizeSkill(skill: Skill, locale: string): Skill {
  if (locale !== 'ru') return skill;
  const ru = skillsRu[skill.id];
  if (!ru) return skill;
  return { ...skill, ...ru };
}

export function localizeCategory(
  cat: SkillCategory,
  locale: string,
): SkillCategory {
  const skills = cat.skills.map(s => localizeSkill(s, locale));
  if (locale !== 'ru') return { ...cat, skills };
  const ru = categoriesRu[cat.id];
  if (!ru) return { ...cat, skills };
  return { ...cat, ...ru, skills };
}
