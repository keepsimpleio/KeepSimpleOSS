import { useState, useEffect } from 'react';
import cn from 'classnames';

import { Recommendation } from '@local-types/pageTypes/vibesuite';
import { getCategoryBySkillId } from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';

import styles from './RecommendationModal.module.scss';

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

const difficultyColor: Record<string, string> = {
  beginner: '#6B8E6B',
  intermediate: '#B8960B',
  advanced: '#B83232',
};

interface RecommendationModalProps {
  recommendations: Recommendation[];
  onSelectSkill: (skillId: string) => void;
  onClose: () => void;
}

export default function RecommendationModal({
  recommendations,
  onSelectSkill,
  onClose,
}: RecommendationModalProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 180);
  };

  const handleSelect = (skillId: string) => {
    setClosing(true);
    setTimeout(() => onSelectSkill(skillId), 180);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(styles.Backdrop, { [styles.Closing]: closing })}
      onClick={handleClose}
    >
      <div
        className={cn(
          styles.Modal,
          closing ? 'animate-modal-out' : 'animate-modal-in',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.Header}>
          <span className={styles.Title}>What to learn next</span>
          <button className={styles.CloseBtn} onClick={handleClose} title="Close">
            ✕
          </button>
        </div>

        {/* Red accent rule */}
        <div className={styles.AccentRule} />

        {/* Recommendation cards */}
        <div className={styles.List}>
          {recommendations.map((rec) => {
            const cat = getCategoryBySkillId(rec.skill.id);
            const dColor = difficultyColor[rec.skill.difficulty] || 'var(--text-tertiary)';

            return (
              <button
                key={rec.skill.id}
                className={styles.RecBtn}
                onClick={() => handleSelect(rec.skill.id)}
              >
                {/* Category + difficulty row */}
                <div className={styles.RecTop}>
                  <span className={styles.RecCategory}>
                    {cat && <CategoryIcon categoryId={cat.id} />}
                    {cat?.name}
                  </span>
                  <div className={styles.RecMeta}>
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        color: dColor,
                      }}
                    >
                      {rec.skill.difficulty}
                    </span>
                    <span className={styles.RecTime}>{rec.skill.timeEstimate}</span>
                  </div>
                </div>

                {/* Skill name */}
                <p className={styles.RecName}>
                  <span className={styles.RecKatakana}>{getKatakana(rec.skill.name)}</span>
                  {rec.skill.name}
                </p>

                {/* Reason */}
                <p className={styles.RecReason}>{rec.reasonText}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
