import { useRouter } from 'next/router';

import rawContent from './BandwagonEffect.content';

import styles from './BandwagonEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardImg} />
        <div className={styles.cardBody}>
          <div className={styles.cardName}>{c.appName}</div>
          <div className={styles.cardCategory}>{c.category}</div>
          <div className={styles.cardRating}>
            <span className={styles.stars}>{c.stars}</span>
            <span className={styles.ratingCount}>{c.rating}</span>
          </div>
          <div className={styles.cardPrice}>{c.price}</div>
          <button className={styles.btn}>{c.cta}</button>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={`${styles.cardImg} ${styles.cardImgTrending}`}>
          <div className={styles.trendingBadge}>{c.after.trendingBadge}</div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardName}>{c.appName}</div>
          <div className={styles.cardCategory}>{c.category}</div>
          <div className={styles.cardRating}>
            <span className={styles.stars}>{c.stars}</span>
            <span className={styles.ratingCount}>{c.rating}</span>
            <span className={styles.ratingTotal}>{c.after.ratingTotal}</span>
          </div>
          <div className={styles.socialProof}>
            <span className={styles.avatarStack}>
              <span className={styles.avatar} />
              <span className={styles.avatar} />
              <span className={styles.avatar} />
            </span>
            <span className={styles.socialText}>{c.after.socialText}</span>
          </div>
          <div className={styles.cardPrice}>{c.price}</div>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
