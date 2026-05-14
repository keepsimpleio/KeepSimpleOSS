import { useRouter } from 'next/router';
import { Fragment } from 'react';

import rawContent from './IKEAEffect.content';

import styles from './IKEAEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.before.title}</h4>
      <p className={styles.sub}>{c.before.sub}</p>
      <div className={styles.templateGrid}>
        {c.before.templates.map(t => (
          <div
            key={t.name}
            className={`${styles.template} ${t.active ? styles.templateActive : ''}`}
          >
            <div className={styles.templateThumb}>{t.icon}</div>
            <div className={styles.templateName}>{t.name}</div>
          </div>
        ))}
      </div>
      <button className={styles.btnPrimary}>{c.before.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        {c.after.steps.map((s, i) => (
          <Fragment key={s.label}>
            <div className={styles.step}>
              <div
                className={`${styles.stepDot} ${s.status === 'done' ? styles.done : styles.active}`}
              >
                {s.marker}
              </div>
              <div className={styles.stepLabel}>{s.label}</div>
            </div>
            {i < c.after.steps.length - 1 && (
              <div className={styles.stepLine} />
            )}
          </Fragment>
        ))}
      </div>
      <div className={styles.siteNameWrap}>
        <label className={styles.label}>{c.after.label}</label>
        <input
          className={styles.input}
          type="text"
          defaultValue={c.after.defaultSiteName}
          readOnly
        />
      </div>
      <div className={styles.previewCard}>
        <div className={styles.previewDot} />
        <div className={styles.previewDot} />
        <div className={styles.previewDot} />
        <div className={styles.previewBar} />
        <div className={styles.previewHero}>{c.after.previewHero}</div>
      </div>
      <p className={styles.tagline}>{c.after.tagline}</p>
      <button className={styles.btnPrimary}>{c.after.cta}</button>
    </div>
  );
}
