import { useRouter } from 'next/router';

import rawContent from './FunctionalFixedness.content';

import styles from './FunctionalFixedness.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.toolbar}>
        {c.staticTools.map(t => (
          <button key={t} className={styles.tool}>
            {t}
          </button>
        ))}
        <div className={styles.toolsDropdown}>
          <button className={styles.toolTrigger}>
            {c.before.toolsTrigger}
          </button>
          <div className={styles.dropdown}>
            {c.before.dropdown.map(item => (
              <div key={item} className={styles.dropdownItem}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.table}>
        {c.files.map(f => (
          <div key={f.name} className={styles.tableRow}>
            <span>{f.name}</span>
            <span>{f.size}</span>
          </div>
        ))}
      </div>
      <p className={styles.note}>{c.before.note}</p>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.toolbar}>
        {c.staticTools.map(t => (
          <button key={t} className={styles.tool}>
            {t}
          </button>
        ))}
        <div className={styles.divider} />
        <button className={`${styles.tool} ${styles.toolExport}`}>
          {c.after.exportBtn}
        </button>
        <div className={styles.toolsDropdown}>
          <button className={styles.toolTrigger}>{c.after.toolsTrigger}</button>
          <div className={styles.dropdown}>
            {c.after.dropdown.map(item => (
              <div key={item.label} className={styles.dropdownItem}>
                <span className={styles.dropdownIcon}>{item.icon}</span>{' '}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.table}>
        {c.files.map(f => (
          <div key={f.name} className={styles.tableRow}>
            <span>{f.name}</span>
            <span>{f.size}</span>
          </div>
        ))}
      </div>
      <p className={styles.note}>{c.after.note}</p>
    </div>
  );
}
