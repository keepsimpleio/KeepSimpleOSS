import { useRouter } from 'next/router';

import rawContent from './BizarrenessEffect.content';

import styles from './BizarrenessEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardIcon}>
          <div className={styles.iconPlain}>{c.before.icon}</div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardName}>{c.productName}</div>
          <div className={styles.cardMeta}>
            <span className={styles.badge}>{c.badge}</span>
            <span className={styles.category}>{c.category}</span>
          </div>
          <div className={styles.cardDesc}>{c.before.description}</div>
          <div className={styles.cardRating}>{c.rating}</div>
          <button className={styles.btn}>{c.before.cta}</button>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${styles.cardBizarre}`}>
        <div className={styles.cardIcon}>
          <div className={styles.iconOctopus}>{c.after.icon}</div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardName}>{c.productName}</div>
          <div className={styles.cardMeta}>
            <span className={styles.badge}>{c.badge}</span>
            <span className={styles.category}>{c.category}</span>
          </div>
          <div className={`${styles.cardDesc} ${styles.cardDescBizarre}`}>
            {c.after.description}
          </div>
          <div className={styles.cardRating}>{c.rating}</div>
          <button className={`${styles.btn} ${styles.btnBizarre}`}>
            {c.after.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
