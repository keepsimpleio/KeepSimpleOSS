import cn from 'classnames';

import { categories } from '@data/vibesuite/skills';
import { UserProgress } from '@local-types/pageTypes/vibesuite';

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
  return (
    <nav className={styles.Nav}>
      {/* Title */}
      <div className={styles.Title}>
        <span className={styles.TitleLabel}>Categories</span>
      </div>

      {/* Red accent rule */}
      <div className={styles.AccentRule} />

      {/* What to Learn Next banner */}
      {!allCompleted && (
        <button className={styles.RecommendBtn} onClick={onOpenRecommendations}>
          <span className={styles.RecommendBtnTitle}>What to learn next?</span>
          <span className={styles.RecommendBtnSub}>Personalized for you</span>
        </button>
      )}

      {/* All Categories button */}
      <button
        className={cn(styles.AllCategoriesBtn, { [styles.Active]: activeCategoryId === null })}
        onClick={() => onSelectCategory(null)}
      >
        All Categories
      </button>

      {/* Divider */}
      <div className={styles.Divider} />

      {categories.map((cat) => {
        const total = cat.skills.length;
        const done = cat.skills.filter((s) => progress[s.id]?.completed).length;
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

      {/* Bottom spacer + "Why do I need this?" */}
      <div className={styles.Spacer} />
      <div className={styles.BottomSection}>
        <button className={styles.WhyBtn} onClick={onOpenWhyModal}>
          Why do I need this?
        </button>
      </div>
    </nav>
  );
}
