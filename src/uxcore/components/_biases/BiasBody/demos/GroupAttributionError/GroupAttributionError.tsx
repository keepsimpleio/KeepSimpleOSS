import { useRouter } from 'next/router';

import rawContent from './GroupAttributionError.content';

import styles from './GroupAttributionError.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.form}>
        <label className={styles.label}>{c.nameLabel}</label>
        <input
          className={styles.input}
          type="text"
          placeholder={c.namePlaceholder}
        />
        <label className={styles.label}>{c.inviteLabel}</label>
        <input
          className={styles.input}
          type="text"
          placeholder={c.invitePlaceholder}
        />
        <button className={styles.btn}>{c.submitBtn}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.form}>
        <label className={styles.label}>{c.nameLabel}</label>
        <input
          className={styles.input}
          type="text"
          placeholder={c.namePlaceholder}
        />
        <label className={styles.label}>
          {c.after.missionLabel}{' '}
          <span className={styles.required}>{c.after.missionRequired}</span>
        </label>
        <input
          className={styles.input}
          type="text"
          placeholder={c.after.missionPlaceholder}
        />
        <label className={styles.label}>{c.after.valuesLabel}</label>
        <input
          className={styles.input}
          type="text"
          placeholder={c.after.valuesPlaceholder}
        />
        <div className={styles.badgePreview}>
          <div className={styles.identityBadge}>
            <span className={styles.badgeIcon}>&#x1F6E1;</span>
            <div>
              <div className={styles.badgeName}>{c.after.badgeName}</div>
              <div className={styles.badgeCount}>{c.after.badgeCount}</div>
            </div>
          </div>
          <span className={styles.badgeHint}>{c.after.badgeHint}</span>
        </div>
        <label className={styles.label}>{c.inviteLabel}</label>
        <input
          className={styles.input}
          type="text"
          placeholder={c.invitePlaceholder}
        />
        <button className={styles.btn}>{c.submitBtn}</button>
      </div>
    </div>
  );
}
