import { useRouter } from 'next/router';

import rawContent from './MillersLaw.content';

import styles from './MillersLaw.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>{c.sidebarTitle}</div>
        <ul className={styles.flatList}>
          {c.before.links.map(link => (
            <li key={link} className={styles.flatItem}>
              {link}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>{c.sidebarTitle}</div>
        {c.after.grouped.map(({ section, items }) => (
          <div key={section} className={styles.group}>
            <div className={styles.groupLabel}>{section}</div>
            <ul className={styles.groupList}>
              {items.map(item => (
                <li key={item} className={styles.groupItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
