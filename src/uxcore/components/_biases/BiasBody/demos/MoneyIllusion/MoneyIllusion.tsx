import { useRouter } from 'next/router';

import rawContent from './MoneyIllusion.content';

import styles from './MoneyIllusion.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.before.title}</h4>
      <div className={styles.plans}>
        {c.before.plans.map(p => (
          <div
            key={p.name}
            className={`${styles.plan} ${p.featured ? styles.featured : ''}`}
          >
            <div className={styles.planName}>{p.name}</div>
            <div className={styles.price}>
              {p.price}
              <span>{p.unit}</span>
            </div>
            <ul className={styles.features}>
              {p.features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              className={`${styles.btn} ${p.featured ? styles.btnPrimary : ''}`}
            >
              {p.cta}
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
      <h4 className={styles.title}>{c.after.title}</h4>
      <div className={styles.plans}>
        {c.after.plans.map(p => (
          <div
            key={p.name}
            className={`${styles.plan} ${p.featured ? styles.featured : ''}`}
          >
            <div className={styles.planName}>{p.name}</div>
            <div className={styles.price}>
              {p.price}
              <span>{p.unit}</span>
            </div>
            {p.coffeeTag && (
              <div className={styles.coffeeTag}>{p.coffeeTag}</div>
            )}
            <div className={styles.annual}>{p.annual}</div>
            <ul className={styles.features}>
              {p.features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              className={`${styles.btn} ${p.featured ? styles.btnPrimary : ''}`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
