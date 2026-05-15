import { useRouter } from 'next/router';

import rawContent from './IllusionOfAsymmetricInsight.content';

import styles from './IllusionOfAsymmetricInsight.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.dot} />
        {c.before.channel}
      </div>
      <div className={styles.message}>
        <div className={styles.author}>{c.before.author}</div>
        <div className={styles.text}>{c.before.text}</div>
      </div>
      <div className={styles.assumption}>
        <span className={styles.assumeIcon}>&#129488;</span>
        <span>{c.before.assumption}</span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`${styles.dot} ${styles.dotOk}`} />
        {c.after.channel}
      </div>
      <div className={styles.template}>
        <div className={styles.tplTitle}>{c.after.tplTitle}</div>
        <div className={styles.tplFields}>
          {c.after.fields.map(f => (
            <div key={f.label} className={styles.tplField}>
              <div className={styles.tplLabel}>{f.label}</div>
              <div className={styles.tplValue}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.checkBack}>
        <span className={styles.checkIcon}>&#10067;</span>
        <span>
          <strong>{c.after.checkLabel}</strong> {c.after.check}
        </span>
      </div>
    </div>
  );
}
