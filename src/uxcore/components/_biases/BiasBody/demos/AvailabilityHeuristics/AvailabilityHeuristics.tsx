import { useRouter } from 'next/router';

import rawContent from './AvailabilityHeuristics.content';

import styles from './AvailabilityHeuristics.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.chainIcon}>{c.before.icon}</div>
        <h4 className={styles.productName}>{c.productName}</h4>
        <p className={styles.tagline}>{c.before.tagline}</p>
        <div className={styles.features}>
          {c.before.chips.map(chip => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
        <button className={styles.btn}>{c.cta}</button>
      </div>
      <p className={styles.sub}>{c.subtitle}</p>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.shieldIcon}>{c.after.icon}</div>
        <h4 className={styles.productName}>{c.productName}</h4>
        <p className={styles.tagline}>{c.after.tagline}</p>
        <div className={styles.features}>
          {c.after.chips.map(chip => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.cta}
        </button>
      </div>
      <p className={styles.sub}>{c.subtitle}</p>
    </div>
  );
}
