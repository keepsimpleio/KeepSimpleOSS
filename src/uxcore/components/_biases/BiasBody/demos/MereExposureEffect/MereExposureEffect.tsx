import { useRouter } from 'next/router';

import rawContent from './MereExposureEffect.content';

import styles from './MereExposureEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.appCard}>
        <div className={styles.heroGeneric}>
          <div className={styles.heroPlaceholder}>
            <span className={styles.heroIcon}>{c.before.heroIcon}</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.appTitle}>{c.appTitle}</div>
          <div className={styles.appSub}>{c.before.appSub}</div>
          <div className={styles.stars}>
            {c.before.starsPrefix} <span>{c.before.starsRating}</span>
          </div>
          <div className={styles.testimonial}>
            {c.before.testimonial}
            <div className={styles.testimonialAuthor}>
              {c.before.testimonialAuthor}
            </div>
          </div>
          <button className={styles.btn}>{c.before.cta}</button>
        </div>
      </div>
      <div className={styles.label}>{c.before.label}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.appCard}>
        <div className={styles.heroFrench}>
          <div className={styles.tricolor}>
            <span className={styles.triBlue} />
            <span className={styles.triWhite} />
            <span className={styles.triRed} />
          </div>
          <div className={styles.parisLine}>
            <span className={styles.parisIcon}>{c.after.parisIcon}</span>
            <span className={styles.parisText}>{c.after.parisText}</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.appTitle}>{c.appTitle}</div>
          <div className={styles.appSub}>{c.after.appSub}</div>
          <div className={styles.stars}>
            {c.after.starsPrefix} <span>{c.after.starsRating}</span>
          </div>
          <div className={`${styles.testimonial} ${styles.testimonialFr}`}>
            {c.after.testimonial}
            <div className={styles.testimonialAuthor}>
              {c.after.testimonialAuthor}
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnFr}`}>
            {c.after.cta}
          </button>
        </div>
      </div>
      <div className={`${styles.label} ${styles.labelGood}`}>
        {c.after.label}
      </div>
    </div>
  );
}
