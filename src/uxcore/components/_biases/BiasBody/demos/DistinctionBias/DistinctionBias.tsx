import { useRouter } from 'next/router';

import rawContent from './DistinctionBias.content';

import styles from './DistinctionBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.row}>
        {c.plans.map(p => (
          <div key={p.name} className={`${styles.plan} ${styles.featured}`}>
            <div className={styles.planName}>{p.name}</div>
            <div className={styles.price}>
              {p.price}
              <span>{c.monthSuffix}</span>
            </div>
            <ul className={styles.features}>
              {p.features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              {c.cta}
            </button>
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
      <div className={styles.stack}>
        <div className={styles.plan}>
          <div className={styles.planName}>{c.plans[0].name}</div>
          <div className={styles.price}>
            {c.plans[0].price}
            <span>{c.monthSuffix}</span>
          </div>
          <ul className={styles.features}>
            {c.plans[0].features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.cta}
          </button>
        </div>
        <div className={styles.divider}>
          <span>{c.after.dividerText}</span>
        </div>
        <div className={styles.plan}>
          <div className={styles.planName}>{c.plans[1].name}</div>
          <div className={styles.price}>
            {c.plans[1].price}
            <span>{c.monthSuffix}</span>
          </div>
          <ul className={styles.features}>
            {c.plans[1].features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.cta}
          </button>
        </div>
      </div>
      <p className={styles.note}>{c.after.note}</p>
    </div>
  );
}
