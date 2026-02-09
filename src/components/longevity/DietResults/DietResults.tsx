import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { DietResultsProps } from './DietResults.types';

import styles from './DietResults.module.scss';

const DietResults: FC<DietResultsProps> = ({
  id,
  scaleLevels,
  setSelectedHealthyOptionId,
}) => {
  return (
    <div className={styles.results}>
      {scaleLevels.map((level, index) => (
        <div
          onClick={() => setSelectedHealthyOptionId(level.id)}
          key={level.id}
          className={cn(styles.item, {
            [styles.active]: id === level.id,
          })}
        >
          <Image
            className={cn(styles.img, {})}
            src={level.imagePath}
            alt={`Diet level ${level.id}`}
            width={120}
            height={120}
            unoptimized
          />
          <span
            className={cn(styles.selected, {
              [styles.active]: id === level.id,
            })}
          >
            selected state
          </span>
          {index === 0 && (
            <span className={styles.defaultLabel}>Borderline “OK” Foods</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DietResults;
