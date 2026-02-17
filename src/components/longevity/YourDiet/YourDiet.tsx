import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import Heading from '@components/Heading';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import { YourDietProps } from './YourDiet.types';

import styles from './YourDiet.module.scss';

const YourDiet: FC<YourDietProps> = ({
  id,
  scaleLevels,
  isIconClicked,
  selectedHealthOptionName,
}) => {
  const selectedDiet = scaleLevels.find((level: any) => level.id === id);
  const isMobile = useIsWidthLessThan(956);
  const backgroundImageUrl = isMobile
    ? selectedDiet?.backgroundUrlMobile
    : selectedDiet?.backgroundUrl;

  const addSToYear = (year: string) => {
    if (year > '1') return 's';
    return '';
  };

  return (
    <section
      className={cn(styles.selectedDiet, {
        [styles.active]: isIconClicked,
      })}
      style={{
        backgroundImage: `url(${selectedDiet ? backgroundImageUrl : ''})`,
      }}
    >
      <Heading
        text={`Your Diet - ${selectedHealthOptionName ?? ''}`}
        Tag="h3"
        showLeftIcon={false}
        showRightIcon={false}
        isBold
        className={styles.yourDietHeading}
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
          <p className={styles.hasGapP}>
            Biological Age:{' '}
            <span>
              -{selectedDiet.biologicalAge} year
              {addSToYear(selectedDiet.biologicalAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p className={styles.hasGapP}>
            Skin Age:{' '}
            <span>
              -{selectedDiet.skinAge} year
              {addSToYear(selectedDiet.skinAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p className={styles.hasGapP}>
            Joint Age:{' '}
            <span>
              -{selectedDiet.jointAge} year
              {addSToYear(selectedDiet.jointAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p className={styles.hasGapP}>
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
