import HrIcon from '@uxcore/assets/icons/HrIcon';
import ProductIcon from '@uxcore/assets/icons/ProductIcon';
import ThreeLineArrow from '@uxcore/assets/icons/ThreeLineArrow';
import BiasBody from '@uxcore/components/_biases/BiasBody';
import ContentParser from '@uxcore/components/ContentParser';
import ModalRaiting from '@uxcore/components/ModalRaiting';
import Spinner from '@uxcore/components/Spinner';
import Table from '@uxcore/components/Table';
import UXCoreModalHeader from '@uxcore/components/UXCoreModalParts/UXCoreModalHeader';
import modalIntl from '@uxcore/data/modal';
import useUXCoreGlobals from '@uxcore/hooks/useUXCoreGlobals';
import { copyToClipboard, generateSocialLinks } from '@uxcore/lib/helpers';
import type {
  QuestionType,
  StrapiBiasType,
  TagType,
} from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Slider, { LazyLoadTypes } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './UXCoreModalMobile.module.scss';

type UXCoreModalMobileProps = {
  biasNumber: number;
  questions: QuestionType[];
  tags: TagType[];
  onClose: () => void;
  onChangeBiasId: (nextBiasId: number, nextBiasName: string) => void;
  isProductView: boolean;
  toggleIsCoreView: () => void;
  isSecondView: boolean;
  secondViewLabel: string;
  defaultViewLabel: string;
  uxCoreData?: any;
  nextBiasName: string;
  prevBiasName: string;
  slugs?: Record<string, string>;
};

const UXCoreModalMobile: FC<UXCoreModalMobileProps> = ({
  biasNumber,
  questions,
  tags,
  onClose,
  onChangeBiasId,
  isProductView,
  toggleIsCoreView,
  isSecondView,
  secondViewLabel,
  defaultViewLabel,
  uxCoreData,
  nextBiasName,
  prevBiasName,
  slugs,
}) => {
  const router = useRouter();
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
  const [isQuestionHovered, setIsQuestionHovered] = useState(false);
  const modalBodyRef = useRef(null);
  const slider = useRef(null);
  const [leftSwipe, setLeftSwipe] = useState(0);
  const [rightSwipe, setRightSwipe] = useState(0);
  const tooltipTimer: { current: any } = useRef();
  const [activeSlideCurrentBiasNumber, setActiveSlideCurrentBiasNumber] =
    useState(biasNumber);
  const [currentBiasTitle, setCurrentBiasTitle] = useState(null);
  const { locale } = router as TRouter;
  const [firstChangedValue, setFirstChangedValue] = useState(biasNumber);
  const [swipeCount, setSwipeCount] = useState(0);
  const [disableArrows, setDisableArrows] = useState(false);
  const [{ toggleShowArrows }, { showArrows }] = useUXCoreGlobals();
  const isOpen = biasNumber;
  const [strapiBiases, setStrapiBiases] = useState<StrapiBiasType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setStrapiBiases(uxCoreData);
    setIsLoading(false);
  }, [uxCoreData]);

  const handlePageViewChange = useCallback(
    e => {
      const { type } = e.currentTarget.dataset;
      if ((type === secondViewLabel) !== isSecondView) {
        toggleIsCoreView();
      }
    },
    [isSecondView, toggleIsCoreView],
  );

  const handleCopyLink = useCallback(() => {
    copyToClipboard(window.location.href);
    setIsCopyTooltipVisible(true);

    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => {
      setIsCopyTooltipVisible(false);
    }, 2500);
  }, [copyToClipboard]);

  const handleSwipe = useCallback(
    direction => {
      if (activeSlideCurrentBiasNumber === null || biasNumber === null) {
        return;
      }
      const swipeDirection = direction === 'left' ? 1 : -1;
      const swiperTitle = direction === 'left' ? nextBiasName : prevBiasName;
      let newBiasNumber = activeSlideCurrentBiasNumber + swipeDirection;
      if (newBiasNumber > 105) {
        newBiasNumber = 1;
      } else if (newBiasNumber < 1) {
        newBiasNumber = 105;
      }
      onChangeBiasId(newBiasNumber, swiperTitle);
      setActiveSlideCurrentBiasNumber(newBiasNumber);
    },
    [
      activeSlideCurrentBiasNumber,
      biasNumber,
      onChangeBiasId,
      firstChangedValue,
    ],
  );

  useEffect(() => {
    if (firstChangedValue === null) {
      setFirstChangedValue(biasNumber);
      setLeftSwipe(0);
      setActiveSlideCurrentBiasNumber(null);
    }
  }, [biasNumber, leftSwipe]);

  useEffect(() => {
    if (firstChangedValue !== null) {
      if (activeSlideCurrentBiasNumber === null) {
        if (leftSwipe === 1) {
          if (firstChangedValue !== 105) {
            onChangeBiasId(firstChangedValue + 1, nextBiasName);
          }
          if (firstChangedValue === 105) {
            onChangeBiasId(1, nextBiasName);
          }
        }
        if (rightSwipe === -1) {
          if (firstChangedValue !== 1) {
            onChangeBiasId(firstChangedValue - 1, prevBiasName);
          }
          if (firstChangedValue === 1) {
            onChangeBiasId(105, prevBiasName);
          }
        }
      }
    }
  }, [leftSwipe, rightSwipe]);

  useEffect(() => {
    if (swipeCount === 1 && !!showArrows) {
      setDisableArrows(true);

      setTimeout(() => {
        toggleShowArrows(false);
      }, 2000);
    }
  }, [swipeCount]);

  if (!isOpen) return null;

  const {
    copyLink,
    copied,
    share,
    description,
    usage,
    mentionedIn,
    productValue,
    managementValue,
    productText,
    hrText,
  } = modalIntl[locale];

  function createSwiperArray(locale: 'en' | 'ru' | 'hy') {
    if (firstChangedValue !== -1 && !!strapiBiases) {
      const slides = strapiBiases.map(obj => {
        return {
          number: obj.attributes.number,
          desc: obj.attributes.description,
          usage: obj.attributes.usage,
          usageHr: obj.attributes.usageHr,
          title: obj.attributes.title,
          relatedQuestionsID: obj.attributes.mentionedQuestionsIds,
          p: obj.attributes.p,
          m: obj.attributes.m,
          wikiLink: obj.attributes.wikiLink,
        };
      });

      return slides
        .slice(firstChangedValue - 1)
        .concat(slides.slice(0, firstChangedValue - 1));
    }

    return [];
  }

  const virtualOptions = createSwiperArray(locale);
  const firstModalTitle = virtualOptions?.[0]?.title;
  const shareTitle = currentBiasTitle ? currentBiasTitle : firstModalTitle;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const { linkedIn, facebook, tweeter } = generateSocialLinks(
    shareUrl,
    shareTitle,
  );

  // click on arrow
  const handleRightClick = () => {
    slider.current.slickNext();
    if (activeSlideCurrentBiasNumber === null) {
      if (firstChangedValue < 105) {
        onChangeBiasId(firstChangedValue + 1, nextBiasName);
      }
      if (firstChangedValue === 105) {
        onChangeBiasId(1, nextBiasName);
      }
    } else if (activeSlideCurrentBiasNumber) {
      if (activeSlideCurrentBiasNumber < 105) {
        onChangeBiasId(activeSlideCurrentBiasNumber + 1, nextBiasName);
      }
      if (activeSlideCurrentBiasNumber === 105) {
        onChangeBiasId(1, nextBiasName);
      }
    }
  };

  // click on arrow
  const handleLeftClick = () => {
    slider.current.slickPrev();
    if (activeSlideCurrentBiasNumber === null) {
      if (firstChangedValue > 1) {
        onChangeBiasId(firstChangedValue - 1, prevBiasName);
      }
      if (firstChangedValue === 1) {
        onChangeBiasId(105, prevBiasName);
      }
    } else if (activeSlideCurrentBiasNumber) {
      if (activeSlideCurrentBiasNumber > 1) {
        onChangeBiasId(activeSlideCurrentBiasNumber - 1, prevBiasName);
      }
      if (activeSlideCurrentBiasNumber === 1) {
        onChangeBiasId(105, prevBiasName);
      }
    }
  };

  const settings = {
    accessibility: true,
    lazyLoad: 'ondemand' as LazyLoadTypes,
    infinite: true,
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '1px',
    afterChange: (current: number) => {
      const currentBiasNumber = virtualOptions[current]?.number;
      setActiveSlideCurrentBiasNumber(currentBiasNumber);
      setCurrentBiasTitle(virtualOptions[current]?.title);
      setSwipeCount(swipeCount + 1);
    },
    onSwipe: (direction: string) => {
      handleSwipe(direction);
      setLeftSwipe(prevState => direction === 'left' && prevState + 1);
      setRightSwipe(prevState => direction === 'right' && prevState - 1);
    },
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <div
      className={cn(styles.ModalOverlay, {
        [styles.hyLang]: locale === 'hy',
      })}
      onClick={onClose}
    >
      <Slider ref={slider} {...settings} data-cy={'slider'}>
        {virtualOptions?.map((bias, index) => {
          return (
            <div
              className={styles.Modal}
              onClick={e => e.stopPropagation()}
              key={index}
            >
              <UXCoreModalHeader
                title={bias.title}
                p={bias.p}
                m={bias.m}
                wikiLink={bias.wikiLink}
                number={bias.number}
                productValue={productValue}
                managementValue={managementValue}
                onClose={onClose}
                handleCopyLink={handleCopyLink}
                isCopyTooltipVisible={isCopyTooltipVisible}
                linkedIn={linkedIn}
                facebook={facebook}
                tweeter={tweeter}
                copyLink={copyLink}
                share={share}
                copied={copied}
                slugs={slugs}
              />
              <div className={styles.ModalBody} ref={modalBodyRef}>
                <div className={styles.ModalButtons}>
                  {showArrows && (
                    <>
                      <div
                        onClick={handleRightClick}
                        className={cn(styles.arrowRight, {
                          [styles.disableArrows]: disableArrows,
                        })}
                        data-cy={'slide-move-right'}
                      >
                        <ThreeLineArrow />
                      </div>
                      <div
                        onClick={handleLeftClick}
                        className={cn(styles.arrowLeft, {
                          [styles.disableArrows]: disableArrows,
                        })}
                        data-cy={'slide-move-left'}
                      >
                        <ThreeLineArrow />
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.ModalBodyTitle}>
                  <span>{description}</span>
                </div>
                <div className={styles.ModalBodyContent}>
                  <ContentParser data={bias.desc} styles={styles} />
                </div>
                <div className={styles.ModalBodyTitle}>
                  <span className={styles.metaTitle}>{usage}</span>
                </div>
                <div className={styles.ModalBodyContent}>
                  <div className={styles.switcher}>
                    <div
                      onClick={handlePageViewChange}
                      data-type={defaultViewLabel}
                      className={cn(styles.switcherItem, {
                        [styles.activeProduct]: !isProductView,
                      })}
                    >
                      <ProductIcon />
                      <span className={styles.switcherItemText}>
                        {productText}
                      </span>
                    </div>
                    <div
                      onClick={handlePageViewChange}
                      data-type={secondViewLabel}
                      className={cn(styles.switcherItem, {
                        [styles.activeHr]: isProductView,
                      })}
                    >
                      <HrIcon />
                      <span className={styles.switcherItemText}> {hrText}</span>
                    </div>
                  </div>
                  <ContentParser
                    data={!isProductView ? bias.usage : bias.usageHr}
                    styles={styles}
                  />
                </div>
                {bias.title && (
                  <BiasBody biasNumber={Number(bias.number)} locale={locale} />
                )}
                {questions.length > 0 && (
                  <>
                    <div
                      className={cn(styles.ModalBodyTitle, styles.mentionedIn, {
                        [styles.QuestionHovered]: isQuestionHovered,
                      })}
                    >
                      <span>{mentionedIn}</span>
                    </div>
                    <div className={styles.ModalBodyContent}>
                      <Table
                        showMoreButton
                        disableTooltips={false}
                        activeFilter={'all'}
                        data={questions}
                        tags={tags}
                        biasNumber={biasNumber}
                        isUXCoreModal
                        setIsQuestionHovered={setIsQuestionHovered}
                      />
                    </div>
                  </>
                )}
              </div>
              <ModalRaiting id={biasNumber} type="bias" />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default UXCoreModalMobile;
