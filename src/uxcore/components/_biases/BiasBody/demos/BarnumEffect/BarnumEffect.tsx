import { useRouter } from 'next/router';

import rawContent from './BarnumEffect.content';

import styles from './BarnumEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.scoreRow}>
          <span className={styles.scoreBig}>{c.score}</span>
          <span className={styles.scoreMax}>{c.scoreMax}</span>
        </div>
        <div className={styles.label}>{c.before.label}</div>
        <div className={styles.areas}>
          {c.before.areas.map(a => (
            <div key={a.name} className={styles.areaRow}>
              <span className={styles.areaName}>{a.name}</span>
              <div className={styles.barWrap}>
                <div className={styles.bar} style={{ width: a.pct }} />
              </div>
              <span className={styles.areaPct}>{a.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.scoreRow}>
          <span className={styles.scoreBig}>{c.score}</span>
          <span className={styles.scoreMax}>{c.scoreMax}</span>
        </div>
        <div className={styles.label}>{c.after.label}</div>
        <div className={styles.insights}>
          {c.after.insights.map(ins => (
            <div key={ins.text} className={styles.insight}>
              <span className={styles.insightIcon}>{ins.icon}</span>
              <span>{ins.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
