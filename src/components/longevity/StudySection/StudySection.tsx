import cn from 'classnames';
import Image from 'next/image';
import { FC, useState } from 'react';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import LearnMoreIcon from '@icons/longevity/LearnMoreIcon.png';
import StudyCloseIcon from '@icons/longevity/Study/CloseIcon.svg';

import Heading from '@components/Heading';
import { BorderedPill } from '@components/longevity/BorderedPill/BorderedPill';
import FlipCard from '@components/longevity/FlipCard';
import HtmlClamp from '@components/longevity/HTMLClamp';
import Modal from '@components/Modal';

import { StudySectionProps } from './StudySection.types';

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
  locale,
  chartWidth,
}) => {
  const [switchPage, setSwitchPage] = useState<boolean>(null);
  const isMobile = useIsWidthLessThan(965);
  const [openModal, setOpenModal] = useState(false);
  const learnMoreText = locale === 'ru' ? 'Узнать больше' : 'Learn more';
  const chartImage = flippedCardChartMobile
    ? flippedCardChartMobile
    : flippedCardChart;
  const headlineBg = isHacks
    ? '/keepsimple_/assets/longevity/study/hacks.png'
    : '/keepsimple_/assets/longevity/study-headline-bg.png';

  const mobalBackgroundImage = isHacks
    ? '/keepsimple_/assets/longevity/study/hacks-bg.png'
    : '/keepsimple_/assets/longevity/study/flipped-card-bg.png';
  return (
    <>
      <section
        className={cn(styles.studySection, {
          [styles.studySectionRu]: locale === 'ru',
        })}
        data-cy="study-section"
      >
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
              {isMobile ? (
                <HtmlClamp
                  html={description || ''}
                  lines={6}
                  className={styles.descsription}
                  learnMoreText={learnMoreText}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: description || '' }}
                  className={styles.description}
                />
              )}
              {isMobile && flippedCardChart && (
                <div className={styles.learnMoreWrapper}>
                  <BorderedPill
                    text={learnMoreText}
                    onClick={() => setOpenModal(true)}
                    leftIcon={
                      <Image
                        src={LearnMoreIcon}
                        alt="Learn more"
                        width={20}
                        height={20}
                        unoptimized
                      />
                    }
                    dataCy="learn-more-btn"
                  />
                </div>
              )}
            </div>
          </div>
          {!isMobile && (
            <div
              className={cn(styles.flipCardWrapper, {
                [styles.showFlipCard]: switchPage,
                [styles.hideFlipCard]: switchPage === false,
              })}
              data-cy="flip-card-wrapper"
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
                chartWidth={chartWidth}
                locale={locale}
              />
            </div>
          )}
        </div>
        {flippedCardChart && (
          <div className={styles.pageSwitcherWrapper}>
            {!switchPage ? (
              <Image
                src={'/keepsimple_/assets/longevity/study/page-switcher.svg'}
                alt={'Page switcher'}
                width={60}
                height={60}
                className={styles.pageSwitcher}
                data-cy="page-switcher"
                onClick={() => {
                  setSwitchPage(!switchPage);
                }}
              />
            ) : (
              <Image
                src={
                  '/keepsimple_/assets/longevity/study/page-switcher-back.svg'
                }
                alt={'Page switcher'}
                width={60}
                height={60}
                className={styles.pageSwitcher}
                data-cy="page-switcher"
                onClick={() => {
                  setSwitchPage(!switchPage);
                }}
              />
            )}
          </div>
        )}
      </section>
      {isMobile && openModal && (
        <Modal
          size={'full'}
          onClick={() => setOpenModal(false)}
          backgroundImageUrl={mobalBackgroundImage}
          bodyClassName={isHacks ? styles.hacksModalBody : styles.modalBody}
          className={styles.modal}
          dataCy="study-flip-card-modal"
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
            locale={locale}
          />
          <BorderedPill
            text={'Close'}
            leftIcon={<StudyCloseIcon />}
            onClick={() => setOpenModal(false)}
            isWhite={isHacks}
            dataCy="study-close-btn"
          />
        </Modal>
      )}
    </>
  );
};

export default StudySection;
