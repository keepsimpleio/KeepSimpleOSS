import { useRouter } from 'next/router';

import rawContent from './GamblersFallacy.content';

import styles from './GamblersFallacy.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.boxIcon}>&#10067;</div>
        <div className={styles.boxTitle}>{c.boxTitle}</div>
        <div className={styles.boxSub}>{c.before.boxSub}</div>
      </div>
      <button className={styles.btnPlain}>{c.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  const { filled, total } = c.after;

  return (
    <div className={styles.container}>
      <div className={styles.streakBadge}>{c.after.streakBadge}</div>
      <div className={styles.box}>
        <div className={styles.boxIconGlow}>&#10067;</div>
        <div className={styles.boxTitle}>{c.boxTitle}</div>
        <div className={styles.boxSub}>{c.after.boxSub}</div>
      </div>
      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>{c.after.progressLabel}</div>
        <div className={styles.progressTrack}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={i < filled ? styles.pip : styles.pipEmpty}
            />
          ))}
          <div className={styles.pipGold} />
        </div>
        <div className={styles.progressHint}>{c.after.progressHint}</div>
      </div>
      <button className={styles.btnGlow}>{c.cta}</button>
    </div>
  );
}
