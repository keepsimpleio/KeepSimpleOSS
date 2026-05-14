import { useRouter } from 'next/router';

import rawContent from './AttentionalBias.content';

import styles from './AttentionalBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>{c.avatar}</div>
        <div className={styles.profileInfo}>
          <div className={styles.name}>{c.name}</div>
          <div className={styles.meta}>{c.memberSince}</div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>{c.before.progressLabel}</div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: c.before.progressPct }}
          />
        </div>
        <div className={styles.progressText}>{c.before.progressText}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>{c.before.statusLabel}</div>
        <div className={styles.statusRow}>
          <span className={styles.statusBadge}>{c.before.statusBadge}</span>
          <span className={styles.meta}>{c.before.tier}</span>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>{c.avatar}</div>
        <div className={styles.profileInfo}>
          <div className={styles.name}>{c.name}</div>
          <div className={styles.meta}>{c.memberSince}</div>
        </div>
      </div>
      <div className={styles.metricsGrid}>
        {c.after.metrics.map(m => (
          <div key={m.label} className={styles.metricCard}>
            <div
              className={
                m.variant === 'rank'
                  ? `${styles.metricValue} ${styles.rankValue}`
                  : m.variant === 'streak'
                    ? `${styles.metricValue} ${styles.streakValue}`
                    : styles.metricValue
              }
            >
              {m.value}
            </div>
            <div className={styles.metricLabel}>{m.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.streakBar}>
        <span className={styles.fire}>&#128293;</span>
        <span className={styles.streakMsg}>{c.after.streakMsg}</span>
      </div>
    </div>
  );
}
