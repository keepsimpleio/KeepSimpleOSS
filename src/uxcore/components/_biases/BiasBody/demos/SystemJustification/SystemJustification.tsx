import { useRouter } from 'next/router';

import rawContent from './SystemJustification.content';

import styles from './SystemJustification.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.blogCard}>
        <div className={styles.category}>{c.before.category}</div>
        <h4 className={styles.title}>{c.before.title}</h4>
        <p className={styles.excerpt}>{c.before.excerpt}</p>
        <div className={styles.cta}>
          <button className={styles.btn}>{c.before.cta}</button>
          <span className={styles.social}>{c.before.social}</span>
        </div>
        <div className={styles.tags}>
          {c.before.tags.map(t => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.blogCard}>
        <div className={styles.category}>{c.after.category}</div>
        <h4 className={styles.title}>{c.after.title}</h4>
        <p className={styles.excerpt}>{c.after.excerpt}</p>
        <div className={styles.cta}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.after.cta}
          </button>
          <span className={styles.social}>{c.after.social}</span>
        </div>
        <div className={styles.tags}>
          {c.after.tags.map(t => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
