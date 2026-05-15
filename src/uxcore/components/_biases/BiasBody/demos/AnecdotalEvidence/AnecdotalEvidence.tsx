import { useRouter } from 'next/router';

import rawContent from './AnecdotalEvidence.content';

import styles from './AnecdotalEvidence.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.aggregate}>
        {c.before.stats.map(s => (
          <div key={s.label}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statValue}>{s.value}</span>
            </div>
            <div className={styles.barWrap}>
              <div className={styles.bar} style={{ width: s.barWidth }} />
            </div>
          </div>
        ))}
      </div>
      <p className={styles.note}>{c.before.note}</p>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.testimonialCard}>
        <div className={styles.quoteIcon}>&ldquo;</div>
        <p className={styles.quote}>{c.after.quote}</p>
        <div className={styles.person}>
          <div className={styles.avatar}>{c.after.avatar}</div>
          <div className={styles.personInfo}>
            <div className={styles.personName}>{c.after.personName}</div>
            <div className={styles.personRole}>{c.after.personRole}</div>
          </div>
          <div className={styles.logo}>
            {c.after.logoMain}
            <span>{c.after.logoSuffix}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
