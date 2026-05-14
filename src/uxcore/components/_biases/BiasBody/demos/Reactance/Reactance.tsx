import { useRouter } from 'next/router';

import rawContent from './Reactance.content';

import styles from './Reactance.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.lockIcon}>{c.before.lockIcon}</div>
          <h4 className={styles.title}>{c.before.title}</h4>
          <p className={styles.body}>
            {c.before.bodyStart}
            <strong>{c.before.bodyBold}</strong>
            {c.before.bodyEnd}
          </p>
          <button className={styles.btnForced}>{c.before.cta}</button>
          <div className={styles.noEscape}>{c.before.noEscape}</div>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.pageMock}>
        <div className={styles.pageContent}>
          <div className={styles.contentLine} />
          <div className={styles.contentLine} style={{ width: '70%' }} />
          <div className={styles.contentLine} style={{ width: '85%' }} />
        </div>
        <div className={styles.banner}>
          <div className={styles.bannerLeft}>
            <span className={styles.bannerTitle}>{c.after.bannerTitle}</span>
            <span className={styles.bannerSub}>{c.after.bannerSub}</span>
          </div>
          <div className={styles.bannerRight}>
            <button className={styles.btnSoft}>{c.after.seePlans}</button>
            <button className={styles.btnDismiss}>{c.after.dismiss}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
