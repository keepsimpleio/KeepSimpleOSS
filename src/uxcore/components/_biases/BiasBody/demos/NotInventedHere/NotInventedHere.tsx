import { useRouter } from 'next/router';

import rawContent from './NotInventedHere.content';

import styles from './NotInventedHere.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.cardHeader}>
        <span className={styles.tagBuild}>{c.before.tag}</span>
        <span className={styles.cardTitle}>{c.title}</span>
      </div>
      <ul className={styles.list}>
        {c.before.items.map((it, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.bullet}>&#8226;</span>
            {it}
          </li>
        ))}
      </ul>
      <div className={styles.cost}>
        <span>{c.costLabel}</span>
        <span className={styles.costBad}>{c.before.cost}</span>
      </div>
      <div className={styles.timeline}>
        <div className={styles.timelineLabel}>{c.timelineLabel}</div>
        <div className={styles.timelineBar}>
          <div className={styles.timelineFillRed} style={{ width: '100%' }} />
        </div>
        <div className={styles.timelineSub}>{c.before.timeline}</div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.cardHeader}>
        <span className={styles.tagIntegrate}>{c.after.tag}</span>
        <span className={styles.cardTitle}>{c.title}</span>
      </div>
      <ul className={styles.list}>
        {c.after.items.map((it, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.bulletOk}>&#10003;</span>
            {it}
          </li>
        ))}
      </ul>
      <div className={styles.cost}>
        <span>{c.costLabel}</span>
        <span className={styles.costGood}>{c.after.cost}</span>
      </div>
      <div className={styles.timeline}>
        <div className={styles.timelineLabel}>{c.timelineLabel}</div>
        <div className={styles.timelineBar}>
          <div className={styles.timelineFillGreen} style={{ width: '20%' }} />
        </div>
        <div className={styles.timelineSub}>{c.after.timeline}</div>
      </div>
    </div>
  );
}
