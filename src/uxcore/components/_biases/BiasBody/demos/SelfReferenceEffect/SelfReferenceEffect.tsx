import { useRouter } from 'next/router';

import rawContent from './SelfReferenceEffect.content';

import styles from './SelfReferenceEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h4 className={styles.headline}>{c.before.headline}</h4>
        <p className={styles.sub}>{c.before.sub}</p>
        <button className={styles.cta}>{c.before.cta}</button>
      </div>
      <div className={styles.testimonial}>
        <p className={styles.quote}>{c.before.quote}</p>
        <span className={styles.author}>{c.before.author}</span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.badge}>{c.after.badge}</div>
        <h4 className={styles.headline}>{c.after.headline}</h4>
        <p className={styles.sub}>{c.after.sub}</p>
        <button className={styles.cta}>{c.after.cta}</button>
      </div>
      <div className={styles.testimonial}>
        <div className={styles.testimonialInner}>
          <div className={styles.testimonialAvatar}>{c.after.avatar}</div>
          <div>
            <p className={styles.quote}>{c.after.quote}</p>
            <span className={styles.author}>{c.after.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
