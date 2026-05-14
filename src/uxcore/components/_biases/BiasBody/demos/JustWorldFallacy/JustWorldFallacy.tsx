import { useRouter } from 'next/router';

import rawContent from './JustWorldFallacy.content';

import styles from './JustWorldFallacy.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.alertIcon}>⚠️</div>
        <h4 className={styles.heading}>{c.before.heading}</h4>
        <p className={styles.blunt}>{c.before.blunt}</p>
        {c.before.plans.map(p => (
          <div key={p.label} className={styles.priceRow}>
            <span className={styles.planLabel}>{p.label}</span>
            <span className={styles.newPrice}>{p.price}</span>
          </div>
        ))}
        <button className={styles.btn}>{c.before.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.badge}>{c.after.badge}</div>
        <h4 className={styles.heading}>{c.after.heading}</h4>
        <p className={styles.body}>{c.after.body}</p>
        <p className={styles.subtext}>{c.after.subtext}</p>
        <div className={styles.breakdown}>
          {c.after.breakdown.map(row => (
            <div key={row.label} className={styles.breakdownRow}>
              <span>{row.label}</span>
              <span className={styles.pct}>{row.pct}</span>
            </div>
          ))}
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.after.cta}
        </button>
      </div>
    </div>
  );
}
