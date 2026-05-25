import { useRouter } from 'next/router';

import rawContent from './OutGroupHomogeneity.content';

import styles from './OutGroupHomogeneity.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{c.title}</div>
      <div className={styles.bigBlob}>
        <div className={styles.blobLabel}>{c.before.label}</div>
        <div className={styles.blobCount}>{c.before.count}</div>
      </div>
      <div className={styles.message}>
        <div className={styles.messageHead}>{c.messageHead}</div>
        <div className={styles.messageBody}>
          &ldquo;{c.before.message}&rdquo;
        </div>
      </div>
      <div className={styles.metric}>
        <span>{c.before.metricLabel}</span>
        <span className={styles.metricBad}>{c.before.metricValue}</span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{c.title}</div>
      <div className={styles.segments}>
        {c.after.segments.map(s => (
          <div
            key={s.label}
            className={styles.segment}
            style={{ borderLeftColor: s.color }}
          >
            <div className={styles.segmentHead}>
              <span className={styles.segmentName}>{s.label}</span>
              <span className={styles.segmentCount}>{s.count}</span>
            </div>
            <div className={styles.segmentMessage}>
              &ldquo;{s.message}&rdquo;
            </div>
          </div>
        ))}
      </div>
      <div className={styles.metric}>
        <span>{c.after.metricLabel}</span>
        <span className={styles.metricGood}>{c.after.metricValue}</span>
      </div>
    </div>
  );
}
