import { DietResultsProps } from '@components/longevity/DietResults/DietResults.types';
import { FC } from 'react';
import Image from 'next/image';
import styles from './DietResults.module.scss';
const DietResults: FC<DietResultsProps> = ({ id }) => {
  const scaleImgPath = '/keepsimple_/assets/longevity/diet/scale/';
  const scaleLavels = [
    {
      id: 1,
      imagePath: scaleImgPath + 'borderline-ok-fruits.svg',
    },
    {
      id: 2,
      imagePath: scaleImgPath + 'supportive-foods.svg',
    },
    {
      id: 3,
      imagePath: scaleImgPath + 'protective-foods.svg',
    },
    {
      id: 4,
      imagePath: scaleImgPath + 'clean-nutritent.svg',
    },
    {
      id: 5,
      imagePath: scaleImgPath + 'metabolic-gold.svg',
    },
  ];

  return (
    <div className={styles.results}>
      {scaleLavels.map(level => (
        <Image
          className={styles.img}
          key={id}
          src={level.imagePath}
          alt={`Diet level ${level.id}`}
          width={120}
          height={120}
        />
      ))}
      <span className={styles.selected}>selected state</span>
    </div>
  );
};

export default DietResults;
