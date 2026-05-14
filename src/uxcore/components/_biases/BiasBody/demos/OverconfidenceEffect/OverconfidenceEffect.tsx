import { useRouter } from 'next/router';

import rawContent from './OverconfidenceEffect.content';

import styles from './OverconfidenceEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.question}>{c.question}</div>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>{c.before.label}</div>
        <input readOnly className={styles.input} value={c.before.value} />
      </div>
      <div className={styles.confidence}>
        <span>{c.before.confidenceLabel}</span>
        <span className={styles.confidenceVal}>{c.before.confidenceValue}</span>
      </div>
      <div className={styles.calibration}>
        <span className={styles.warnIcon}>&#9888;</span>
        <span>{c.before.calibration}</span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.question}>{c.question}</div>
      <div className={styles.intervalLabel}>{c.after.intervalLabel}</div>
      <div className={styles.intervalRow}>
        <div className={styles.bound}>
          <div className={styles.boundLabel}>{c.after.lowLabel}</div>
          <input
            className={styles.boundInput}
            readOnly
            value={c.after.lowValue}
          />
        </div>
        <div className={styles.bound}>
          <div className={styles.boundLabel}>{c.after.highLabel}</div>
          <input
            className={styles.boundInput}
            readOnly
            value={c.after.highValue}
          />
        </div>
      </div>
      <div className={styles.rules}>
        {c.after.rules.map(r => (
          <div key={r} className={styles.rule}>
            <span className={styles.bulletOk}>&#10003;</span>
            {r}
          </div>
        ))}
      </div>
      <div className={styles.calibrationOk}>
        <span className={styles.checkIcon}>&#127919;</span>
        <span>{c.after.calibration}</span>
      </div>
    </div>
  );
}
