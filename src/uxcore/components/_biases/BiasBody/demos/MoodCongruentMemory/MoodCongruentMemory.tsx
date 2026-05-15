import { useRouter } from 'next/router';

import rawContent from './MoodCongruentMemory.content';

import styles from './MoodCongruentMemory.module.scss';

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
          <div className={styles.from}>{c.before.from}</div>
          <div className={styles.subject}>{c.before.subject}</div>
        </div>
        <div className={styles.emailBody}>
          <p className={styles.greeting}>{c.greeting}</p>
          <p>
            {c.before.bodyLead} <strong>{c.before.bodyDate}</strong>
            {c.before.bodyTail}
          </p>
          <div className={styles.priceBox}>
            <div className={styles.price}>{c.before.price}</div>
            <div className={styles.priceSub}>{c.before.priceSub}</div>
          </div>
          <button className={styles.btn}>{c.before.btn}</button>
          <p className={styles.footer}>{c.before.footer}</p>
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
          <div className={styles.from}>{c.after.from}</div>
          <div className={styles.subject}>{c.after.subject}</div>
        </div>
        <div className={styles.emailBody}>
          <p className={styles.greeting}>{c.greeting}</p>
          <div className={styles.resolvedBanner}>
            <span className={styles.resolvedDot} />
            {c.after.resolvedBanner}
          </div>
          <p>{c.after.body}</p>
          <p className={styles.byTheWay}>{c.after.byTheWay}</p>
          <button className={`${styles.btn} ${styles.btnSoft}`}>
            {c.after.btn}
          </button>
        </div>
      </div>
      <div className={`${styles.label} ${styles.labelGood}`}>
        {c.after.label}
      </div>
    </div>
  );
}
