import { useRouter } from 'next/router';

import rawContent from './PositivityEffect.content';

import styles from './PositivityEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      {c.comments.map(cm => (
        <div key={cm.user} className={styles.comment}>
          <div className={styles.avatar}>{cm.user[0]}</div>
          <div className={styles.body}>
            <div className={styles.meta}>
              <span className={styles.userName}>{cm.user}</span>
              <span className={styles.time}>{cm.time}</span>
            </div>
            <p className={styles.text}>{cm.text}</p>
            <button className={styles.replyBtn}>{c.before.replyLabel}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      {c.comments.map(cm => (
        <div key={cm.user} className={styles.comment}>
          <div className={styles.avatar}>{cm.user[0]}</div>
          <div className={styles.body}>
            <div className={styles.meta}>
              <span className={styles.userName}>{cm.user}</span>
              <span className={styles.time}>{cm.time}</span>
            </div>
            <p className={styles.text}>{cm.text}</p>
            <div className={styles.reactions}>
              {c.after.reactions.map(r => (
                <button key={r.label} className={styles.reactionBtn}>
                  {r.emoji} <span>{r.label}</span>
                </button>
              ))}
              <button className={styles.replyLink}>{c.after.replyLabel}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
