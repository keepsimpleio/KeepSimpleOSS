import { sanitizeHtml } from '@uxcore/lib/sanitizeHtml';
import { useRouter } from 'next/router';

import rawContent from './InformationBias.content';

import styles from './InformationBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.productName}>{c.productName}</h4>
      <div className={styles.priceRow}>
        <span className={styles.price}>{c.price}</span>
        <span className={styles.rating}>{c.rating}</span>
      </div>
      <div className={styles.keySpecs}>
        {c.before.specs.map(s => (
          <div key={s.label} className={styles.spec}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>
      <button className={`${styles.btn} ${styles.btnPrimary}`}>
        {c.before.cta}
      </button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.productName}>{c.productName}</h4>
      <div className={styles.priceRow}>
        <span className={styles.price}>{c.price}</span>
        <span className={styles.rating}>{c.rating}</span>
      </div>
      <div className={styles.specTable}>
        {c.after.specs.map(([k, v]) => (
          <div key={k} className={styles.specRow}>
            <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(k) }} />
            <strong dangerouslySetInnerHTML={{ __html: sanitizeHtml(v) }} />
          </div>
        ))}
      </div>
      <div className={styles.compareBar}>
        <a className={styles.compareLink} href="#">
          {c.after.compareLink}
        </a>
      </div>
      <button className={`${styles.btn} ${styles.btnBuried}`}>
        {c.after.cta}
      </button>
    </div>
  );
}
