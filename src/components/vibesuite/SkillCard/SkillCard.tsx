import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { TRouter } from '@local-types/global';

import vibesuiteIntl from '@data/vibesuite/intl';

import { SkillCardProps } from './SkillCard.types';

import styles from './SkillCard.module.scss';

// Map first letter to katakana
const KATAKANA_MAP: Record<string, string> = {
  a: 'ア',
  b: 'ビ',
  c: 'ク',
  d: 'デ',
  e: 'エ',
  f: 'フ',
  g: 'グ',
  h: 'ハ',
  i: 'イ',
  j: 'ジ',
  k: 'カ',
  l: 'ル',
  m: 'マ',
  n: 'ナ',
  o: 'オ',
  p: 'プ',
  q: 'ク',
  r: 'ラ',
  s: 'サ',
  t: 'タ',
  u: 'ウ',
  v: 'ヴ',
  w: 'ワ',
  x: 'シ',
  y: 'ヤ',
  z: 'ズ',
};

function getKatakana(name: string): string {
  const first = name.charAt(0).toLowerCase();
  return KATAKANA_MAP[first] || 'ス';
}

export default function SkillCard({
  skill,
  category,
  completed,
  selected,
  onClick,
}: SkillCardProps) {
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale];
  const difficultyLabels: Record<string, string> = {
    beginner: t.difficultyBeginner,
    intermediate: t.difficultyIntermediate,
    advanced: t.difficultyAdvanced,
  };
  const katakana = getKatakana(skill.name);
  const highlighted = completed || selected;
  const [showTip, setShowTip] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(styles.card, { [styles.highlighted]: highlighted })}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      {/* Custom tooltip */}
      <div className={cn(styles.tooltip, { [styles.tooltipVisible]: showTip })}>
        {skill.projectTitle}
      </div>

      {/* Katakana — top-center, in flow */}
      <span
        className={cn(styles.katakana, {
          [styles.katakanaCompleted]: completed,
        })}
        aria-hidden="true"
      >
        {katakana}
      </span>

      {/* Learned indicator — accent bar at top */}
      {completed && <div className={styles.completedBar} />}

      {/* Checkmark when learned */}
      {completed && <span className={styles.checkmark}>✓</span>}

      {/* Skill name */}
      <p
        className={cn(styles.skillName, {
          [styles.skillNameCompleted]: completed,
        })}
      >
        {skill.name}
      </p>

      {/* Difficulty */}
      <p className={styles.difficulty}>
        {difficultyLabels[skill.difficulty] || skill.difficulty}
      </p>
    </button>
  );
}
