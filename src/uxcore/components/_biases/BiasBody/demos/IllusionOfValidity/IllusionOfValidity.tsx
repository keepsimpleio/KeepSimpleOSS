import { useRouter } from 'next/router';

import rawContent from './IllusionOfValidity.content';

import styles from './IllusionOfValidity.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.cardTitle}>{c.title}</div>
      <div className={styles.bigNumber}>
        {c.before.value}
        <span className={styles.bigUnit}>%</span>
      </div>
      <div className={styles.bigLabel}>{c.before.label}</div>
      <div className={styles.metaRow}>
        <div className={styles.metaPill}>{c.before.confidence}</div>
        <div className={styles.metaPill}>n = {c.before.sample}</div>
      </div>
      <button className={styles.cta}>{c.before.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.cardTitle}>{c.title}</div>
      <div className={styles.range}>
        <div className={styles.rangeLow}>{c.after.low}%</div>
        <div className={styles.rangeBar}>
          <div className={styles.rangeFill} />
          <div className={styles.rangePoint} />
        </div>
        <div className={styles.rangeHigh}>{c.after.high}%</div>
      </div>
      <div className={styles.bigLabel}>{c.after.label}</div>
      <div className={styles.metaRow}>
        <div className={`${styles.metaPill} ${styles.warn}`}>
          {c.after.confidence}
        </div>
        <div className={`${styles.metaPill} ${styles.warn}`}>
          n = {c.after.sample}
        </div>
      </div>
      <div className={styles.warning}>
        <strong>{c.after.warningTitle}</strong> {c.after.warningBody}
      </div>
    </div>
  );
}
