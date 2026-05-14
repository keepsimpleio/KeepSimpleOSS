import { useRouter } from 'next/router';

import rawContent from './ContextEffect.content';

import styles from './ContextEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.commercialHero}>
        <div className={styles.urgencyBadge}>{c.before.urgencyBadge}</div>
        <h4 className={styles.headline}>{c.before.headline}</h4>
        <p className={styles.sub}>{c.before.sub}</p>
        <div className={styles.amounts}>
          {c.amounts.map(a => (
            <button key={a} className={styles.amountBtn}>
              {a}
            </button>
          ))}
        </div>
        <button className={styles.cta}>{c.before.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.natureHero}>
        <div className={styles.leafDecor}>{c.after.leafDecor}</div>
        <h4 className={styles.headlineNature}>{c.after.headline}</h4>
        <p className={styles.subNature}>{c.after.sub}</p>
        <div className={styles.amounts}>
          {c.amounts.map(a => (
            <button
              key={a}
              className={`${styles.amountBtn} ${styles.amountBtnNature}`}
            >
              {a}
            </button>
          ))}
        </div>
        <button className={styles.ctaNature}>{c.after.cta}</button>
        <div className={styles.testimonial}>
          <span className={styles.tAvatar}>{c.after.testimonialAvatar}</span>
          <span className={styles.tText}>{c.after.testimonialText}</span>
        </div>
      </div>
    </div>
  );
}
