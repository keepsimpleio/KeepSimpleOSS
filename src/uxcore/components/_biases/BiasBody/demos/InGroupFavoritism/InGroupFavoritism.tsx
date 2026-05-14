import { useRouter } from 'next/router';

import rawContent from './InGroupFavoritism.content';

import styles from './InGroupFavoritism.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.feedTitle}>{c.feedTitle}</h4>
      {c.posts.map(p => (
        <div key={p.user} className={styles.post}>
          <div className={styles.avatar}>{p.user[0]}</div>
          <div className={styles.postBody}>
            <div className={styles.postMeta}>
              <span className={styles.userName}>{p.user}</span>
              <span className={styles.time}>{p.time}</span>
            </div>
            <p className={styles.postText}>{p.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function After() {
  const c = useContent();
  const sorted = [...c.posts].sort(
    (a, b) => (b.inGroup ? 1 : 0) - (a.inGroup ? 1 : 0),
  );
  return (
    <div className={styles.container}>
      <h4 className={styles.feedTitle}>{c.feedTitle}</h4>
      {sorted.map((p, i) => (
        <div
          key={p.user}
          className={`${styles.post} ${p.inGroup ? styles.postHighlighted : ''}`}
        >
          <div
            className={`${styles.avatar} ${p.inGroup ? styles.avatarInGroup : ''}`}
          >
            {p.user[0]}
          </div>
          <div className={styles.postBody}>
            <div className={styles.postMeta}>
              <span className={styles.userName}>{p.user}</span>
              {p.inGroup && (
                <span className={styles.badge}>{c.after.badge}</span>
              )}
              <span className={styles.time}>{p.time}</span>
            </div>
            {i === 0 && (
              <div className={styles.communityLabel}>
                {c.after.communityLabel}
              </div>
            )}
            <p className={styles.postText}>{p.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
