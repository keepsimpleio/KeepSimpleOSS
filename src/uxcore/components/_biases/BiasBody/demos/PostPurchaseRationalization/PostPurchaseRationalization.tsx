import { useRouter } from 'next/router';

import rawContent from './PostPurchaseRationalization.content';

import styles from './PostPurchaseRationalization.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.email}>
        <div className={styles.emailMeta}>
          <div className={styles.from}>{c.from}</div>
          <div className={styles.subject}>{c.before.subject}</div>
        </div>
        <div className={styles.emailBody}>
          <p className={styles.greeting}>{c.before.greeting}</p>
          <p>{c.before.body}</p>
          <div className={styles.orderRow}>
            <span>{c.productName}</span>
            <span className={styles.price}>{c.price}</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.muted}>{c.before.deliveryLabel}</span>
            <span className={styles.muted}>{c.before.deliveryDate}</span>
          </div>
          <button className={styles.btn}>{c.trackBtn}</button>
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
      <div className={styles.email}>
        <div className={styles.emailMeta}>
          <div className={styles.from}>{c.from}</div>
          <div className={styles.subject}>{c.after.subject}</div>
        </div>
        <div className={styles.emailBody}>
          <div className={styles.heroImg}>
            <span className={styles.heroEmoji}>{c.after.heroEmoji}</span>
          </div>
          <p className={`${styles.greeting} ${styles.greetingBold}`}>
            {c.after.greeting}
          </p>
          <div className={styles.socialProof}>{c.after.socialProof}</div>
          <div className={styles.orderRow}>
            <span>{c.productName}</span>
            <span className={styles.price}>{c.price}</span>
          </div>
          <div className={styles.exclusivity}>
            <span className={styles.badge}>{c.after.exclusivityBadge}</span>
            {c.after.exclusivityPrefix} <strong>{c.after.serial}</strong>
          </div>
          <div className={styles.quoteBlock}>
            {c.after.quote}
            <div className={styles.quoteAuthor}>{c.after.quoteAuthor}</div>
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.after.setupBtn}
          </button>
          <button className={styles.btn}>{c.trackBtn}</button>
        </div>
      </div>
      <div className={`${styles.label} ${styles.labelGood}`}>
        {c.after.label}
      </div>
    </div>
  );
}
