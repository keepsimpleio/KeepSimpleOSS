import { FC, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import Heading from '@components/Heading';

import { StudySectionProps } from './StudySection.types';

import FlipCard from '@components/longevity/FlipCard';
import { useIsWidthLessThan } from '@hooks/useScreenSize';
import Modal from '@components/Modal';

import styles from './StudySection.module.scss';

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
  backsBackgroundImageUrl,
  quoteAuthor,
}) => {
  const [switchPage, setSwitchPage] = useState<boolean>(false);
  const isMobile = useIsWidthLessThan(965);
  const [openModal, setOpenModal] = useState(false);
  const headlineBg = isHacks
    ? '/keepsimple_/assets/longevity/study/hacks.png'
    : '/keepsimple_/assets/longevity/study-headline-bg.png';

  return (
    <>
      <section className={styles.studySection}>
        <div className={styles.headline}>
          <Image
            src={headlineBg || ''}
            alt={title}
            width={948}
            height={67}
            unoptimized
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
          {isMobile && (
            <div className={styles.learnMoreWrapper}>
              <button
                className={styles.learnMoreBtn}
                onClick={() => setOpenModal(true)}
              >
                <Image
                  src={'/keepsimple_/assets/longevity/learn-more-icon.svg'}
                  alt={'Learn more icon'}
                  width={16}
                  height={16}
                  unoptimized
                />
                Learn More
              </button>
            </div>
          )}
        </div>
        <Image
          src={'/keepsimple_/assets/longevity/study/page-switcher.svg'}
          alt={'Page switcher'}
          width={60}
          height={60}
          className={styles.pageSwitcher}
          onClick={() => setSwitchPage(!switchPage)}
        />
        {!isMobile && (
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
        )}
      </section>
      {isMobile && openModal && (
        <Modal
          size={'full'}
          onClick={() => setOpenModal(false)}
          backgroundImageUrl={
            backsBackgroundImageUrl
              ? backsBackgroundImageUrl
              : '/keepsimple_/assets/longevity/study/flipped-card-bg.png'
          }
          bodyClassName={isHacks ? styles.hacksModalBody : styles.modalBody}
        >
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
        </Modal>
      )}
    </>
  );
};

export default StudySection;
