import { useRouter } from 'next/router';

import rawContent from './NeglectOfProbability.content';

import styles from './NeglectOfProbability.module.scss';

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
        <h4 className={styles.title}>{c.before.title}</h4>
        <p className={styles.body}>
          {c.before.bodyStart} <strong>{c.before.bodyStat}</strong>{' '}
          {c.before.bodyEnd}
        </p>
        <p className={styles.body}>{c.before.bodySecond}</p>
        <button className={styles.btn}>{c.before.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${styles.cardAlert}`}>
        <div className={styles.alertHeader}>
          <span className={styles.alertIcon}>{c.after.alertIcon}</span>
          <span className={styles.alertTitle}>{c.after.alertTitle}</span>
        </div>
        <div className={styles.daysStat}>
          <span className={styles.daysNum}>{c.after.daysNum}</span>
          <span className={styles.daysLabel}>{c.after.daysLabel}</span>
        </div>
        <div className={styles.comparison}>
          {c.after.compRows.map(row => (
            <div key={row.label} className={styles.compRow}>
              <span className={styles.compLabel}>{row.label}</span>
              <span
                className={
                  row.red
                    ? `${styles.compValue} ${styles.compValueRed}`
                    : styles.compValue
                }
              >
                {row.value}
              </span>
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
