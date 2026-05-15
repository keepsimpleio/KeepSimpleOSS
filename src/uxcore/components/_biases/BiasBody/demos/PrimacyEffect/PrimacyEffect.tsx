import { useRouter } from 'next/router';

import rawContent from './PrimacyEffect.content';

import styles from './PrimacyEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.logo}>{c.before.logo}</div>
      <h4 className={styles.title}>{c.before.title}</h4>
      <ul className={styles.featureList}>
        {c.before.features.map(f => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button className={styles.btnPrimary}>{c.before.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.avatarRow}>
        <div className={styles.avatar}>{c.after.avatar}</div>
        <div className={styles.avatarLabel}>{c.after.avatarLabel}</div>
      </div>
      <h4 className={styles.title}>{c.after.title}</h4>
      <p className={styles.hook}>
        {c.after.hookStart}
        <strong>{c.after.hookBold}</strong>
      </p>
      <div className={styles.proofRow}>
        {c.after.proof.map(p => (
          <div key={p.label} className={styles.proofItem}>
            <div className={styles.proofValue}>{p.value}</div>
            <div className={styles.proofLabel}>{p.label}</div>
          </div>
        ))}
      </div>
      <button className={styles.btnPrimary}>{c.after.cta}</button>
    </div>
  );
}
