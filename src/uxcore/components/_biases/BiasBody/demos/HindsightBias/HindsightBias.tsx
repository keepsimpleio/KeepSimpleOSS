import { useRouter } from 'next/router';

import rawContent from './HindsightBias.content';

import styles from './HindsightBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.statusRow}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>{c.status}</span>
          <span className={styles.duration}>{c.duration}</span>
        </div>
        <h4 className={styles.title}>{c.title}</h4>
        {c.before.sections.map(section => (
          <div key={section.label} className={styles.section}>
            <div className={styles.sectionLabel}>{section.label}</div>
            <p className={styles.sectionBody}>{section.body}</p>
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
      <div className={styles.card}>
        <div className={styles.statusRow}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>{c.status}</span>
          <span className={styles.duration}>{c.duration}</span>
        </div>
        <h4 className={styles.title}>{c.title}</h4>
        <div className={styles.timeline}>
          <div className={styles.timelineLabel}>{c.after.timelineLabel}</div>
          {c.after.events.map(e => (
            <div
              key={e.time}
              className={`${styles.tlRow} ${e.ambiguous ? styles.tlAmbiguous : styles.tlCritical}`}
            >
              <span className={styles.tlTime}>{e.time}</span>
              <span className={styles.tlMsg}>{e.msg}</span>
            </div>
          ))}
          <p className={styles.tlNote}>{c.after.tlNote}</p>
        </div>
        <div className={styles.adding}>
          <div className={styles.addingLabel}>{c.after.addingLabel}</div>
          <ul className={styles.addingList}>
            {c.after.addingList.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
