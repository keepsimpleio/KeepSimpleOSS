import { useRouter } from 'next/router';

import rawContent from './EmpathyGap.content';

import styles from './EmpathyGap.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <div className={styles.botDot} />
        {c.header}
      </div>
      <div className={styles.messages}>
        <div className={`${styles.bubble} ${styles.user}`}>{c.userMessage}</div>
        <div className={`${styles.bubble} ${styles.bot}`}>
          {c.before.botMessage}
        </div>
        <div className={styles.formPrompt}>
          <input
            className={styles.input}
            placeholder={c.before.accountIdPlaceholder}
            readOnly
          />
          <input
            className={styles.input}
            placeholder={c.before.errorCodePlaceholder}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <div className={styles.botDot} />
        {c.header}
      </div>
      <div className={styles.messages}>
        <div className={`${styles.bubble} ${styles.user}`}>{c.userMessage}</div>
        <div className={`${styles.bubble} ${styles.bot}`}>
          {c.after.botMessage}
        </div>
        <div className={styles.quickActions}>
          <div className={styles.actionLabel}>{c.after.actionLabel}</div>
          {c.after.actions.map(a => (
            <button key={a} className={styles.actionBtn}>
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
