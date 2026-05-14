import { useRouter } from 'next/router';

import rawContent from './ContinuedInfluenceEffect.content';

import styles from './ContinuedInfluenceEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.appBar}>
        <span className={styles.appName}>{c.appName}</span>
        <span className={styles.updateBadge}>{c.updateBadge}</span>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroIcon}>&#128167;</div>
        <div className={styles.heroValue}>{c.before.heroValue}</div>
        <div className={styles.heroSub}>{c.before.heroSub}</div>
      </div>
      <div className={styles.goalRow}>
        <div className={styles.goalCard}>
          <div className={styles.goalLabel}>{c.before.goalLabel1}</div>
          <div className={styles.goalValue}>{c.before.goalValue1}</div>
        </div>
        <div className={styles.goalCard}>
          <div className={styles.goalLabel}>{c.before.goalLabel2}</div>
          <div className={styles.goalValue}>{c.before.goalValue2}</div>
        </div>
      </div>
      <p className={styles.note}>&#9888; {c.before.note}</p>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.appBar}>
        <span className={styles.appName}>{c.appName}</span>
        <span className={styles.updateBadge}>{c.updateBadge}</span>
      </div>
      <div className={styles.updateCard}>
        <div className={styles.updateTitle}>{c.after.updateTitle}</div>
        <div className={styles.comparison}>
          <div className={styles.compBefore}>
            <div className={styles.compLabel}>{c.after.prevLabel}</div>
            <div className={styles.compValue}>{c.after.prevValue}</div>
            <div className={styles.compNote}>{c.after.prevNote}</div>
          </div>
          <div className={styles.arrow}>&#8594;</div>
          <div className={styles.compAfter}>
            <div className={styles.compLabel}>{c.after.nowLabel}</div>
            <div className={styles.compValue}>{c.after.nowValue}</div>
            <div className={styles.compNote}>{c.after.nowNote}</div>
          </div>
        </div>
        <p className={styles.explanation}>{c.after.explanation}</p>
        <button className={styles.learnMore}>{c.after.learnMore}</button>
      </div>
    </div>
  );
}
