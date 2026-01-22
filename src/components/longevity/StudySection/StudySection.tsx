import { FC, useState } from 'react';
import Image from 'next/image';

import Heading from '@components/Heading';

import { StudySectionProps } from './StudySection.types';

import styles from './StudySection.module.scss';
import cn from 'classnames';
import FlipCard from '@components/longevity/FlipCard';

const StudySection: FC<StudySectionProps> = ({
  title,
  description,
  isHacks = false,
  flippedCardHeadline,
  flippedCardChartTitle,
  flippedCardSubText,
  flippedCardChart,
  flippedCardPainText,
  hacksQuote,
  quoteAuthor,
}) => {
  const [switchPage, setSwitchPage] = useState<boolean>(false);
  const headlineBg = isHacks
    ? '/keepsimple_/assets/longevity/study/hacks.png'
    : '/keepsimple_/assets/longevity/study-headline-bg.png';

  return (
    <section className={styles.studySection}>
      <div className={styles.headline}>
        <Image
          src={headlineBg}
          alt={title}
          width={948}
          height={67}
          className={styles.backgroundImg}
        />
        <Heading
          showLeftIcon={false}
          showRightIcon={false}
          text={title}
          Tag={'h3'}
          className={cn(styles.heading, {
            [styles.hacksHeading]: isHacks,
          })}
          isBold
        />
      </div>
      <div className={styles.mainContent}>
        <div
          dangerouslySetInnerHTML={{ __html: description || '' }}
          className={styles.description}
        />
      </div>
      <Image
        src={'/keepsimple_/assets/longevity/study/page-switcher.svg'}
        alt={'Page switcher'}
        width={60}
        height={60}
        className={styles.pageSwitcher}
        onClick={() => setSwitchPage(!switchPage)}
      />
      <FlipCard
        headline={flippedCardHeadline}
        subText={flippedCardSubText}
        chart={flippedCardChart}
        chartTitle={flippedCardChartTitle}
        painText={flippedCardPainText}
        isHacks={isHacks}
        hacksQuote={hacksQuote}
        quoteAuthor={quoteAuthor}
      />
    </section>
  );
};

export default StudySection;
