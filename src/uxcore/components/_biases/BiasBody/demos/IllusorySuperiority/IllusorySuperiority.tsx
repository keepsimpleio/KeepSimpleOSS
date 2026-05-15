import { useRouter } from 'next/router';

import rawContent from './IllusorySuperiority.content';

import styles from './IllusorySuperiority.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>{c.before.header}</div>
      <div className={styles.statsRow}>
        {c.before.stats.map(s => (
          <div key={s.lbl} className={styles.statBox}>
            <div className={styles.statVal}>{s.val}</div>
            <div className={styles.statLbl}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <button className={styles.btn}>{c.before.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  const pct = 74;

  return (
    <div className={styles.container}>
      <div className={styles.crushBanner}>{c.after.crushBanner}</div>
      <div className={styles.statsRow}>
        {c.after.stats.map(s => (
          <div key={s.lbl} className={styles.statBox}>
            <div className={styles.statVal}>{s.val}</div>
            <div className={styles.statLbl}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className={styles.compareSection}>
        <div className={styles.compareLabel}>
          {c.after.compareLabelStart}
          <strong>{pct}%</strong>
          {c.after.compareLabelEnd}
        </div>
        <div className={styles.chartBar}>
          <div className={styles.chartFill} style={{ width: `${pct}%` }} />
          <div className={styles.chartMarker} style={{ left: `${pct}%` }}>
            <span className={styles.markerLabel}>{c.after.markerLabel}</span>
          </div>
        </div>
      </div>
      <div className={styles.streakBadge}>
        <span>&#127942;</span> {c.after.streakText}
      </div>
      <button className={styles.btnPrimary}>{c.after.cta}</button>
    </div>
  );
}
