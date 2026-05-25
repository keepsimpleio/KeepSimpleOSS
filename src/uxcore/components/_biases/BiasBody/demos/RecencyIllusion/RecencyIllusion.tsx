import { useRouter } from 'next/router';

import rawContent from './RecencyIllusion.content';

import styles from './RecencyIllusion.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.appShell}>
        <div className={styles.sidebar}>
          {c.sidebarItems.map(item => (
            <div
              key={item}
              className={`${styles.sidebarItem} ${item === c.activeItem ? styles.sidebarActive : ''}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.main}>
          <div className={styles.mainTitle}>{c.mainTitle}</div>
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
      <div className={styles.spotlightBanner}>
        <div className={styles.spotlightLeft}>
          <span className={styles.newBadge}>{c.after.newBadge}</span>
          <div className={styles.spotlightTitle}>{c.after.spotlightTitle}</div>
          <div className={styles.spotlightSub}>{c.after.spotlightSub}</div>
        </div>
        <button className={styles.tryBtn}>{c.after.tryBtn}</button>
      </div>
      <div className={styles.appShell}>
        <div className={styles.sidebar}>
          {c.after.sidebarItems.map(item => {
            if (item === c.after.highlightedItem) {
              return (
                <div
                  key={item}
                  className={`${styles.sidebarItem} ${styles.sidebarHighlight}`}
                >
                  {item}
                  <span className={styles.sidebarBadge}>
                    {c.after.newBadge}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={item}
                className={`${styles.sidebarItem} ${item === c.activeItem ? styles.sidebarActive : ''}`}
              >
                {item}
              </div>
            );
          })}
        </div>
        <div className={styles.main}>
          <div className={styles.mainTitle}>{c.mainTitle}</div>
          <div className={styles.placeholder} />
          <div className={styles.placeholder} />
        </div>
      </div>
    </div>
  );
}
