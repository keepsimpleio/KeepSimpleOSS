import { useRouter } from 'next/router';

import rawContent from './NormalityBias.content';

import styles from './NormalityBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>{c.header}</div>
      <div className={styles.table}>
        {c.positions.map(p => (
          <div key={p.ticker} className={styles.row}>
            <div className={styles.ticker}>{p.ticker}</div>
            <div className={styles.shares}>
              {p.shares} {c.sharesSuffix}
            </div>
            <div className={styles.price}>{p.price}</div>
            <div className={p.down ? styles.changeDown : styles.changeUp}>
              {p.change}
            </div>
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
      <div className={styles.warningBanner}>
        <span className={styles.warnIcon}>&#9888;</span>
        <div>
          <div className={styles.warnTitle}>{c.after.warnTitle}</div>
          <div className={styles.warnSub}>{c.after.warnSub}</div>
        </div>
      </div>
      <div className={styles.stopLossBox}>
        <div className={styles.slLabel}>{c.after.slLabel}</div>
        <div className={styles.slOptions}>
          {c.after.slOptions.map(opt => (
            <button
              key={opt.label}
              className={`${styles.slBtn} ${opt.active ? styles.slBtnActive : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button className={styles.autoBtn}>
          <span>&#9654;</span> {c.after.autoBtn}
        </button>
      </div>
      <div className={styles.table}>
        {c.positions.map(p => (
          <div
            key={p.ticker}
            className={`${styles.row} ${p.down ? styles.rowAlert : ''}`}
          >
            <div className={styles.ticker}>{p.ticker}</div>
            <div className={styles.shares}>
              {p.shares} {c.sharesSuffix}
            </div>
            <div className={styles.price}>{p.price}</div>
            <div className={p.down ? styles.changeDown : styles.changeUp}>
              {p.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
