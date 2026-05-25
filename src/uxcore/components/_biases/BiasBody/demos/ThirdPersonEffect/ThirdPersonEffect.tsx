import { useRouter } from 'next/router';

import rawContent from './ThirdPersonEffect.content';

import styles from './ThirdPersonEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.email}>
        <div className={styles.emailMeta}>
          <div className={styles.from}>{c.before.from}</div>
          <div className={styles.subject}>{c.before.subject}</div>
        </div>
        <div className={styles.emailBody}>
          <div className={styles.heroBanner}>{c.before.heroBanner}</div>
          <p className={styles.hype}>{c.before.hype}</p>
          <div className={styles.dealBox}>
            <div className={styles.dealLabel}>{c.before.dealLabel}</div>
            <div className={styles.dealPrice}>{c.before.dealPrice}</div>
          </div>
          <button className={styles.btnHype}>{c.before.cta}</button>
          <p className={styles.urgency}>{c.before.urgency}</p>
        </div>
      </div>
      <div className={styles.label}>{c.before.label}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.email}>
        <div className={styles.emailMeta}>
          <div className={styles.from}>{c.after.from}</div>
          <div className={styles.subject}>{c.after.subject}</div>
        </div>
        <div className={styles.emailBody}>
          <p className={styles.greeting}>{c.after.greeting}</p>
          <p className={styles.intro}>{c.after.intro}</p>
          <div className={styles.changeList}>
            {c.after.changes.map(change => (
              <div key={change.title} className={styles.change}>
                <div className={styles.changeTitle}>{change.title}</div>
                <div className={styles.changeSub}>{change.sub}</div>
              </div>
            ))}
          </div>
          <div className={styles.statsRow}>
            {c.after.stats.map(stat => (
              <div key={stat.label} className={styles.stat}>
                <strong>{stat.num}</strong> {stat.label}
              </div>
            ))}
          </div>
          <button className={styles.btnClean}>{c.after.cta}</button>
        </div>
      </div>
      <div className={`${styles.label} ${styles.labelGood}`}>
        {c.after.label}
      </div>
    </div>
  );
}
