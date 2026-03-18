import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import longevityData from '@data/longevity';

import Heading from '@components/Heading';

import { YourDietProps } from './YourDiet.types';

import styles from './YourDiet.module.scss';

const YourDiet: FC<YourDietProps> = ({
  id,
  scaleLevels,
  isIconClicked,
  selectedHealthOptionName,
  locale,
}) => {
  const { yourDietContent, whatTOEatOrAvoidContent } = longevityData[locale];
  const selectedDiet = scaleLevels.find((level: any) => level.id === id);
  const isMobile = useIsWidthLessThan(956);
  const backgroundImageUrl = isMobile
    ? selectedDiet?.backgroundUrlMobile
    : selectedDiet?.backgroundUrl;

  const getYearWord = (value: string) => {
    const { yearSingular, yearFew, yearMany } = yourDietContent;
    const n = parseInt(value, 10);
    const lastTwo = n % 100;
    const lastOne = n % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return yearMany;
    if (lastOne === 1) return yearSingular;
    if (lastOne >= 2 && lastOne <= 4) return yearFew;
    return yearMany;
  };

  return (
    <section
      className={cn(styles.selectedDiet, {
        [styles.active]: isIconClicked,
        [styles.selectedDietRu]: locale === 'ru',
      })}
      data-cy="your-diet"
      data-active={isIconClicked}
      data-selected-id={id}
      style={{
        backgroundImage: `url(${selectedDiet ? backgroundImageUrl : ''})`,
      }}
    >
      <Heading
        text={`${whatTOEatOrAvoidContent.yourDietTxt} - ${selectedHealthOptionName ?? ''}`}
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
            <span> +35% </span>
            {yourDietContent.brainPreservation}
          </p>
          <hr className={styles.divider} />

          <p>
            <span> +20% </span> {yourDietContent.yearsGained}
          </p>
          <hr className={styles.divider} />
          <p className={styles.hasGapP}>
            {yourDietContent.biologicalAge}
            <span>
              -{selectedDiet.biologicalAge}{' '}
              {getYearWord(selectedDiet.biologicalAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p className={styles.hasGapP}>
            {yourDietContent.skinAge}
            <span>
              -{selectedDiet.skinAge} {getYearWord(selectedDiet.skinAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p className={styles.hasGapP}>
            {yourDietContent.jointAge}
            <span>
              -{selectedDiet.jointAge} {getYearWord(selectedDiet.jointAge)}
            </span>
          </p>
          <hr className={styles.divider} />

          <p className={styles.hasGapP}>
            {yourDietContent.metabolicAge}
            <span>
              -{selectedDiet.metabolicAge}{' '}
              {getYearWord(selectedDiet.metabolicAge)}
            </span>
          </p>
          <hr className={styles.divider} />
        </div>
      </div>
    </section>
  );
};

export default YourDiet;
