import { useRouter } from 'next/router';

import rawContent from './CueDependentForgetting.content';

import styles from './CueDependentForgetting.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        <div className={styles.notifBar}>
          <span className={styles.appDot} />
          <span className={styles.appLabel}>{c.appLabel}</span>
          <span className={styles.notifTime}>{c.notifTime}</span>
        </div>
        <div className={styles.notifBody}>
          <div className={styles.notifTitle}>{c.before.notifTitle}</div>
          <div className={styles.notifMsg}>{c.before.notifMsg}</div>
        </div>
        <div className={styles.actions}>
          <button className={styles.dismiss}>{c.before.dismiss}</button>
          <button className={styles.open}>{c.before.open}</button>
        </div>
      </div>
      <div className={styles.label}>{c.before.label}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        <div className={styles.notifBar}>
          <span className={styles.appDot} />
          <span className={styles.appLabel}>{c.appLabel}</span>
          <span className={styles.notifTime}>{c.notifTime}</span>
        </div>
        <div className={styles.notifBody}>
          <div className={styles.notifTitle}>{c.after.notifTitle}</div>
          <div className={styles.notifMsg}>{c.after.notifMsg}</div>
          <div className={styles.streakChart}>
            {c.after.chartHeights.map((h, i) => (
              <div
                key={i}
                className={styles.bar}
                style={{ height: `${h * 6}px` }}
              />
            ))}
          </div>
          <div className={styles.chartLabel}>{c.after.chartLabel}</div>
        </div>
        <div className={styles.actions}>
          <button className={styles.dismiss}>{c.after.dismiss}</button>
          <button className={`${styles.open} ${styles.openGreen}`}>
            {c.after.open}
          </button>
        </div>
      </div>
      <div className={`${styles.label} ${styles.labelGood}`}>
        {c.after.label}
      </div>
    </div>
  );
}
