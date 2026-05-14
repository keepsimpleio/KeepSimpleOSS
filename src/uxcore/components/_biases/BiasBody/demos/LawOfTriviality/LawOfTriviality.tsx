import { useRouter } from 'next/router';

import rawContent from './LawOfTriviality.content';

import styles from './LawOfTriviality.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.head}>{c.head}</div>
      <div className={styles.thread}>
        {c.before.thread.map((m, i) => (
          <div key={i} className={styles.msg}>
            <div className={styles.author}>{m.author}</div>
            <div className={styles.text}>{m.text}</div>
          </div>
        ))}
        <div className={styles.dots}>&#183;&#183;&#183;</div>
        <div className={styles.summaryBad}>{c.before.summary}</div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.head}>{c.head}</div>
      <div className={styles.agenda}>
        {c.after.items.map((it, i) => (
          <div
            key={i}
            className={`${styles.agendaItem} ${it.kind === 'big' ? styles.itemBig : styles.itemSmall}`}
          >
            <div className={styles.timeBox}>{it.time}</div>
            <div className={styles.itemBody}>
              <div className={styles.itemTitle}>{it.title}</div>
              <div className={styles.itemNote}>{it.note}</div>
            </div>
            <div className={styles.kindLabel}>{it.kindLabel}</div>
          </div>
        ))}
      </div>
      <div className={styles.summaryGood}>{c.after.summary}</div>
    </div>
  );
}
