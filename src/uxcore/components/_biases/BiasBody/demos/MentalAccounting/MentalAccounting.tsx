import { useRouter } from 'next/router';

import rawContent from './MentalAccounting.content';

import styles from './MentalAccounting.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h4 className={styles.heading}>{c.heading}</h4>
        <div className={styles.invoiceRow}>
          <span className={styles.invoiceLabel}>{c.planLabel}</span>
          <span className={styles.invoiceAmount}>{c.planAmount}</span>
        </div>
        <div className={styles.invoiceDivider} />
        <div className={styles.totalRow}>
          <span>{c.totalLabel}</span>
          <span className={styles.total}>{c.total}</span>
        </div>
        <button className={styles.btn}>{c.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h4 className={styles.heading}>{c.heading}</h4>
        <p className={styles.subtext}>{c.after.subtext}</p>
        <div className={styles.breakdown}>
          {c.after.breakdown.map(row => (
            <div key={row.title} className={styles.breakdownRow}>
              <div className={styles.breakdownIcon}>{row.icon}</div>
              <div className={styles.breakdownInfo}>
                <div className={styles.breakdownTitle}>{row.title}</div>
                <div className={styles.breakdownDesc}>{row.desc}</div>
              </div>
              <div className={styles.breakdownPrice}>{row.price}</div>
            </div>
          ))}
        </div>
        <div className={styles.invoiceDivider} />
        <div className={styles.totalRow}>
          <span>{c.totalLabel}</span>
          <span className={styles.total}>{c.total}</span>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.cta}
        </button>
      </div>
    </div>
  );
}
