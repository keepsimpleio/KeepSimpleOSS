import { useRouter } from 'next/router';

import rawContent from './FadingAffectBias.content';

import styles from './FadingAffectBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.outageBanner}>
        <span className={styles.dot} />
        <div>
          <div className={styles.bannerTitle}>{c.before.bannerTitle}</div>
          <div className={styles.bannerSub}>{c.before.bannerSub}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>{c.before.sectionTitle}</div>
        {c.before.incidents.map(inc => (
          <div key={inc.name} className={styles.incident}>
            <span className={styles.incidentBadge}>{inc.badge}</span>
            <span className={styles.incidentName}>{inc.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.services}>
        {c.services.map(s => (
          <div key={s} className={styles.service}>
            <span>{s}</span>
            <span className={styles.statusDot} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.operationalBanner}>
        <span className={styles.dotGreen} />
        <div>
          <div className={styles.operationalTitle}>
            {c.after.operationalTitle}
          </div>
          <div className={styles.operationalSub}>{c.after.operationalSub}</div>
        </div>
      </div>

      <div className={styles.improvements}>
        <div className={styles.improvTitle}>{c.after.improvTitle}</div>
        {c.after.improvements.map(imp => (
          <div key={imp} className={styles.improvItem}>
            <span className={styles.improvIcon}>{c.after.improvIcon}</span>
            {imp}
          </div>
        ))}
      </div>

      <div className={styles.services}>
        {c.services.map(s => (
          <div key={s} className={styles.service}>
            <span>{s}</span>
            <span className={styles.statusDotGreen} />
          </div>
        ))}
      </div>

      <div className={styles.historyLink}>{c.after.historyLink}</div>
    </div>
  );
}
