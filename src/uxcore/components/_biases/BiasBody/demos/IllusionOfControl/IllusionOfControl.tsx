import { useRouter } from 'next/router';

import rawContent from './IllusionOfControl.content';

import styles from './IllusionOfControl.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.before.title}</h4>
      <div className={styles.list}>
        {c.before.features.map(f => (
          <div key={f.name} className={styles.featureRow}>
            <span className={styles.featureName}>{f.name}</span>
            <span className={styles.eta}>
              {c.before.comingPrefix} {f.eta}
            </span>
          </div>
        ))}
      </div>
      <p className={styles.note}>{c.before.note}</p>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <span className={styles.bannerIcon}>🗳</span>
        <span className={styles.bannerText}>{c.after.bannerText}</span>
      </div>
      <h4 className={styles.title}>{c.after.title}</h4>
      <div className={styles.list}>
        {c.after.features.map(f => (
          <div key={f.name} className={styles.featureRow}>
            <button className={styles.voteBtn}>{c.after.voteBtn}</button>
            <span className={styles.featureName}>{f.name}</span>
            <span className={styles.votes}>
              {f.votes.toLocaleString()} {c.after.votesSuffix}
            </span>
          </div>
        ))}
      </div>
      <p className={styles.note}>{c.after.note}</p>
    </div>
  );
}
