import { useRouter } from 'next/router';

import rawContent from './ConfirmationBias.content';

import styles from './ConfirmationBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.pageTitle}>{c.before.pageTitle}</h4>
      <div className={styles.settingsList}>
        {c.before.settings.map(setting => (
          <div key={setting.label} className={styles.settingRow}>
            <span className={styles.settingLabel}>{setting.label}</span>
            {setting.type === 'button' ? (
              <button className={styles.btn}>{setting.action}</button>
            ) : (
              <div className={styles.toggle} />
            )}
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
      <div className={styles.statusBanner}>
        <div className={styles.statusIcon}>{c.after.statusIcon}</div>
        <div className={styles.statusText}>
          <div className={styles.statusTitle}>{c.after.statusTitle}</div>
          <div className={styles.statusSub}>{c.after.statusSub}</div>
        </div>
      </div>
      <div className={styles.indicators}>
        {c.after.indicators.map(indicator => (
          <div key={indicator} className={styles.indicator}>
            <span className={styles.dot} />
            <span>{indicator}</span>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <a className={styles.link} href="#">
          {c.after.footerLinks[0]}
        </a>
        <span className={styles.sep}>{c.after.sep}</span>
        <a className={styles.link} href="#">
          {c.after.footerLinks[1]}
        </a>
      </div>
    </div>
  );
}
