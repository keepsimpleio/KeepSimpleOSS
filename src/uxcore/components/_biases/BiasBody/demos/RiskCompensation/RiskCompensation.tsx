import { useRouter } from 'next/router';

import rawContent from './RiskCompensation.content';

import styles from './RiskCompensation.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>{c.header}</div>
      <div className={styles.backupBanner}>
        <span className={styles.checkIcon}>&#10003;</span>
        <div>
          <div className={styles.backupTitle}>{c.backupTitle}</div>
          <div className={styles.backupSub}>{c.before.backupSub}</div>
        </div>
      </div>
      <div className={styles.actionSection}>
        <div className={styles.actionLabel}>{c.before.actionLabel}</div>
        <div className={styles.recordCount}>{c.before.recordCount}</div>
        <button className={styles.btnDanger}>{c.before.deleteBtn}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>{c.header}</div>
      <div className={styles.backupBanner}>
        <span className={styles.checkIcon}>&#10003;</span>
        <div>
          <div className={styles.backupTitle}>{c.backupTitle}</div>
          <div className={styles.backupSub}>{c.after.backupSub}</div>
        </div>
      </div>
      <div className={styles.warningCard}>
        <div className={styles.warnHeader}>
          <span className={styles.warnIcon}>&#9888;</span>
          {c.after.warnHeader}
        </div>
        <div className={styles.warnItem}>
          <span className={styles.warnDot} />
          {c.after.warnStart}
          <strong>{c.after.warnRecords}</strong>
        </div>
        <div className={styles.warnItem}>
          <span className={styles.warnDot} />
          {c.after.restoreStart}
          <strong>{c.after.restoreBold}</strong>
        </div>
        <div className={styles.warnItem}>
          <span className={styles.warnDot} />
          {c.after.unrecoverableStart}
          <strong>{c.after.unrecoverableBold}</strong>
          {c.after.unrecoverableEnd}
        </div>
        <div className={styles.actionRow}>
          <button className={styles.btnCancel}>{c.after.cancel}</button>
          <button className={styles.btnConfirm}>{c.after.confirm}</button>
        </div>
      </div>
    </div>
  );
}
