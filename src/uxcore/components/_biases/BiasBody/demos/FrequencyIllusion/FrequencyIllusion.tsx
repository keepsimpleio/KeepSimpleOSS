import { useRouter } from 'next/router';

import rawContent from './FrequencyIllusion.content';

import styles from './FrequencyIllusion.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.heading}>{c.heading}</div>
      {c.surfaces.map(s => (
        <div key={s} className={styles.surface}>
          <div className={styles.surfaceLabel}>{s}</div>
          <div className={styles.tagline}>{c.before.messages[s]}</div>
        </div>
      ))}
      <div className={styles.note}>{c.before.note}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.heading}>{c.heading}</div>
      {c.surfaces.map(s => (
        <div
          key={s}
          className={`${styles.surface} ${styles.surfaceConsistent}`}
        >
          <div className={styles.surfaceLabel}>{s}</div>
          <div className={`${styles.tagline} ${styles.taglineHighlight}`}>
            {c.after.message}
          </div>
        </div>
      ))}
      <div className={`${styles.note} ${styles.noteGood}`}>{c.after.note}</div>
    </div>
  );
}
