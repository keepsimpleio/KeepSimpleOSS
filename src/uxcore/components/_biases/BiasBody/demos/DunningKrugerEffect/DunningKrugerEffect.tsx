import { useRouter } from 'next/router';

import rawContent from './DunningKrugerEffect.content';

import styles from './DunningKrugerEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.tableHeader}>
        {c.tableHeaders.map(h => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {c.rows.map(row => (
        <div key={row.name} className={styles.tableRow}>
          <span>{row.name}</span>
          <span>{row.email}</span>
          <span className={row.muted ? styles.badgeMuted : styles.badge}>
            {row.status}
          </span>
        </div>
      ))}
      <div className={styles.actions}>
        <button className={styles.btn}>{c.before.exportLabel}</button>
        <button className={styles.btn}>{c.before.importLabel}</button>
      </div>
      <p className={styles.hint}>{c.before.hint}</p>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.tableHeader}>
        {c.tableHeaders.map(h => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {c.rows.map(row => (
        <div key={row.name} className={styles.tableRow}>
          <span>{row.name}</span>
          <span>{row.email}</span>
          <span className={row.muted ? styles.badgeMuted : styles.badge}>
            {row.status}
          </span>
        </div>
      ))}
      <div className={styles.tooltip}>
        <span className={styles.tooltipIcon}>&#128161;</span>
        <div>
          <div className={styles.tooltipTitle}>{c.after.tooltipTitle}</div>
          <div className={styles.tooltipBody}>{c.after.tooltipBody}</div>
          <button className={styles.tooltipLink}>{c.after.tooltipLink}</button>
        </div>
      </div>
    </div>
  );
}
