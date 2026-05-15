import { useRouter } from 'next/router';

import rawContent from './ZeroRiskBias.content';

import styles from './ZeroRiskBias.module.scss';

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
        <div className={styles.orderSummary}>
          <div className={styles.orderRow}>
            <span>{c.order.productLabel}</span>
            <span>{c.order.productPrice}</span>
          </div>
          <div className={styles.orderRow}>
            <span>{c.order.shippingLabel}</span>
            <span>{c.order.shippingPrice}</span>
          </div>
          <div className={styles.orderDivider} />
          <div className={styles.orderTotal}>
            <span>{c.order.totalLabel}</span>
            <span>{c.order.totalPrice}</span>
          </div>
        </div>
        <div className={styles.policy}>{c.before.policy}</div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.before.cta}
        </button>
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
        <div className={styles.orderSummary}>
          <div className={styles.orderRow}>
            <span>{c.order.productLabel}</span>
            <span>{c.order.productPrice}</span>
          </div>
          <div className={styles.orderRow}>
            <span>{c.order.shippingLabel}</span>
            <span>{c.order.shippingPrice}</span>
          </div>
          <div className={styles.orderDivider} />
          <div className={styles.orderTotal}>
            <span>{c.order.totalLabel}</span>
            <span>{c.order.totalPrice}</span>
          </div>
        </div>
        <div className={styles.badges}>
          {c.after.badges.map(b => (
            <div key={b.title} className={styles.badge}>
              <span className={styles.badgeIcon}>{b.icon}</span>
              <div>
                <div className={styles.badgeTitle}>{b.title}</div>
                <div className={styles.badgeDesc}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.after.cta}
        </button>
      </div>
    </div>
  );
}
