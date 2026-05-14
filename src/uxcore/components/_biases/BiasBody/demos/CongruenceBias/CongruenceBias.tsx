import { useRouter } from 'next/router';

import rawContent from './CongruenceBias.content';

import styles from './CongruenceBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.label}>{c.hypothesis}</div>
      <div className={styles.quote}>&ldquo;{c.before.h}&rdquo;</div>
      <div className={styles.label}>{c.testing}</div>
      <div className={styles.variants}>
        {c.before.variants.map(v => (
          <div key={v.label} className={styles.variant}>
            <div className={styles.varTag}>{v.label}</div>
            <div className={styles.varDesc}>{v.desc}</div>
          </div>
        ))}
      </div>
      <div className={styles.verdict}>
        <span className={styles.check}>&#10003;</span> {c.before.verdict}
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.label}>{c.hypothesis}</div>
      <div className={styles.quote}>&ldquo;{c.after.h}&rdquo;</div>
      <div className={styles.label}>{c.testing}</div>
      <div className={styles.variants}>
        {c.after.variants.map(v => (
          <div
            key={v.label}
            className={`${styles.variant} ${v.kind === 'disconfirm' ? styles.disconfirm : ''}`}
          >
            <div className={styles.varTag}>{v.label}</div>
            <div className={styles.varDesc}>{v.desc}</div>
            <div className={styles.varKind}>{v.kindLabel}</div>
          </div>
        ))}
      </div>
      <div className={styles.verdict}>
        <span className={styles.check}>&#9888;</span> {c.after.verdict}
      </div>
    </div>
  );
}
