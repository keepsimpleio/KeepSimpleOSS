import { useRouter } from 'next/router';

import rawContent from './ClusteringIllusion.content';

import styles from './ClusteringIllusion.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.appIcon}>{c.appIcon}</span>
        <div>
          <div className={styles.appName}>{c.appName}</div>
          <div className={styles.schedule}>{c.before.schedule}</div>
        </div>
      </div>
      <div className={styles.list}>
        {c.before.notifications.map((n, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.dayBadge}>{n.day}</div>
            <div className={styles.content}>
              <div className={styles.msg}>{n.msg}</div>
              <div className={styles.time}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.note}>{c.before.note}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.appIcon}>{c.appIcon}</span>
        <div>
          <div className={styles.appName}>{c.appName}</div>
          <div className={styles.schedule}>{c.after.schedule}</div>
        </div>
      </div>
      <div className={styles.list}>
        {c.after.notifications.map((n, i) => (
          <div key={i} className={`${styles.item} ${styles.itemRandom}`}>
            <div className={`${styles.dayBadge} ${styles.gapBadge}`}>
              {n.gap}
            </div>
            <div className={styles.content}>
              <div className={styles.msg}>{n.msg}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={`${styles.note} ${styles.noteGood}`}>{c.after.note}</div>
    </div>
  );
}
