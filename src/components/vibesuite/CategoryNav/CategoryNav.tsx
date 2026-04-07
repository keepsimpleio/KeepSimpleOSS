import cn from 'classnames';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import type { TRouter } from '@local-types/global';
import { UserProgress } from '@local-types/pageTypes/vibesuite';

import vibesuiteIntl from '@data/vibesuite/intl';
import { localizeCategory } from '@data/vibesuite/localizeSkills';
import { categories } from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';

import styles from './CategoryNav.module.scss';

interface CategoryNavProps {
  progress: UserProgress;
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onOpenRecommendations: () => void;
  onOpenWhyModal: () => void;
  allCompleted: boolean;
}

export default function CategoryNav({
  progress,
  activeCategoryId,
  onSelectCategory,
  onOpenRecommendations,
  onOpenWhyModal,
  allCompleted,
}: CategoryNavProps) {
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale];

  const localizedCats = useMemo(
    () => categories.map(c => localizeCategory(c, locale)),
    [locale],
  );

  return (
    <nav className={styles.Nav}>
      <div className={styles.Title}>
        <span className={styles.TitleLabel}>{t.categoriesTitle}</span>
      </div>

      <div className={styles.AccentRule} />

      {!allCompleted && (
        <button className={styles.RecommendBtn} onClick={onOpenRecommendations}>
          <span className={styles.RecommendBtnTitle}>{t.whatToLearnNext}</span>
          <span className={styles.RecommendBtnSub}>{t.personalizedForYou}</span>
        </button>
      )}

      <button
        className={cn(styles.AllCategoriesBtn, {
          [styles.Active]: activeCategoryId === null,
        })}
        onClick={() => onSelectCategory(null)}
      >
        {t.allCategories}
      </button>

      <div className={styles.Divider} />

      {localizedCats.map(cat => {
        const total = cat.skills.length;
        const done = cat.skills.filter(s => progress[s.id]?.completed).length;
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            className={cn(styles.CategoryBtn, { [styles.Active]: isActive })}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className={styles.CategoryBtnInner}>
              <span className={styles.CategoryBtnName}>
                <CategoryIcon categoryId={cat.id} />
                {cat.name}
              </span>
              <span
                className={cn(styles.CategoryBtnCount, {
                  [styles.CountCompleted]: done === total && total > 0,
                })}
              >
                {done}/{total}
              </span>
            </div>
          </button>
        );
      })}

      <div className={styles.Spacer} />
      <div className={styles.BottomSection}>
        <button className={styles.WhyBtn} onClick={onOpenWhyModal}>
          {t.whyDoINeedThis}
        </button>
      </div>
    </nav>
  );
}
