import { useRouter } from 'next/router';

import rawContent from './AutomationBias.content';

import styles from './AutomationBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.sectionLabel}>{c.sectionLabel}</div>
      <div className={styles.comment}>
        <div className={styles.commentHeader}>
          <div className={styles.authorDot} />
          <span className={styles.author}>{c.aiAuthor}</span>
          <span className={styles.line}>{c.beforeAiLine}</span>
        </div>
        <p className={styles.commentBody}>{c.aiSuggestion}</p>
      </div>
      {c.comments.map(cm => (
        <div key={cm.author} className={styles.comment}>
          <div className={styles.commentHeader}>
            <div className={styles.authorDot} />
            <span className={styles.author}>{cm.author}</span>
            <span className={styles.line}>{cm.line}</span>
          </div>
          <p className={styles.commentBody}>{cm.body}</p>
        </div>
      ))}
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.sectionLabel}>{c.sectionLabel}</div>
      <div className={`${styles.comment} ${styles.aiComment}`}>
        <div className={styles.aiHeader}>
          <div className={styles.shield}>&#9646;</div>
          <span className={styles.aiLabel}>{c.after.aiLabel}</span>
          <span className={styles.confidence}>{c.after.confidence}</span>
          <span className={styles.checkmark}>&#10003;</span>
        </div>
        <p className={styles.commentBody}>{c.aiSuggestion}</p>
        <div className={styles.aiFooter}>{c.after.aiFooter}</div>
      </div>
      {c.comments.map(cm => (
        <div key={cm.author} className={styles.comment}>
          <div className={styles.commentHeader}>
            <div className={styles.authorDot} />
            <span className={styles.author}>{cm.author}</span>
            <span className={styles.line}>{cm.line}</span>
          </div>
          <p className={styles.commentBody}>{cm.body}</p>
        </div>
      ))}
    </div>
  );
}
