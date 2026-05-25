import { useRouter } from 'next/router';

import rawContent from './BackfireEffect.content';

import styles from './BackfireEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>{c.chatHeader}</div>
      <div className={styles.messages}>
        <div className={`${styles.bubble} ${styles.user}`}>{c.userMessage}</div>
        <div className={`${styles.bubble} ${styles.agent}`}>
          {c.before.agentReply}
        </div>
        <div className={styles.attachmentRow}>
          {c.before.attachments.map(a => (
            <span key={a} className={styles.attachment}>
              {a}
            </span>
          ))}
        </div>
        <div className={`${styles.bubble} ${styles.agent}`}>
          {c.before.followUp}
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>{c.chatHeader}</div>
      <div className={styles.messages}>
        <div className={`${styles.bubble} ${styles.user}`}>{c.userMessage}</div>
        <div className={`${styles.bubble} ${styles.agent}`}>
          {c.after.agentReply}
        </div>
        <div className={styles.activityCard}>
          {c.after.activity.map(row => (
            <div key={row.label} className={styles.activityRow}>
              <span>{row.label}</span>
              <span className={styles.amount}>{row.amount}</span>
            </div>
          ))}
        </div>
        <div className={`${styles.bubble} ${styles.agent}`}>
          {c.after.followUp}
        </div>
      </div>
    </div>
  );
}
