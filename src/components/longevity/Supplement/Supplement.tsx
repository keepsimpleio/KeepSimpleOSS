import { FC } from 'react';
import Image from 'next/image';

import { SupplementProps } from './Supplement.types';

import styles from './Supplement.module.scss';

const Supplement: FC<SupplementProps> = ({ name, description, categories }) => {
  return (
    <div className={styles.supplement}>
      <h3 className={styles.heading}>{name}</h3>
      <div className={styles.categoryWrapper}>
        {categories &&
          categories?.data?.map((category, key) => (
            <span key={key} className={styles.categoryBadge}>
              <Image
                src={`/keepsimple_/assets/longevity/sleep/supplements-icons/${category.attributes.title}.png`}
                alt={category.attributes.title}
                width={24}
                height={24}
              />
              {category.attributes.title}
            </span>
          ))}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className={styles.description}
      />
    </div>
  );
};

export default Supplement;
