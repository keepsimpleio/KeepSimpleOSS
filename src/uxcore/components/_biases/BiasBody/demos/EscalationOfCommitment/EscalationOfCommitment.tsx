import { useRouter } from 'next/router';

import rawContent from './EscalationOfCommitment.content';

import styles from './EscalationOfCommitment.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.iconWrap}>&#128218;</div>
      <h4 className={styles.title}>{c.before.title}</h4>
      <p className={styles.sub}>{c.before.sub}</p>
      <div className={styles.actions}>
        <button className={styles.btnDanger}>{c.before.cancel}</button>
        <button className={styles.btnSecondary}>{c.before.keep}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.iconWrap}>&#127942;</div>
      <h4 className={styles.title}>{c.after.title}</h4>
      <div className={styles.statRow}>
        {c.after.stats.map(s => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.progressWrap}>
        <div className={styles.progressLabel}>
          <span>{c.after.progressLabel}</span>
          <span>{c.after.progressValue}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '60%' }} />
        </div>
        <p className={styles.progressNote}>{c.after.progressNote}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnPrimary}>{c.after.keepGoing}</button>
        <button className={styles.btnGhost}>{c.after.cancel}</button>
      </div>
    </div>
  );
}
