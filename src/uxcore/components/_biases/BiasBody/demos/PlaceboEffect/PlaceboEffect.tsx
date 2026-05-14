import { useRouter } from 'next/router';

import rawContent from './PlaceboEffect.content';

import styles from './PlaceboEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconRow}>
          <div className={styles.icon}>&#128246;</div>
        </div>
        <div className={styles.title}>{c.title}</div>
        <div className={styles.statusBanner}>
          <span className={styles.dot} />
          {c.statusText}
        </div>
        <p className={styles.body}>{c.before.body}</p>
        <div className={styles.speed}>
          <span className={styles.speedValue}>{c.before.speedValue}</span>
          <span className={styles.speedUnit}>{c.before.speedUnit}</span>
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
        <div className={styles.iconRow}>
          <div className={styles.icon}>&#128246;</div>
        </div>
        <div className={styles.title}>{c.title}</div>
        <div className={styles.statusBanner}>
          <span className={styles.dot} />
          {c.statusText}
        </div>
        <p className={styles.body}>{c.after.body}</p>
        <button className={styles.optimizeBtn}>&#9654; {c.after.runBtn}</button>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
          <div className={styles.progressSteps}>
            {c.after.steps.map(s => (
              <span
                key={s.label}
                className={s.state === 'done' ? styles.done : styles.active}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.result}>&#10003; {c.after.result}</div>
      </div>
    </div>
  );
}
