import { useRouter } from 'next/router';

import rawContent from './ObserverExpectancyEffect.content';

import styles from './ObserverExpectancyEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.scriptHeader}>
        <span className={styles.dot} />
        {c.scriptLabel}
      </div>
      <ol className={styles.script}>
        {c.before.questions.map((q, i) => (
          <li key={i} className={styles.leading}>
            <span className={styles.tag}>{c.tagLeading}</span>
            <span>{q}</span>
          </li>
        ))}
      </ol>
      <div className={styles.outcome}>
        <strong>{c.outcomeLabel}:</strong> {c.before.outcome}
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.scriptHeader}>
        <span className={styles.dot} />
        {c.scriptLabel}
      </div>
      <ol className={styles.script}>
        {c.after.questions.map((q, i) => (
          <li key={i} className={styles.neutral}>
            <span className={`${styles.tag} ${styles.tagOk}`}>
              {c.tagNeutral}
            </span>
            <span>{q}</span>
          </li>
        ))}
      </ol>
      <div className={styles.outcome}>
        <strong>{c.outcomeLabel}:</strong> {c.after.outcome}
      </div>
    </div>
  );
}
