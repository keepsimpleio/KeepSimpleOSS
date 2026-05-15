import { useRouter } from 'next/router';

import rawContent from './BiasBlindSpot.content';

import styles from './BiasBlindSpot.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.formTitle}>{c.title}</div>
      <div className={styles.candidate}>{c.candidate}</div>
      <textarea
        readOnly
        className={styles.textarea}
        value={c.before.feedback}
      />
      <div className={styles.scoreRow}>
        <span>{c.scoreLabel}</span>
        <span className={styles.scoreVal}>{c.before.score}</span>
      </div>
      <div className={styles.disclaimer}>{c.before.disclaimer}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.formTitle}>{c.title}</div>
      <div className={styles.candidate}>{c.candidate}</div>
      <div className={styles.rubric}>
        {c.after.criteria.map(cr => (
          <div key={cr.label} className={styles.criterion}>
            <div className={styles.criterionLabel}>{cr.label}</div>
            <div className={styles.criterionScore}>
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  className={n <= cr.value ? styles.dotOn : styles.dotOff}
                />
              ))}
            </div>
            <div className={styles.criterionEvidence}>{cr.evidence}</div>
          </div>
        ))}
      </div>
      <div className={styles.counterPrompt}>
        <strong>{c.after.counterLabel}</strong> {c.after.counter}
      </div>
    </div>
  );
}
