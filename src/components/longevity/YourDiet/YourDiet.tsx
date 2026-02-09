import { FC } from 'react';
import Image from 'next/image';

import Heading from '@components/Heading';

import { YourDietProps } from './YourDiet.types';

import styles from './YourDiet.module.scss';

const YourDiet: FC<YourDietProps> = ({ id, scaleLevels }) => {
  const selectedDiet = scaleLevels.find((level: any) => level.id === id);

  const addSToYear = (year: string) => {
    if (year > '1') return 's';
    return '';
  };
  return (
    <section
      className={styles.selectedDiet}
      style={{
        backgroundImage: `url(${selectedDiet ? selectedDiet.backGroundUrl : ''})`,
      }}
    >
      <Heading
        text="Your Diet"
        Tag="h3"
        showLeftIcon={false}
        showRightIcon={false}
        isBold
      />
      <div className={styles.wrapper}>
        <Image
          src={selectedDiet.imagePath}
          alt={''}
          width={240}
          height={240}
          className={styles.icon}
        />
        <div>
          <p>
            <span> +35% </span> Brain preservation
          </p>
          <hr className={styles.divider} />

          <p>
            <span> +20% </span> Years of life gained!
          </p>
          <hr className={styles.divider} />
          <p>
            Biological Age:{' '}
            <span>
              -{selectedDiet.biologicalAge} year
              {addSToYear(selectedDiet.biologicalAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p>
            Skin Age:{' '}
            <span>
              -{selectedDiet.skinAge} year
              {addSToYear(selectedDiet.skinAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p>
            Joint Age:{' '}
            <span>
              -{selectedDiet.jointAge} year
              {addSToYear(selectedDiet.jointAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p>
            Metabolic Age:{' '}
            <span>
              -{selectedDiet.metabolicAge} year
              {addSToYear(selectedDiet.metabolicAge)}
            </span>
          </p>
          <hr className={styles.divider} />
        </div>
      </div>
    </section>
  );
};

export default YourDiet;
