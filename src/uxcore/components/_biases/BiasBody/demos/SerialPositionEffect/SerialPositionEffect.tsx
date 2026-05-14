import { useRouter } from 'next/router';

import rawContent from './SerialPositionEffect.content';

import styles from './SerialPositionEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.version}>{c.version}</span>
          <span className={styles.date}>{c.date}</span>
        </div>
        <ul className={styles.notesList}>
          {c.before.notes.map(n => (
            <li
              key={n.text}
              className={n.bad ? styles.notesItemBad : styles.notesItem}
            >
              {n.text}
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
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.version}>{c.version}</span>
          <span className={styles.date}>{c.date}</span>
        </div>
        <ul className={styles.notesList}>
          {c.after.notes.map(n => (
            <li
              key={n.text}
              className={`${styles.notesItem} ${n.good ? styles.notesItemGood : ''}`}
            >
              {n.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
