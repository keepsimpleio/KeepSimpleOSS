import { useRouter } from 'next/router';

import rawContent from './UnitBias.content';

import styles from './UnitBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h4 className={styles.title}>{c.title}</h4>
          <span className={styles.count}>{c.before.count}</span>
        </div>
        <div className={styles.list}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemDot} />
              <span className={styles.itemName}>
                {c.itemLabelPrefix}
                {String(i + 1).padStart(3, '0')}
              </span>
              <span className={styles.itemMeta}>{c.itemMeta}</span>
            </div>
          ))}
          <div className={styles.moreHint}>{c.before.moreHint}</div>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h4 className={styles.title}>{c.title}</h4>
          <span className={styles.pageLabel}>{c.after.pageLabel}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '16.7%' }} />
        </div>
        <div className={styles.list}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemDot} />
              <span className={styles.itemName}>
                {c.itemLabelPrefix}
                {String(i + 1).padStart(3, '0')}
              </span>
              <span className={styles.itemMeta}>{c.itemMeta}</span>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          <button className={styles.pageBtn} disabled>
            {c.after.prevBtn}
          </button>
          <span className={styles.pageInfo}>{c.after.pageInfo}</span>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
            {c.after.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
