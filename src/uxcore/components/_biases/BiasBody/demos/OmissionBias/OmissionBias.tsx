import { useRouter } from 'next/router';

import rawContent from './OmissionBias.content';

import styles from './OmissionBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.before.title}</h4>
      <div className={styles.card}>
        <div className={styles.planInfo}>
          <div className={styles.planName}>{c.before.planName}</div>
          <div className={styles.planPrice}>{c.before.planPrice}</div>
        </div>
        <div className={styles.actions}>
          <button className={styles.btn}>{c.before.changeBtn}</button>
          <button className={`${styles.btn} ${styles.btnDanger}`}>
            {c.before.cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.after.title}</h4>
      <div className={styles.breadcrumb}>{c.after.breadcrumb}</div>
      <div className={styles.menuList}>
        {c.after.menu.map(m => (
          <div
            key={m.label}
            className={
              m.active ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <span>{m.label}</span>
            <span className={styles.chevron}>&rsaquo;</span>
          </div>
        ))}
      </div>
      <div className={styles.subMenu}>
        <div className={styles.subTitle}>{c.after.subMenu1Title}</div>
        {c.after.subMenu1.map(m => (
          <div
            key={m.label}
            className={
              m.active ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <span>{m.label}</span>
            <span className={styles.chevron}>&rsaquo;</span>
          </div>
        ))}
      </div>
      <div className={styles.subMenu}>
        <div className={styles.subTitle}>{c.after.subMenu2Title}</div>
        {c.after.subMenu2.map(m => (
          <div
            key={m.label}
            className={
              m.danger ? `${styles.menuItem} ${styles.danger}` : styles.menuItem
            }
          >
            <span>{m.label}</span>
            <span className={styles.chevron}>&rsaquo;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
