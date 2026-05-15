import { useRouter } from 'next/router';

import rawContent from './HyperbolicDiscounting.content';

import styles from './HyperbolicDiscounting.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>{c.before.icon}</div>
        <h4 className={styles.heading}>{c.before.heading}</h4>
        <p className={styles.subtext}>{c.before.subtext}</p>
        <div className={styles.comparison}>
          <div className={styles.option}>
            <span className={styles.label}>{c.before.monthlyLabel}</span>
            <span className={styles.amount}>{c.before.monthlyAmount}</span>
          </div>
          <div className={styles.divider}>{c.before.vs}</div>
          <div className={`${styles.option} ${styles.highlighted}`}>
            <span className={styles.label}>{c.before.annualLabel}</span>
            <span className={styles.amount}>{c.before.annualAmount}</span>
            <span className={styles.savings}>{c.before.savings}</span>
          </div>
        </div>
        <button className={styles.btn}>{c.before.cta}</button>
        <p className={styles.note}>{c.before.note}</p>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.urgencyBanner}>
          <span className={styles.fire}>🔥</span> {c.after.urgencyPrefix}{' '}
          <span className={styles.countdown}>{c.after.countdown}</span>
        </div>
        <div className={styles.icon}>{c.after.icon}</div>
        <h4 className={styles.headingBold}>{c.after.heading}</h4>
        <p className={styles.subtext}>{c.after.subtext}</p>
        <div className={styles.freeMonth}>
          <div className={styles.freeTag}>{c.after.freeTag}</div>
          <div className={styles.freeDesc}>
            <strong>{c.after.freeDescBold}</strong>
            {c.after.freeDescEnd}
          </div>
        </div>
        <button className={`${styles.btn} ${styles.btnCta}`}>
          {c.after.cta}
        </button>
        <p className={styles.note}>{c.after.note}</p>
      </div>
    </div>
  );
}
