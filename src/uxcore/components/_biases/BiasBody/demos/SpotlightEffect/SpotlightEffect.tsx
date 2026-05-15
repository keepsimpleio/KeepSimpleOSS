import { useRouter } from 'next/router';

import rawContent from './SpotlightEffect.content';

import styles from './SpotlightEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardIcon}>{c.before.icon}</div>
        <h4 className={styles.title}>{c.title}</h4>
        <p className={styles.body}>
          {c.before.bodyPrefix} <strong>{c.before.bodyMembers}</strong>{' '}
          {c.before.bodySuffix}
        </p>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>{c.cancel}</button>
          <button className={styles.btnPrimary}>{c.postNow}</button>
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
        <div className={styles.cardIcon}>{c.after.icon}</div>
        <h4 className={styles.title}>{c.title}</h4>
        <div className={styles.statRow}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{c.after.stats[0].value}</div>
            <div className={styles.statLabel}>{c.after.stats[0].label}</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statValue}>{c.after.stats[1].value}</div>
            <div className={styles.statLabel}>{c.after.stats[1].label}</div>
          </div>
        </div>
        <p className={styles.body}>{c.after.body}</p>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>{c.cancel}</button>
          <button className={styles.btnPrimary}>{c.postNow}</button>
        </div>
      </div>
    </div>
  );
}
