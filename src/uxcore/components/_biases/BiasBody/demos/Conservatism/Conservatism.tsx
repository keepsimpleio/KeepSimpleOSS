import { useRouter } from 'next/router';

import rawContent from './Conservatism.content';

import styles from './Conservatism.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroIcon}>&#9889;</div>
        <h4 className={styles.heroTitle}>{c.before.heroTitle}</h4>
        <p className={styles.heroSub}>{c.before.heroSub}</p>
      </div>
      <div className={styles.stepList}>
        {c.before.steps.map((step, i) => (
          <div key={step} className={styles.step}>
            <span className={styles.stepNum}>{i + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
      <button className={styles.btnPrimary}>{c.before.btn}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.welcomeBadge}>
        <span className={styles.badgeIcon}>&#10003;</span> {c.after.badgeText}
      </div>
      <h4 className={styles.title}>{c.after.title}</h4>
      <p className={styles.sub}>{c.after.sub}</p>
      <div className={styles.featureRow}>
        {c.after.features.map(f => (
          <div
            key={f.label}
            className={
              f.isNew
                ? `${styles.featureCard} ${styles.featureNew}`
                : styles.featureCard
            }
          >
            <div className={styles.featureLabel}>{f.label}</div>
            <div className={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
      <p className={styles.hint}>{c.after.hint}</p>
      <button className={styles.btnPrimary}>{c.after.btn}</button>
    </div>
  );
}
