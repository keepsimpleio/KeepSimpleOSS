import { useRouter } from 'next/router';

import rawContent from './SubjectiveValidation.content';

import styles from './SubjectiveValidation.module.scss';

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
        <label className={styles.label}>{c.emailLabel}</label>
        <input
          className={styles.input}
          type="email"
          placeholder={c.emailPlaceholder}
        />
        <label className={styles.label}>{c.passwordLabel}</label>
        <input
          className={styles.input}
          type="password"
          placeholder={c.passwordPlaceholder}
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
        <label className={styles.label}>{c.emailLabel}</label>
        <input
          className={styles.input}
          type="email"
          placeholder={c.emailPlaceholder}
        />
        <label className={styles.label}>{c.passwordLabel}</label>
        <input
          className={styles.input}
          type="password"
          placeholder={c.passwordPlaceholder}
        />
        <label className={styles.checkboxRow}>
          <input className={styles.checkbox} type="checkbox" defaultChecked />
          <span className={styles.checkboxLabel}>{c.after.checkboxLabel}</span>
        </label>
        <button className={styles.btn}>{c.submitBtn}</button>
      </div>
      <div className={styles.confirmation}>
        <div className={styles.confirmIcon}>&#x1F30D;</div>
        <div className={styles.confirmText}>
          <strong>{c.after.confirmTitle}</strong>
          <span>{c.after.confirmSub}</span>
        </div>
      </div>
    </div>
  );
}
