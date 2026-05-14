import { useRouter } from 'next/router';

import rawContent from './PlanningFallacy.content';

import styles from './PlanningFallacy.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.taskTitle}>{c.task}</div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>{c.estimateLabel}</div>
        <input readOnly value={c.before.estimate} className={styles.input} />
      </div>
      <button className={styles.cta}>{c.before.cta}</button>
      <div className={styles.aftermath}>
        <span className={styles.warnIcon}>&#9888;</span>
        <span>{c.before.aftermath}</span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.taskTitle}>{c.task}</div>
      <div className={styles.threePoint}>
        {c.after.points.map(p => (
          <div key={p.label} className={`${styles.point} ${styles[p.kind]}`}>
            <div className={styles.pointLabel}>{p.label}</div>
            <div className={styles.pointValue}>{p.value}</div>
            <div className={styles.pointMeta}>{p.meta}</div>
          </div>
        ))}
      </div>
      <div className={styles.history}>
        <div className={styles.historyHead}>{c.after.historyTitle}</div>
        <div className={styles.historyBars}>
          {c.after.history.map((h, i) => (
            <div key={i} className={styles.historyRow}>
              <div className={styles.historyName}>{h.name}</div>
              <div className={styles.historyBarWrap}>
                <div
                  className={styles.historyEst}
                  style={{ width: `${h.est}%` }}
                />
                <div
                  className={styles.historyActual}
                  style={{ width: `${h.actual}%` }}
                />
              </div>
              <div className={styles.historyLabel}>{h.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
