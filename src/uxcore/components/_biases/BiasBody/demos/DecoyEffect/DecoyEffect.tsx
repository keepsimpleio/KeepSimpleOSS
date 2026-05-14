import { useRouter } from 'next/router';

import rawContent from './DecoyEffect.content';

import styles from './DecoyEffect.module.scss';

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
        <div className={styles.plan}>
          <div className={styles.planName}>{c.basic.name}</div>
          <div className={styles.price}>
            {c.basic.price}
            <span>{c.basic.priceUnit}</span>
          </div>
          <ul className={styles.features}>
            {c.basic.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className={styles.btn}>{c.basic.cta}</button>
        </div>
        <div className={`${styles.plan} ${styles.featured}`}>
          <div className={styles.planName}>{c.premium.name}</div>
          <div className={styles.price}>
            {c.premium.price}
            <span>{c.premium.priceUnit}</span>
          </div>
          <ul className={styles.features}>
            {c.premium.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.premium.cta}
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
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.plans}>
        <div className={styles.plan}>
          <div className={styles.planName}>{c.basic.name}</div>
          <div className={styles.price}>
            {c.basic.price}
            <span>{c.basic.priceUnit}</span>
          </div>
          <ul className={styles.features}>
            {c.basic.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className={styles.btn}>{c.basic.cta}</button>
        </div>
        <div className={styles.plan}>
          <div className={styles.decoyTag}>{c.after.plus.decoyTag}</div>
          <div className={styles.planName}>{c.after.plus.name}</div>
          <div className={styles.price}>
            {c.after.plus.price}
            <span>{c.after.plus.priceUnit}</span>
          </div>
          <ul className={styles.features}>
            {c.after.plus.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className={styles.btn}>{c.after.plus.cta}</button>
        </div>
        <div className={`${styles.plan} ${styles.featured}`}>
          <div className={styles.badge}>{c.after.premiumBadge}</div>
          <div className={styles.planName}>{c.premium.name}</div>
          <div className={styles.price}>
            {c.premium.price}
            <span>{c.premium.priceUnit}</span>
          </div>
          <ul className={styles.features}>
            {c.premium.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.premium.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
