import cn from 'classnames';
import { useRouter } from 'next/router';
import { useEffect,useState } from 'react';

import type { TRouter } from '@local-types/global';
import { Recommendation } from '@local-types/pageTypes/vibesuite';

import vibesuiteIntl from '@data/vibesuite/intl';
import { categoriesRu } from '@data/vibesuite/intl/skills.ru';
import { localizeSkill } from '@data/vibesuite/localizeSkills';
import { getCategoryBySkillId } from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';

import styles from './RecommendationModal.module.scss';

const KATAKANA_MAP: Record<string, string> = {
  a: '\u30A2',
  b: '\u30D3',
  c: '\u30AF',
  d: '\u30C7',
  e: '\u30A8',
  f: '\u30D5',
  g: '\u30B0',
  h: '\u30CF',
  i: '\u30A4',
  j: '\u30B8',
  k: '\u30AB',
  l: '\u30EB',
  m: '\u30DE',
  n: '\u30CA',
  o: '\u30AA',
  p: '\u30D7',
  q: '\u30AF',
  r: '\u30E9',
  s: '\u30B5',
  t: '\u30BF',
  u: '\u30A6',
  v: '\u30F4',
  w: '\u30EF',
  x: '\u30B7',
  y: '\u30E4',
  z: '\u30BA',
};
function getKatakana(name: string): string {
  const first = name.charAt(0).toLowerCase();
  return KATAKANA_MAP[first] || '\u30B9';
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
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale];

  const difficultyLabels: Record<string, string> = {
    beginner: t.difficultyBeginner,
    intermediate: t.difficultyIntermediate,
    advanced: t.difficultyAdvanced,
  };

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
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.Header}>
          <span className={styles.Title}>{t.whatToLearnNextTitle}</span>
          <button
            className={styles.CloseBtn}
            onClick={handleClose}
            title="Close"
          >
            &#10005;
          </button>
        </div>

        <div className={styles.AccentRule} />

        <div className={styles.List}>
          {recommendations.map(rec => {
            const cat = getCategoryBySkillId(rec.skill.id);
            const locRec = localizeSkill(rec.skill, locale);
            const catDisplayName = cat
              ? locale === 'ru'
                ? categoriesRu[cat.id]?.name || cat.name
                : cat.name
              : undefined;
            const dColor =
              difficultyColor[rec.skill.difficulty] || 'var(--text-tertiary)';

            return (
              <button
                key={rec.skill.id}
                className={styles.RecBtn}
                onClick={() => handleSelect(rec.skill.id)}
              >
                <div className={styles.RecTop}>
                  <span className={styles.RecCategory}>
                    {cat && <CategoryIcon categoryId={cat.id} />}
                    {catDisplayName}
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
                      {difficultyLabels[rec.skill.difficulty] ||
                        rec.skill.difficulty}
                    </span>
                    <span className={styles.RecTime}>
                      {locRec.timeEstimate}
                    </span>
                  </div>
                </div>

                <p className={styles.RecName}>
                  <span className={styles.RecKatakana}>
                    {getKatakana(rec.skill.name)}
                  </span>
                  {locRec.name}
                </p>

                <p className={styles.RecReason}>{rec.reasonText}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
