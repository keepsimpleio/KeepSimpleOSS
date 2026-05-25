import { useRouter } from 'next/router';

import rawContent from './LossAversion.content';

import styles from './LossAversion.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.trialBadge}>{c.before.trialBadge}</div>
        <h4 className={styles.heading}>{c.before.heading}</h4>
        <p className={styles.subtext}>{c.before.subtext}</p>
        <ul className={styles.gains}>
          {c.before.gains.map(g => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <div className={styles.price}>
          {c.before.price}
          <span>{c.before.priceUnit}</span>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.before.cta}
        </button>
        <p className={styles.skip}>{c.before.skip}</p>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.trialBadge}>{c.after.trialBadge}</div>
        <h4 className={styles.headingLoss}>{c.after.heading}</h4>
        <ul className={styles.losses}>
          {c.after.losses.map(l => (
            <li key={l}>
              <span className={styles.lossIcon}>{c.after.lossIcon}</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
        <div className={styles.price}>
          {c.after.priceLabel}
          {c.after.price}
          <span>{c.after.priceUnit}</span>
        </div>
        <button className={`${styles.btn} ${styles.btnDanger}`}>
          {c.after.cta}
        </button>
        <p className={styles.skip}>{c.after.skip}</p>
      </div>
    </div>
  );
}
