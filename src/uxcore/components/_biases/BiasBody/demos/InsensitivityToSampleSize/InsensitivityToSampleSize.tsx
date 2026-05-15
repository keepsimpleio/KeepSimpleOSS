import { useRouter } from 'next/router';

import rawContent from './InsensitivityToSampleSize.content';

import styles from './InsensitivityToSampleSize.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  const [p1, p2] = c.before.products;

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.products}>
        <div className={styles.product}>
          <div className={styles.productName}>{p1.name}</div>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{p1.stars}</span>
            <span className={styles.ratingNum}>{p1.rating}</span>
          </div>
          <div className={styles.reviewCount}>{p1.reviews}</div>
          <div className={styles.price}>{p1.price}</div>
          <button className={styles.btn}>{c.buyBtn}</button>
        </div>
        <div className={styles.divider} />
        <div className={styles.product}>
          <div className={styles.productName}>{p2.name}</div>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{p2.stars}</span>
            <span className={styles.ratingNum}>{p2.rating}</span>
          </div>
          <div className={styles.reviewCount}>{p2.reviews}</div>
          <div className={styles.price}>{p2.price}</div>
          <button className={styles.btn}>{c.buyBtn}</button>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  const { muted, verified } = c.after;

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.products}>
        <div className={`${styles.product} ${styles.productMuted}`}>
          <div className={styles.productName}>{muted.name}</div>
          <div className={styles.ratingRow}>
            <span className={`${styles.stars} ${styles.starsMuted}`}>
              {muted.stars}
            </span>
            <span className={`${styles.ratingNum} ${styles.ratingMuted}`}>
              {muted.rating}
            </span>
          </div>
          <div className={styles.reviewCount}>{muted.reviews}</div>
          <div className={styles.confidenceBadge}>{muted.confidenceBadge}</div>
          <div className={styles.price}>{muted.price}</div>
          <button className={`${styles.btn} ${styles.btnMuted}`}>
            {c.buyBtn}
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.product}>
          <div className={styles.productName}>{verified.name}</div>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{verified.stars}</span>
            <span className={styles.ratingNum}>{verified.rating}</span>
          </div>
          <div className={styles.reviewCount}>{verified.reviews}</div>
          <div className={styles.verifiedBadge}>{verified.verifiedBadge}</div>
          <div className={styles.confidenceBar}>
            <div className={styles.confidenceFill} />
          </div>
          <div className={styles.price}>{verified.price}</div>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.buyBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
