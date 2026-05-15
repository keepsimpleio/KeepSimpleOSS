import { useRouter } from 'next/router';

import rawContent from './FundamentalAttributionError.content';

import styles from './FundamentalAttributionError.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.emailCard}>
        <div className={styles.emailHeader}>
          <div className={styles.logo}>{c.logo}</div>
          <div className={styles.badge}>{c.badge}</div>
        </div>
        <h4 className={styles.headline}>{c.before.headline}</h4>
        <p className={styles.body}>
          {c.before.bodyStart} <strong>{c.before.bodyBold}</strong>{' '}
          {c.before.bodyEnd}
        </p>
        <div className={styles.stat}>
          <span className={styles.statNum}>{c.before.statNum}</span>
          <span className={styles.statLabel}>{c.before.statLabel}</span>
        </div>
        <button className={styles.btn}>{c.before.btn}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.emailCard}>
        <div className={styles.emailHeader}>
          <div className={styles.logo}>{c.logo}</div>
          <div className={styles.badge}>{c.badge}</div>
        </div>
        <h4 className={styles.headline}>{c.after.headline}</h4>
        <p className={styles.body}>
          {c.after.bodyStart} <strong>{c.after.bodyBold}</strong>{' '}
          {c.after.bodyEnd}
        </p>
        <div className={styles.highlights}>
          {c.after.highlights.map(h => (
            <div key={h.text} className={styles.highlight}>
              <span className={styles.icon}>{h.icon}</span>
              <span>{h.text}</span>
            </div>
          ))}
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.after.btn}
        </button>
      </div>
    </div>
  );
}
