import { useRouter } from 'next/router';

import rawContent from './SubadditivityEffect.content';

import styles from './SubadditivityEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.cardBig}>
        <div className={styles.planName}>{c.before.plan}</div>
        <div className={styles.bigPrice}>
          {c.before.price}
          <span className={styles.bigUnit}>{c.before.suffix}</span>
        </div>
        <div className={styles.lump}>{c.before.lumpDesc}</div>
        <button className={styles.cta}>{c.before.cta}</button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.cardBig}>
        <div className={styles.planName}>{c.after.plan}</div>
        <div className={styles.breakdown}>
          {c.after.parts.map(p => (
            <div key={p.label} className={styles.part}>
              <span className={styles.partLabel}>{p.label}</span>
              <span className={styles.partValue}>{p.value}</span>
            </div>
          ))}
        </div>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>{c.after.totalLabel}</span>
          <span className={styles.totalValue}>
            {c.after.total}
            <span className={styles.unit}>{c.after.suffix}</span>
          </span>
        </div>
        <div className={styles.savings}>{c.after.savings}</div>
        <button className={styles.cta}>{c.after.cta}</button>
      </div>
    </div>
  );
}
