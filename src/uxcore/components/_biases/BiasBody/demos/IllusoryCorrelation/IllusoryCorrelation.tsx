import { useRouter } from 'next/router';

import rawContent from './IllusoryCorrelation.content';

import styles from './IllusoryCorrelation.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.productLogo}>
          <div className={styles.logoMark}>P</div>
          <div className={styles.logoName}>{c.logoName}</div>
        </div>
        <div className={styles.tagline}>{c.tagline}</div>
        <button className={styles.btn}>{c.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.productLogo}>
          <div className={styles.logoMark}>P</div>
          <div className={styles.logoName}>{c.logoName}</div>
        </div>
        <div className={styles.tagline}>{c.tagline}</div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.cta}
        </button>
      </div>
      <div className={styles.trustedSection}>
        <div className={styles.trustedLabel}>{c.after.trustedLabel}</div>
        <div className={styles.logoRow}>
          <div className={styles.brandLogo}>
            <span className={styles.brandG}>G</span>oogle
          </div>
          <div className={styles.brandLogo}>
            <span className={styles.brandS}>S</span>tripe
          </div>
          <div className={styles.brandLogo}>
            <span className={styles.brandN}>N</span>ASA
          </div>
        </div>
      </div>
    </div>
  );
}
