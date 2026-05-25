import { useRouter } from 'next/router';

import rawContent from './Prejudice.content';

import styles from './Prejudice.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.checkout}>
        <h4 className={styles.title}>{c.before.title}</h4>
        <div className={styles.orderSummary}>
          <div className={styles.row}>
            <span>{c.before.orderLabel}</span>
            <span>{c.before.orderPrice}</span>
          </div>
          <div className={styles.row}>
            <span>{c.before.shippingLabel}</span>
            <span>{c.before.shippingPrice}</span>
          </div>
          <div className={`${styles.row} ${styles.total}`}>
            <span>{c.before.totalLabel}</span>
            <span>{c.before.totalPrice}</span>
          </div>
        </div>
        <button className={styles.btnGlobal}>{c.before.cta}</button>
        <p className={styles.note}>{c.before.note}</p>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={`${styles.checkout} ${styles.checkoutJP}`}>
        <h4 className={`${styles.title} ${styles.titleJP}`}>{c.after.title}</h4>
        <div className={styles.orderSummary}>
          <div className={styles.row}>
            <span>{c.after.orderLabel}</span>
            <span>{c.after.orderPrice}</span>
          </div>
          <div className={styles.row}>
            <span>{c.after.shippingLabel}</span>
            <span>{c.after.shippingPrice}</span>
          </div>
          <div className={`${styles.row} ${styles.total}`}>
            <span>{c.after.totalLabel}</span>
            <span>{c.after.totalPrice}</span>
          </div>
        </div>
        <button className={styles.btnJP}>{c.after.cta}</button>
        <p className={styles.noteJP}>{c.after.note}</p>
        <div className={styles.trustBadge}>{c.after.trustBadge}</div>
      </div>
    </div>
  );
}
