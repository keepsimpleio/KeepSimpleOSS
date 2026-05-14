import { useRouter } from 'next/router';

import rawContent from './LessIsBetterEffect.content';

import styles from './LessIsBetterEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.notification}>
        <div className={styles.notifIcon}>{c.before.icon}</div>
        <div className={styles.notifBody}>
          <div className={styles.notifTitle}>{c.before.title}</div>
          <div className={styles.notifDesc}>
            {c.before.descStart}
            <strong>{c.before.descBold}</strong>
            {c.before.descEnd}
          </div>
          <div className={styles.expires}>{c.before.expires}</div>
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
      <div className={styles.notification}>
        <div className={styles.notifIcon}>{c.after.icon}</div>
        <div className={styles.notifBody}>
          <div className={styles.notifTitle}>{c.after.title}</div>
          <div className={styles.notifDesc}>
            {c.after.descStart}
            <strong>{c.after.descBold}</strong>
          </div>
          <div className={styles.valueTag}>{c.after.valueTag}</div>
          <div className={styles.creditRow}>
            {c.after.credits.map(credit => (
              <div key={credit.label} className={styles.creditItem}>
                <span className={styles.creditNum}>{credit.num}</span>
                <span className={styles.creditLabel}>{credit.label}</span>
              </div>
            ))}
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.after.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
