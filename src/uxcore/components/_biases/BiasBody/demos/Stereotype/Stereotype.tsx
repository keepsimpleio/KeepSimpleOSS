import { useRouter } from 'next/router';

import rawContent from './Stereotype.content';

import styles from './Stereotype.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.greeting}>
        {c.before.greeting} <strong>{c.before.persona}</strong>
      </div>
      <div className={styles.subline}>{c.before.subline}</div>
      <div className={styles.modules}>
        {c.before.modules.map(m => (
          <div key={m.label} className={styles.module}>
            <span className={styles.icon}>{m.icon}</span>
            <span className={styles.modLabel}>{m.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.note}>{c.before.note}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.greeting}>
        {c.after.greeting} <strong>{c.after.persona}</strong>
      </div>
      <div className={styles.subline}>{c.after.subline}</div>
      <div className={styles.signals}>
        <div className={styles.signalsTitle}>{c.after.signalsTitle}</div>
        {c.after.signals.map(s => (
          <div key={s.label} className={styles.signal}>
            <span className={styles.signalLabel}>{s.label}</span>
            <span className={styles.signalValue}>{s.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.modules}>
        {c.after.modules.map(m => (
          <div key={m.label} className={`${styles.module} ${styles.matched}`}>
            <span className={styles.icon}>{m.icon}</span>
            <span className={styles.modLabel}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
