import { useRouter } from 'next/router';

import rawContent from './AnchoringEffect.content';

import styles from './AnchoringEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.plans}>
        {c.plans.map(p => (
          <div
            key={p.name}
            className={
              p.featured ? `${styles.plan} ${styles.featured}` : styles.plan
            }
          >
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
            <button
              className={
                p.featured ? `${styles.btn} ${styles.btnPrimary}` : styles.btn
              }
            >
              {c.selectBtn}
            </button>
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
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.plans}>
        {c.plans.map(p => (
          <div
            key={p.name}
            className={
              p.featured ? `${styles.plan} ${styles.featured}` : styles.plan
            }
          >
            {p.featured && (
              <div className={styles.badge}>{c.featuredBadge}</div>
            )}
            <div className={styles.planName}>{p.name}</div>
            <div className={styles.wasPrice}>{p.wasPrice}</div>
            <div className={styles.price}>
              {p.price}
              <span>{c.monthSuffix}</span>
            </div>
            <ul className={styles.features}>
              {p.features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              className={
                p.featured ? `${styles.btn} ${styles.btnPrimary}` : styles.btn
              }
            >
              {c.selectBtn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
