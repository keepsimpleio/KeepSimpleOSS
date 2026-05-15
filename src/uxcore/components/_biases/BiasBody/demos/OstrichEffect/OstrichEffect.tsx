import { useRouter } from 'next/router';

import rawContent from './OstrichEffect.content';

import styles from './OstrichEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>{c.header}</div>
      <div className={styles.metricRow}>
        {c.before.metrics.map(metric => (
          <div key={metric.label} className={styles.metricCard}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValueBad}>{metric.value}</div>
            <div className={styles.metricSub}>{metric.sub}</div>
          </div>
        ))}
      </div>
      <div className={styles.alertBox}>
        <span className={styles.alertIcon}>&#9888;</span>
        {c.before.alertText}
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>{c.header}</div>
      <div className={styles.metricRow}>
        {c.after.metrics.map(metric => (
          <div key={metric.label} className={styles.metricCard}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValueOk}>{metric.value}</div>
            <div className={styles.metricSub}>
              <span className={styles.collapseLink}>{metric.link}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.softBox}>
        <span className={styles.softIcon}>&#128200;</span>
        <div>
          <div className={styles.softTitle}>{c.after.softTitle}</div>
          <div className={styles.softSub}>{c.after.softSub}</div>
        </div>
      </div>
    </div>
  );
}
