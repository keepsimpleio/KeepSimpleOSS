import { useRouter } from 'next/router';

import rawContent from './ContrastEffect.content';

import styles from './ContrastEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.before.title}</h4>
      <div className={styles.single}>
        <div className={styles.card}>
          <div className={styles.img}>{c.img}</div>
          <div className={styles.cardBody}>
            <div className={styles.productName}>{c.before.productName}</div>
            <div className={styles.productDesc}>{c.before.productDesc}</div>
            <div className={styles.productPrice}>{c.before.productPrice}</div>
            <button className={styles.btn}>{c.addToCart}</button>
          </div>
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
      <div className={styles.row}>
        {c.after.products.map(p => (
          <div
            key={p.name}
            className={
              p.variant === 'budget'
                ? `${styles.card} ${styles.budget}`
                : p.variant === 'featured'
                  ? `${styles.card} ${styles.featured}`
                  : `${styles.card} ${styles.premium}`
            }
          >
            {p.variant === 'featured' && (
              <div className={styles.featuredBadge}>
                {c.after.featuredBadge}
              </div>
            )}
            <div className={styles.img}>{c.img}</div>
            <div className={styles.cardBody}>
              <div className={styles.productName}>{p.name}</div>
              <div className={styles.productDesc}>{p.desc}</div>
              <div className={styles.productPrice}>{p.price}</div>
              <button
                className={
                  p.btn === 'primary' ? styles.btnPrimary : styles.btnSecondary
                }
              >
                {c.addToCart}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
