import Image from 'next/image';
import { FC } from 'react';

import { SupplementProps } from './Supplement.types';

import styles from './Supplement.module.scss';

const Supplement: FC<SupplementProps> = ({ name, description, categories }) => {
  return (
    <div className={styles.supplement}>
      <h3 className={styles.heading}>{name}</h3>
      {categories?.data.length > 0 && (
        <div className={styles.categoryWrapper}>
          {categories?.data?.map((category, key) => {
            const displayTitle = category.attributes.title;
            const enLocalization =
              category.attributes.localizations?.data?.find(
                (loc: any) => loc.attributes?.locale === 'en',
              );
            const imageTitle =
              enLocalization?.attributes?.title ?? displayTitle;
            return (
              <span key={key} className={styles.categoryBadge}>
                <Image
                  src={`/keepsimple_/assets/longevity/sleep/supplements-icons/${imageTitle}.png`}
                  alt={displayTitle}
                  width={24}
                  height={24}
                  unoptimized
                />
                {displayTitle}
              </span>
            );
          })}
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className={styles.description}
      />
    </div>
  );
};

export default Supplement;
