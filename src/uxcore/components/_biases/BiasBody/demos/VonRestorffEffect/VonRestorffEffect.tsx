import { useRouter } from 'next/router';

import rawContent from './VonRestorffEffect.content';

import styles from './VonRestorffEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>{c.logo}</div>
        <div className={styles.navItems}>
          {c.navItems.map(item => (
            <div key={item} className={styles.navItem}>
              {item}
            </div>
          ))}
        </div>
      </nav>
      <div className={styles.pageBody}>
        <div className={styles.placeholder} />
        <div className={styles.placeholder} />
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>{c.logo}</div>
        <div className={styles.navItems}>
          {c.navItems.map(item =>
            item === c.after.highlightedItem ? (
              <div
                key={item}
                className={`${styles.navItem} ${styles.navItemHighlight}`}
              >
                {item}
                <span className={styles.newBadge}>{c.after.newBadge}</span>
              </div>
            ) : (
              <div key={item} className={styles.navItem}>
                {item}
              </div>
            ),
          )}
        </div>
      </nav>
      <div className={styles.pageBody}>
        <div className={styles.placeholder} />
        <div className={styles.placeholder} />
      </div>
    </div>
  );
}
