import { useRouter } from 'next/router';

import rawContent from './SocialDesirabilityBias.content';

import styles from './SocialDesirabilityBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>{c.before.avatar}</div>
          <div className={styles.userName}>{c.before.user}</div>
        </div>
        <h4 className={styles.question}>{c.before.question}</h4>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={`${styles.star} ${n <= c.before.filledStars ? styles.filled : ''}`}
            >
              &#9733;
            </button>
          ))}
        </div>
        <div className={styles.field}>
          <label>{c.before.commentsLabel}</label>
          <textarea rows={3} placeholder={c.before.placeholder} readOnly />
        </div>
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
        <div className={styles.anonBadge}>{c.after.anonBadge}</div>
        <h4 className={styles.question}>{c.after.question}</h4>
        <div className={styles.optionList}>
          {c.after.options.map(opt => (
            <label key={opt} className={styles.option}>
              <input type="radio" name="frustration" readOnly />
              <span>{opt}</span>
            </label>
          ))}
          <label className={styles.option}>
            <input type="radio" name="frustration" readOnly />
            <span>{c.after.otherOption}</span>
          </label>
        </div>
        <div className={styles.field}>
          <textarea rows={2} placeholder={c.after.placeholder} readOnly />
        </div>
        <p className={styles.anonNote}>{c.after.anonNote}</p>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.after.cta}
        </button>
      </div>
    </div>
  );
}
