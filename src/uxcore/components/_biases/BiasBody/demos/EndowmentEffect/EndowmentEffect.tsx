import { useRouter } from 'next/router';

import rawContent from './EndowmentEffect.content';

import styles from './EndowmentEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.notifCard}>
        <div className={styles.notifIcon}>{c.icon}</div>
        <div className={styles.notifContent}>
          <div className={styles.notifTitle}>{c.before.title}</div>
          <div className={styles.notifBody}>{c.before.body}</div>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnPrimary}>{c.before.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.notifCard}>
        <div className={styles.notifIcon}>{c.icon}</div>
        <div className={styles.notifContent}>
          <div className={styles.notifTitle}>{c.after.title}</div>
          <div className={styles.notifBody}>{c.after.body}</div>
        </div>
      </div>
      <div className={styles.customList}>
        {c.after.customItems.map(item => (
          <div key={item.label} className={styles.customItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.previewBox}>{c.after.preview}</div>
      <div className={styles.actions}>
        <button className={styles.btnSecondary}>{c.after.keep}</button>
        <button className={styles.btnPrimary}>{c.after.switch}</button>
      </div>
    </div>
  );
}
