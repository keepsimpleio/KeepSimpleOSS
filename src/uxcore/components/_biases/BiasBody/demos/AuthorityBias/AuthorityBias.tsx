import { useRouter } from 'next/router';

import rawContent from './AuthorityBias.content';

import styles from './AuthorityBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.label}>{c.before.label}</div>
        <p className={styles.recommendation}>{c.before.recommendation}</p>
        <button className={styles.btn}>{c.before.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.doctorCard}>
        <div className={styles.doctorHeader}>
          <div className={styles.avatar}>{c.after.avatar}</div>
          <div className={styles.doctorInfo}>
            <div className={styles.doctorName}>{c.after.doctorName}</div>
            {c.after.credentials.map(cr => (
              <div key={cr} className={styles.credential}>
                {cr}
              </div>
            ))}
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>&#10003;</span>
            {c.after.verified}
          </div>
        </div>
        <blockquote className={styles.quote}>{c.after.quote}</blockquote>
        <div className={styles.tags}>
          {c.after.tags.map(t => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
        <button className={styles.btnPrimary}>{c.after.cta}</button>
      </div>
    </div>
  );
}
