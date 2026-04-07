import { useState } from 'react';
import cn from 'classnames';

import { Skill, SkillCategory } from '@local-types/pageTypes/vibesuite';

import styles from './SkillCard.module.scss';

// Map first letter to katakana
const KATAKANA_MAP: Record<string, string> = {
  a: 'ア', b: 'ビ', c: 'ク', d: 'デ', e: 'エ', f: 'フ', g: 'グ', h: 'ハ',
  i: 'イ', j: 'ジ', k: 'カ', l: 'ル', m: 'マ', n: 'ナ', o: 'オ', p: 'プ',
  q: 'ク', r: 'ラ', s: 'サ', t: 'タ', u: 'ウ', v: 'ヴ', w: 'ワ', x: 'シ',
  y: 'ヤ', z: 'ズ',
};

function getKatakana(name: string): string {
  const first = name.charAt(0).toLowerCase();
  return KATAKANA_MAP[first] || 'ス';
}

interface SkillCardProps {
  skill: Skill;
  category: SkillCategory;
  completed: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function SkillCard({
  skill,
  category,
  completed,
  selected,
  onClick,
}: SkillCardProps) {
  const katakana = getKatakana(skill.name);
  const highlighted = completed || selected;
  const [showTip, setShowTip] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className={cn(styles.Card, { [styles.Highlighted]: highlighted })}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      {/* Custom tooltip */}
      <div className={cn(styles.Tooltip, { [styles.TooltipVisible]: showTip })}>
        {skill.projectTitle}
      </div>

      {/* Katakana — top-center, in flow */}
      <span
        className={cn(styles.Katakana, { [styles.KatakanaCompleted]: completed })}
        aria-hidden="true"
      >
        {katakana}
      </span>

      {/* Learned indicator — accent bar at top */}
      {completed && <div className={styles.CompletedBar} />}

      {/* Checkmark when learned */}
      {completed && <span className={styles.Checkmark}>✓</span>}

      {/* Skill name */}
      <p className={cn(styles.SkillName, { [styles.SkillNameCompleted]: completed })}>
        {skill.name}
      </p>

      {/* Difficulty */}
      <p className={styles.Difficulty}>{skill.difficulty}</p>
    </div>
  );
}
