import { useRouter } from 'next/router';

import rawContent from './FramingEffect.content';

import styles from './FramingEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.iconWarning}>{c.before.iconWarning}</span>
        </div>
        <h4 className={styles.title}>{c.title}</h4>
        <p className={styles.body}>{c.body}</p>
        <div className={styles.riskBox}>
          <span className={styles.riskLabel}>{c.before.riskLabel}</span>
          <span className={styles.riskValue}>{c.before.riskValue}</span>
        </div>
        <p className={styles.sub}>{c.before.sub}</p>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>
            {c.before.secondaryBtn}
          </button>
          <button className={styles.btnPrimary}>{c.primaryBtn}</button>
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
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.iconSuccess}>{c.after.iconSuccess}</span>
        </div>
        <h4 className={styles.title}>{c.title}</h4>
        <p className={styles.body}>{c.body}</p>
        <div className={styles.successBox}>
          <span className={styles.successLabel}>{c.after.successLabel}</span>
          <span className={styles.successValue}>{c.after.successValue}</span>
        </div>
        <p className={styles.sub}>{c.after.sub}</p>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>
            {c.after.secondaryBtn}
          </button>
          <button className={styles.btnPrimary}>{c.primaryBtn}</button>
        </div>
      </div>
      <div className={`${styles.label} ${styles.labelGood}`}>
        {c.after.label}
      </div>
    </div>
  );
}
