import { useRouter } from 'next/router';

import rawContent from './NegativityBias.content';

import styles from './NegativityBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.incidentHeader}>
          <span className={styles.incidentIcon}>{c.before.incidentIcon}</span>
          <div>
            <div className={styles.incidentTitle}>{c.before.incidentTitle}</div>
            <div className={styles.incidentTime}>{c.before.incidentTime}</div>
          </div>
        </div>
        <div className={styles.uptimeRow}>
          <span className={styles.uptimeLabel}>{c.before.uptimeLabel}</span>
          <span className={styles.uptimeValue}>{c.before.uptimeValue}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.detail}>
          <div className={styles.detailLabel}>{c.before.affectedLabel}</div>
          <div className={styles.detailValue}>{c.before.affectedValue}</div>
        </div>
        <div className={styles.detail}>
          <div className={styles.detailLabel}>{c.before.durationLabel}</div>
          <div className={styles.detailValue}>{c.before.durationValue}</div>
        </div>
      </div>
      <div className={styles.label}>{c.before.label}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.maintenanceHeader}>
          <span className={styles.maintenanceIcon}>
            {c.after.maintenanceIcon}
          </span>
          <div>
            <div className={styles.maintenanceTitle}>
              {c.after.maintenanceTitle}
            </div>
            <div className={styles.maintenanceTime}>
              {c.after.maintenanceTime}
            </div>
          </div>
        </div>
        <div className={styles.safetyBanner}>{c.after.safetyBanner}</div>
        <div className={styles.improvTitle}>{c.after.improvTitle}</div>
        <div className={styles.improvList}>
          {c.after.improvements.map(item => (
            <div key={item} className={styles.improvItem}>
              <span className={styles.check}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.label} ${styles.labelGood}`}>
        {c.after.label}
      </div>
    </div>
  );
}
