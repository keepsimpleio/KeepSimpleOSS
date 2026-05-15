import { useRouter } from 'next/router';

import rawContent from './HaloEffect.content';

import styles from './HaloEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.listing}>
        <div className={styles.iconPlain}>
          <div className={styles.iconLetter}>{c.iconLetter}</div>
        </div>
        <div className={styles.appMeta}>
          <div className={styles.appName}>{c.appName}</div>
          <div className={styles.appDev}>{c.appDev}</div>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{c.before.stars}</span>
            <span className={styles.ratingNum}>{c.before.ratingNum}</span>
          </div>
        </div>
      </div>
      <div className={styles.screenshots}>
        <div className={styles.screenshotPlain} />
        <div className={styles.screenshotPlain} />
        <div className={styles.screenshotPlain} />
      </div>
      <div className={styles.featureList}>
        {c.before.features.map(feature => (
          <div key={feature} className={styles.featureItem}>
            {feature}
          </div>
        ))}
      </div>
      <button className={styles.btn}>{c.before.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.editorBadge}>{c.after.editorBadge}</div>
      <div className={styles.listing}>
        <div className={styles.iconGradient}>
          <div className={styles.iconLetter}>{c.iconLetter}</div>
        </div>
        <div className={styles.appMeta}>
          <div className={styles.appName}>{c.appName}</div>
          <div className={styles.appDev}>{c.appDev}</div>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{c.after.stars}</span>
            <span className={styles.ratingNum}>{c.after.ratingNum}</span>
            <span className={styles.ratingCount}>{c.after.ratingCount}</span>
          </div>
        </div>
      </div>
      <div className={styles.videoPreview}>
        <div className={styles.playBtn}>&#9654;</div>
        <div className={styles.videoLabel}>{c.after.videoLabel}</div>
      </div>
      <div className={styles.screenshots}>
        <div className={styles.screenshotPolished} />
        <div className={styles.screenshotPolished} />
        <div className={styles.screenshotPolished} />
      </div>
      <div className={styles.awardBanner}>{c.after.awardBanner}</div>
      <button className={`${styles.btn} ${styles.btnPrimary}`}>
        {c.after.cta}
      </button>
    </div>
  );
}
