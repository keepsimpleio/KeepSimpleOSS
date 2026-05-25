import { useRouter } from 'next/router';

import rawContent from './AppealToNovelty.content';

import styles from './AppealToNovelty.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.bannerIcon}>📋</div>
        <div className={styles.bannerBody}>
          <div className={styles.bannerTitle}>{c.before.title}</div>
          <div className={styles.bannerSub}>{c.before.sub}</div>
        </div>
        <button className={styles.bannerBtn}>{c.before.dismiss}</button>
      </div>
      <div className={styles.appShell}>
        <div className={styles.appNav}>
          {c.navItems.map(item => (
            <div
              key={item}
              className={`${styles.navItem} ${item === c.activeNav ? styles.navActive : ''}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.appContent}>
          <div className={styles.placeholder} />
          <div className={styles.placeholder} />
          <div className={styles.placeholder} />
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={`${styles.banner} ${styles.bannerNovelty}`}>
        <div className={styles.newBadge}>{c.after.newBadge}</div>
        <div className={styles.bannerBody}>
          <div className={styles.bannerTitle}>{c.after.title}</div>
          <div className={styles.bannerSub}>{c.after.sub}</div>
        </div>
        <button className={`${styles.bannerBtn} ${styles.bannerBtnCta}`}>
          {c.after.tryNow}
        </button>
      </div>
      <div className={styles.appShell}>
        <div className={styles.appNav}>
          {c.navItems.map(item => (
            <div
              key={item}
              className={`${styles.navItem} ${item === c.activeNav ? styles.navActive : ''}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.appContent}>
          <div className={styles.placeholder} />
          <div className={styles.placeholder} />
          <div className={styles.placeholder} />
        </div>
      </div>
    </div>
  );
}
