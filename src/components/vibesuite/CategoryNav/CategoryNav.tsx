import cn from 'classnames';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import type { TRouter } from '@local-types/global';

import vibesuiteIntl from '@data/vibesuite/intl';
import { localizeCategory } from '@data/vibesuite/localizeSkills';
import { categories } from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';

import { CategoryNavProps } from './CategoryNav.types';

import styles from './CategoryNav.module.scss';

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
    <nav className={styles.nav}>
      <div className={styles.title}>
        <span className={styles.titleLabel}>{t.categoriesTitle}</span>
      </div>

      <div className={styles.accentRule} />

      {!allCompleted && (
        <button className={styles.recommendBtn} onClick={onOpenRecommendations}>
          <span className={styles.recommendBtnTitle}>{t.whatToLearnNext}</span>
          <span className={styles.recommendBtnSub}>{t.personalizedForYou}</span>
        </button>
      )}

      <ul className={styles.navList}>
        <li>
          <button
            className={cn(styles.allCategoriesBtn, {
              [styles.active]: activeCategoryId === null,
            })}
            onClick={() => onSelectCategory(null)}
            aria-current={activeCategoryId === null ? 'true' : undefined}
          >
            {t.allCategories}
          </button>
        </li>

        <li className={styles.divider} role="separator" aria-hidden="true" />

        {localizedCats.map(cat => {
          const total = cat.skills.length;
          const done = cat.skills.filter(s => progress[s.id]?.completed).length;
          const isActive = activeCategoryId === cat.id;

          return (
            <li key={cat.id}>
              <button
                className={cn(styles.categoryBtn, {
                  [styles.active]: isActive,
                })}
                onClick={() => onSelectCategory(cat.id)}
                aria-current={isActive ? 'true' : undefined}
              >
                <div className={styles.categoryBtnInner}>
                  <span className={styles.categoryBtnName}>
                    <CategoryIcon categoryId={cat.id} />
                    {cat.name}
                  </span>
                  <span
                    className={cn(styles.categoryBtnCount, {
                      [styles.countCompleted]: done === total && total > 0,
                    })}
                  >
                    {done}/{total}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.spacer} />
      <div className={styles.bottomSection}>
        <button className={styles.whyBtn} onClick={onOpenWhyModal}>
          {t.whyDoINeedThis}
        </button>
      </div>
    </nav>
  );
}
