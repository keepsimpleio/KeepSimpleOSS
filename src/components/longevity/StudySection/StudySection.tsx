import { FC, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import Heading from '@components/Heading';

import { StudySectionProps } from './StudySection.types';

import FlipCard from '@components/longevity/FlipCard';
import { useIsWidthLessThan } from '@hooks/useScreenSize';
import Modal from '@components/Modal';
import { BorderedPill } from '@components/longevity/BorderedPill/BorderedPill';

import LearnMoreIcon from '@icons/longevity/LearnMoreIcon';
import { StudyCloseIcon } from '@icons/longevity/Study/CloseIcon';

import styles from './StudySection.module.scss';

const StudySection: FC<StudySectionProps> = ({
  title,
  description,
  isHacks = false,
  flippedCardHeadline,
  flippedCardChartTitle,
  flippedCardSubText,
  flippedCardChart,
  flippedCardChartMobile,
  flippedCardPainText,
  hacksQuote,
  backsBackgroundImageUrl,
  quoteAuthor,
  chartWidth,
}) => {
  const [switchPage, setSwitchPage] = useState<boolean>(null);
  const isMobile = useIsWidthLessThan(965);
  const [openModal, setOpenModal] = useState(false);
  const chartImage = flippedCardChartMobile
    ? flippedCardChartMobile
    : flippedCardChart;
  const headlineBg = isHacks
    ? '/keepsimple_/assets/longevity/study/hacks.png'
    : '/keepsimple_/assets/longevity/study-headline-bg.png';
  //explain to learn doesn't have it
  return (
    <>
      <section className={styles.studySection}>
        <div className={styles.cardContainer}>
          <div
            className={cn(styles.firstPage, {
              [styles.fadeOutFirstPage]: switchPage,
              [styles.fadeInFirstPage]: switchPage === false,
            })}
          >
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
              {isMobile && flippedCardChart && (
                <div className={styles.learnMoreWrapper}>
                  <BorderedPill
                    text={'Learn more'}
                    onClick={() => setOpenModal(true)}
                    leftIcon={<LearnMoreIcon />}
                  />
                </div>
              )}
              {flippedCardChart && (
                <Image
                  src={'/keepsimple_/assets/longevity/study/page-switcher.svg'}
                  alt={'Page switcher'}
                  width={60}
                  height={60}
                  className={styles.pageSwitcher}
                  onClick={() => {
                    setSwitchPage(!switchPage);
                  }}
                />
              )}
            </div>
          </div>
          {!isMobile && (
            <div
              className={cn(styles.flipCardWrapper, {
                [styles.showFlipCard]: switchPage,
                [styles.hideFlipCard]: switchPage === false,
              })}
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
                switchPage={switchPage}
                setSwitchPage={setSwitchPage}
                chartWidth={chartWidth}
              />
            </div>
          )}
        </div>
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
          className={styles.modal}
        >
          <FlipCard
            headline={flippedCardHeadline}
            subText={flippedCardSubText}
            chart={isMobile ? chartImage : flippedCardChart}
            chartTitle={flippedCardChartTitle}
            painText={flippedCardPainText}
            isHacks={isHacks}
            hacksQuote={hacksQuote}
            quoteAuthor={quoteAuthor}
            chartWidth={chartWidth}
          />
          <BorderedPill
            text={'Close'}
            leftIcon={<StudyCloseIcon />}
            onClick={() => setOpenModal(false)}
            isWhite={isHacks}
          />
        </Modal>
      )}
    </>
  );
};

export default StudySection;
