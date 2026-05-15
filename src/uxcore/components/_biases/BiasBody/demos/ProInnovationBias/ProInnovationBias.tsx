import { useRouter } from 'next/router';

import rawContent from './ProInnovationBias.content';

import styles from './ProInnovationBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={`${styles.banner} ${styles.bannerLoud}`}>
        <span className={styles.sparkle}>&#10024;</span>
        <span>{c.before.banner}</span>
      </div>
      <div className={styles.bigHeadline}>{c.before.headline}</div>
      <div className={styles.body}>{c.before.body}</div>
      <div className={styles.actions}>
        <button className={styles.ctaBig}>{c.before.cta}</button>
      </div>
      <div className={styles.complaint}>
        <span className={styles.complaintIcon}>&#128293;</span>
        <span>{c.before.complaint}</span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={`${styles.banner} ${styles.bannerCalm}`}>
        <span className={styles.tagBeta}>{c.after.tag}</span>
        <span>{c.after.banner}</span>
      </div>
      <div className={styles.bigHeadline}>{c.after.headline}</div>
      <div className={styles.body}>{c.after.body}</div>
      <div className={styles.actions}>
        <button className={styles.ctaPrimary}>{c.after.ctaPrimary}</button>
        <button className={styles.ctaSecondary}>{c.after.ctaSecondary}</button>
      </div>
      <div className={styles.reassure}>
        <span className={styles.checkIcon}>&#10003;</span>
        <span>{c.after.reassure}</span>
      </div>
    </div>
  );
}
