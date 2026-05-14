import { useRouter } from 'next/router';

import rawContent from './SerialRecall.content';

import styles from './SerialRecall.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.stepList}>
        {c.before.steps.map((s, i) => (
          <div
            key={s.n}
            className={`${styles.step} ${i === 0 ? styles.active : styles.pending}`}
          >
            <div className={styles.stepNum}>{s.n}</div>
            <div className={styles.stepLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.currentStep}>
        <p className={styles.currentLabel}>{c.before.currentLabel}</p>
        <input
          className={styles.input}
          type="email"
          placeholder={c.before.inputPlaceholder}
          readOnly
        />
      </div>
      <button className={styles.btnPrimary}>{c.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.progress}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: '25%' }} />
        </div>
        <span className={styles.progressLabel}>{c.after.progressLabel}</span>
      </div>
      <div className={styles.stepList}>
        {c.after.steps.map((s, i) => (
          <div
            key={s.n}
            className={`${styles.step} ${i === 0 ? styles.active : styles.pending}`}
          >
            <div className={styles.stepNum}>{s.n}</div>
            <div className={styles.stepLabel}>{s.label}</div>
            {i === 0 && (
              <span className={styles.stepCurrent}>{c.after.nowLabel}</span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.currentStep}>
        <p className={styles.currentLabel}>{c.after.currentLabel}</p>
        <input
          className={styles.input}
          type="text"
          placeholder={c.after.inputPlaceholder}
          readOnly
        />
      </div>
      <button className={styles.btnPrimary}>{c.cta}</button>
    </div>
  );
}
