import { useRouter } from 'next/router';

import rawContent from './PeakEndRule.content';

import styles from './PeakEndRule.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.checkIcon}>{c.before.checkIcon}</div>
        <h4 className={styles.title}>{c.before.title}</h4>
        <p className={styles.body}>{c.before.body}</p>
        <div className={styles.orderNum}>{c.before.orderNum}</div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.checkIconBig}>{c.after.checkIcon}</div>
        <h4 className={styles.title}>{c.after.title}</h4>
        <div className={styles.deliveryEta}>
          <span className={styles.etaLabel}>{c.after.etaLabel}</span>
          <span className={styles.etaDate}>{c.after.etaDate}</span>
        </div>
        <div className={styles.note}>
          <span className={styles.noteIcon}>{c.after.noteIcon}</span>
          <span>{c.after.noteText}</span>
        </div>
        <div className={styles.discountBox}>
          <span className={styles.discountLabel}>{c.after.discountLabel}</span>
          <span className={styles.discountCode}>{c.after.discountCode}</span>
          <span className={styles.discountValue}>{c.after.discountValue}</span>
        </div>
        <div className={styles.badges}>
          {c.after.badges.map(b => (
            <span key={b} className={styles.badge}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
