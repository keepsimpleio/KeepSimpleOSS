import { useRouter } from 'next/router';
import { Fragment } from 'react';

import rawContent from './WeberFechnerLaw.content';

import styles from './WeberFechnerLaw.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.items}>
        {c.items.map((item, i) => (
          <Fragment key={item.name}>
            {i > 0 && <div className={styles.divider} />}
            <div className={styles.item}>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemCategory}>{item.category}</div>
              <div className={styles.priceRow}>
                <span className={styles.oldPrice}>{item.oldPrice}</span>
                <span className={styles.newPrice}>{item.newPrice}</span>
              </div>
              <div className={styles.discount}>{item.beforeDiscount}</div>
              <button className={styles.btn}>{c.addToCart}</button>
            </div>
          </Fragment>
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
      <div className={styles.items}>
        {c.items.map((item, i) => (
          <Fragment key={item.name}>
            {i > 0 && <div className={styles.divider} />}
            <div className={styles.item}>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemCategory}>{item.category}</div>
              <div className={styles.priceRow}>
                <span className={styles.oldPrice}>{item.oldPrice}</span>
                <span className={styles.newPrice}>{item.newPrice}</span>
              </div>
              <div
                className={`${styles.discount} ${item.afterHot ? styles.discountBig : styles.discountSmall}`}
              >
                {item.afterDiscount}
              </div>
              <button
                className={`${styles.btn} ${item.afterHot ? styles.btnHot : ''}`}
              >
                {c.addToCart}
              </button>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
