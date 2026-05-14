import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Slider, { LazyLoadTypes } from 'react-slick';

import type { QuestionType, StrapiBiasType, TagType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import useMobile from '@uxcore/hooks/useMobile';
import useTooltip from '@uxcore/hooks/useTooltip';
import useUXCGGlobals from '@uxcore/hooks/useUXCGGlobals';

import { copyToClipboard, generateSocialLinks, updateVH } from '@uxcore/lib/helpers';

import modalIntl from '@data/modal';

import ThreeLineArrow from '@icons/ThreeLineArrow';

import AnswerContentGenerator from '@uxcore/components/AnswerContentGenerator';
import LanguageSwitcher from '@uxcore/components/LanguageSwitcher';
import ModalRaiting from '@uxcore/components/ModalRaiting';
import Tag from '@uxcore/components/Tag';
import Tooltip from '@uxcore/components/Tooltip';
import Share from '@uxcore/components/UXCGModalSubComponents/Share';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './UXCGModalMobile.module.scss';

type TUXCGModalMobile = {
  questionId: number;
  answerId: number;
  questions: any; // HYTranslation TODO
  biases: StrapiBiasType[];
  tags: TagType[];
  onClose: () => void;
  onChangeQuestionId: (
    nextQuestionId: number,
    nextQuestionSlug: string,
  ) => void;
  data: QuestionType;
  setIsModalClosed: (isModalClosed: boolean) => void;
  closeModal: () => void;
  handleCopyLink: () => void;
  handleQuestionClick: (number: number, slug: string) => void;
  isCopyTooltipVisible: boolean;
  clickedQuestionId: number;
  nextQuestion: string;
  prevQuestion: string;
  id: number;
  slugs?: Record<string, string>;
};

const UXCGModalMobile: FC<TUXCGModalMobile> = ({
  questionId,
  answerId,
  questions,
  biases,
  tags,
  data,
  setIsModalClosed,
  onClose,
  onChangeQuestionId,
  closeModal,
  handleCopyLink,
  isCopyTooltipVisible,
  handleQuestionClick,
  clickedQuestionId,
  nextQuestion,
  prevQuestion,
  id,
  slugs,
}) => {
  const { isMobile } = useMobile()[1];
  const slider = useRef(null);
  const { setActiveTooltipId } = useTooltip()[0];
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [highlightAnswer, setHighlightAnswer] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(105);
  const [leftSwipe, setLeftSwipe] = useState(0);
  const [rightSwipe, setRightSwipe] = useState(0);

  const [firstChangedValue, setFirstChangedValue] = useState(questionId);
  const [swipeCount, setSwipeCount] = useState(0);
  const [disableArrows, setDisableArrows] = useState(false);
  const [activeSlideCurrentBiasNumber, setActiveSlideCurrentBiasNumber] =
    useState(questionId);
  const [{ toggleShowModalArrows }, { showModalArrows }] = useUXCGGlobals();

  const modalBodyuseRef = useRef(null);
  const modalHeaderRef = useRef(null);
  const bodyRef = useRef(null);
  const lastUxcgQuestion = 63;
  const { locale } = router as TRouter;
  const isOpen = !!id;

  const handleSwipe = useCallback(
    direction => {
      if (activeSlideCurrentBiasNumber === null || id === null) {
        return;
      }
      const swipeDirection = direction === 'left' ? 1 : -1;
      const swiperTitle = direction === 'left' ? nextQuestion : prevQuestion;
      let newBiasNumber = activeSlideCurrentBiasNumber + swipeDirection;
      if (newBiasNumber > 63) {
        newBiasNumber = 1;
      } else if (newBiasNumber < 1) {
        newBiasNumber = 63;
      }

      setLeftSwipe(0);
      setRightSwipe(0);
      setSwipeCount(0);
      setActiveSlideCurrentBiasNumber(newBiasNumber);
      onChangeQuestionId(newBiasNumber, swiperTitle);
    },
    [
      activeSlideCurrentBiasNumber,
      id,
      onChangeQuestionId,
      nextQuestion,
      prevQuestion,
    ],
  );

  const handleHeightCalc = useCallback(() => {
    updateVH();

    if (modalHeaderRef.current) {
      const { height } = modalHeaderRef.current.getBoundingClientRect();

      if (headerHeight !== height) {
        setHeaderHeight(height);
      }
    }
  }, [isMobile, headerHeight]);

  const handleModalClick = useCallback(e => {
    e.stopPropagation();
    setIsModalClosed(false);
    setActiveTooltipId(null);
  }, []);

  const currentAnswer = document.querySelector(
    `.${styles.AnswerItem}[data-index="${answerId}"]`,
  );
  const modalBody = document.querySelector(`.${styles.ModalBody}`);

  useEffect(() => {
    const handleRouteChange = url => {
      if (clickedQuestionId) {
        router.reload();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    if (answerId) {
      setTimeout(() => {
        setHighlightAnswer(true);

        if (modalBody && currentAnswer) {
          const { top } = currentAnswer.getBoundingClientRect();
          const y = top - headerHeight - 28; // - paddings(20) - additional gap(2)
          modalBody.scrollTo(0, y);
        }

        setTimeout(() => {
          setHighlightAnswer(false);
        }, 3000);
      }, 500);
    }
  }, [answerId, currentAnswer, modalBody, headerHeight]);

  useEffect(() => {
    // @ts-ignore
    const isChrome = !!window.chrome;
    const overflowDefaultValue = isChrome ? 'overlay' : 'auto';

    if (isOpen) {
      handleHeightCalc();
      setActiveTooltipId(null);
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = overflowDefaultValue;
    }

    return () => {
      document.documentElement.style.overflowY = overflowDefaultValue;
    };
  }, [questionId, isOpen]);

  useEffect(() => {
    handleHeightCalc();

    window.addEventListener('resize', handleHeightCalc);

    return () => {
      window.removeEventListener('resize', handleHeightCalc);
    };
  }, [handleHeightCalc]);

  const handleCopyAnswer = (e: MouseEvent<HTMLImageElement>) => {
    // @ts-ignore
    const { id } = e.target.dataset;
    const { origin, pathname } = window.location;
    const link = `${origin}${pathname}#${id}`;
    copyToClipboard(link);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const bodyStyles = useMemo(() => {
    let windowHeight = '100vh';

    if (typeof window !== 'undefined') {
      const styleAttr = document.documentElement.getAttribute('style');

      if (styleAttr) {
        const htmlStyles = styleAttr.split(';');
        const vhStyle = htmlStyles.find(style => style.indexOf('--vh') > -1);

        if (vhStyle) {
          const vh = Number(vhStyle.slice(6, -2));

          windowHeight = `${vh * 100}px`;
        }
      }
    }

    const footerHeight = 100;
    const headerAndFooterHeights = headerHeight + footerHeight;
    const gaps = 56;

    const height = `calc(${windowHeight} - ${headerAndFooterHeights}px - ${gaps}px)`;

    return {
      height,
    };
  }, [isMobile, headerHeight]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const { linkedIn, facebook, tweeter } = generateSocialLinks(
    shareUrl,
    locale === 'ru' ? data?.titleRu : data?.titleEn,
  );
  const {
    copyLink,
    copied,
    share,
    answersLabel,
    relatedQuestionsLabel,
    downloadButtonLabel,
  } = modalIntl[locale];

  useEffect(() => {
    if (firstChangedValue === null) {
      setFirstChangedValue(id);
      setLeftSwipe(0);
      setActiveSlideCurrentBiasNumber(null);
      setRightSwipe(0);
    }
  }, [id, leftSwipe, firstChangedValue]);

  useEffect(() => {
    if (firstChangedValue !== null) {
      if (activeSlideCurrentBiasNumber === null) {
        if (leftSwipe === 1) {
          if (firstChangedValue !== 63) {
            onChangeQuestionId(firstChangedValue + 1, nextQuestion);
          }
          if (firstChangedValue === 63) {
            onChangeQuestionId(1, nextQuestion);
          }
        }
        if (rightSwipe === -1) {
          if (firstChangedValue !== 1) {
            onChangeQuestionId(firstChangedValue - 1, prevQuestion);
          }
          if (firstChangedValue === 1) {
            onChangeQuestionId(63, prevQuestion);
          }
        }
      }
    }
  }, [leftSwipe, rightSwipe, firstChangedValue]);

  useEffect(() => {
    if (swipeCount === 2 && !!showModalArrows) {
      setDisableArrows(true);

      setTimeout(() => {
        toggleShowModalArrows(false);
      }, 2000);
    }
  }, [swipeCount]);

  const copyText = isCopied ? copied : copyLink;

  const handleRightClick = () => {
    slider.current.slickNext();
    if (activeSlideCurrentBiasNumber === null) {
      if (firstChangedValue < lastUxcgQuestion) {
        onChangeQuestionId(firstChangedValue + 1, nextQuestion);
      }
      if (firstChangedValue === lastUxcgQuestion) {
        onChangeQuestionId(1, nextQuestion);
      }
    } else if (activeSlideCurrentBiasNumber) {
      if (activeSlideCurrentBiasNumber < lastUxcgQuestion) {
        onChangeQuestionId(activeSlideCurrentBiasNumber + 1, nextQuestion);
      }
      if (activeSlideCurrentBiasNumber === lastUxcgQuestion) {
        onChangeQuestionId(1, nextQuestion);
      }
    }
  };

  const handleLeftClick = () => {
    slider.current.slickPrev();
    if (activeSlideCurrentBiasNumber === null) {
      if (firstChangedValue > 1) {
        onChangeQuestionId(firstChangedValue - 1, prevQuestion);
      }
      if (firstChangedValue === 1) {
        onChangeQuestionId(lastUxcgQuestion, prevQuestion);
      }
    } else if (activeSlideCurrentBiasNumber) {
      if (activeSlideCurrentBiasNumber > 1) {
        onChangeQuestionId(activeSlideCurrentBiasNumber - 1, prevQuestion);
      }
      if (activeSlideCurrentBiasNumber === 1) {
        onChangeQuestionId(lastUxcgQuestion, prevQuestion);
      }
    }
  };

  function createSwiperArray(locale: 'en' | 'ru' | 'hy') {
    if (firstChangedValue !== -1) {
      const slides = questions.map(obj => {
        const titleMap = {
          en: obj.titleEn,
          ru: obj.titleRu,
          hy: obj.titleHy,
        };

        const answersMap = {
          en: obj.answersEn,
          ru: obj.answersRu,
          hy: obj.answersHy,
        };

        const rawAnswers = answersMap[locale] || obj.answersEn || '';
        const answers =
          typeof rawAnswers === 'string' ? rawAnswers.split('\n') : [];

        return {
          number: obj.number,
          title: titleMap[locale] || obj.titleEn,
          downloadLinks: obj.downloadLinks,
          tags: obj.tags,
          answers,
          relatedQuestions: obj.relatedQuestions,
        };
      });

      return slides
        .slice(firstChangedValue - 1)
        .concat(slides.slice(0, firstChangedValue - 1));
    }

    return [];
  }

  const uxcgSwiperArray = createSwiperArray(locale);

  const settings = {
    accessibility: true,
    lazyLoad: 'ondemand' as LazyLoadTypes,
    infinite: true,
    afterChange: (current: number) => {
      const currentBiasNumber = uxcgSwiperArray[current]?.number;
      setActiveSlideCurrentBiasNumber(currentBiasNumber);
      setSwipeCount(swipeCount + 1);
    },
    onSwipe: (direction: string) => {
      handleSwipe(direction);
      setLeftSwipe(prevState => direction === 'left' && prevState + 1);
      setRightSwipe(prevState => direction === 'right' && prevState - 1);
    },
  };
  if (!isOpen) return null;

  return (
    questions && (
      <div
        className={cn(styles.ModalOverlay, {
          [styles.hyLang]: locale === 'hy',
        })}
        onClick={closeModal}
      >
        <Slider {...settings} ref={slider}>
          {uxcgSwiperArray.map((el, id) => {
            return (
              <div className={styles.Modal} onClick={handleModalClick} key={id}>
                <div className={styles.ModalHeader} ref={modalHeaderRef}>
                  <div className={styles.ModalHeaderTop}>
                    <span className={styles.Number}>#{el.number}</span>
                    <div className={styles.ModalHeaderTags}>
                      {el.tags.map(tagId => {
                        const tagData = tags.find(({ id }) => id === tagId);
                        return (
                          <Tag
                            key={tagId}
                            {...tagData}
                            tooltipPosition="bottom"
                          />
                        );
                      })}
                    </div>
                    <div className={styles.ModalHeaderCloseButtonContainer}>
                      <div className={styles.ModalHeaderCloseButton}>
                        <Image
                          src="/assets/biases/cross.svg"
                          onClick={onClose}
                          alt="modal close button"
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <h1 className={styles.ModalHeaderTitle}>{el.title}</h1>
                  <div className={styles.ModalHeaderLinks}>
                    <span onClick={handleCopyLink} className={styles.CopyText}>
                      {copyText}
                      <span
                        className={cn(styles.Tooltip, {
                          [styles.Visible]: isCopyTooltipVisible,
                        })}
                      >
                        {copied}
                      </span>
                    </span>
                    <Share
                      shareTxt={share}
                      tweeter={tweeter}
                      facebook={facebook}
                      linkedIn={linkedIn}
                    />
                    {el.downloadLinks && (
                      <a
                        className={styles.DownloadLink}
                        href={
                          locale === 'ru'
                            ? el.downloadLinks.ru
                            : el.downloadLinks.en
                        }
                        download
                      >
                        {isMobile ? (
                          <span>{downloadButtonLabel}</span>
                        ) : (
                          <span>{downloadButtonLabel}</span>
                        )}
                      </a>
                    )}
                    <LanguageSwitcher
                      className={styles.uxcgLangSwitcher}
                      section={'uxcg'}
                      languageSwitchSlugs={slugs}
                    />
                  </div>
                </div>
                <div ref={bodyRef}>
                  <div
                    className={styles.ModalBody}
                    ref={modalBodyuseRef}
                    style={bodyStyles}
                  >
                    {showModalArrows && (
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
                    <div className={styles.AnswersHeader}>
                      <h2
                        className={cn(styles.PossibleAnswers, {
                          [styles.PossibleAnswersRu]: locale === 'ru',
                        })}
                      >
                        {answersLabel} ({el.answers.length})
                      </h2>

                      <hr className={styles.Line} />
                    </div>

                    <div className={styles.ModalBodyContent}>
                      {el.answers.map((answer: string, index: number) => (
                        <div
                          key={index}
                          data-index={index}
                          className={cn(styles.AnswerItem, {
                            [styles.Higlighted]:
                              index === answerId && highlightAnswer,
                          })}
                        >
                          <Tooltip content={copyText} dark>
                            <img
                              src="/assets/icons/anchor.svg"
                              data-id={index}
                              width={14}
                              alt={copyText}
                              height={14}
                              onClick={handleCopyAnswer}
                            />
                          </Tooltip>
                          <div>
                            <AnswerContentGenerator
                              text={answer}
                              biases={biases}
                              linkClassName={styles.AnswerLink}
                              containerClassName={styles.ModalBody}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {el.relatedQuestions.length > 0 && (
                      <>
                        <div className={styles.AnswersHeader}>
                          <h2 className={styles.RelatedQuestionTitle}>
                            {relatedQuestionsLabel}
                          </h2>
                          <hr className={styles.Line} />
                        </div>
                        <div className={styles.ModalBodyContent}>
                          {el.relatedQuestions.map(
                            (relatedQuestionId, index) => {
                              const rqData = questions.find(
                                ({ number }) => number === relatedQuestionId,
                              );
                              if (rqData) {
                                const {
                                  number,
                                  titleEn,
                                  titleRu,
                                  titleHy,
                                  slugEn,
                                  slugRu,
                                  slugHy,
                                } = rqData;
                                const relatedTitles = {
                                  en: titleEn,
                                  ru: titleRu,
                                  hy: titleHy,
                                };
                                const relatedSlugs = {
                                  en: slugEn,
                                  ru: slugRu,
                                  hy: slugHy,
                                };
                                return (
                                  <div
                                    data-number={number}
                                    key={index}
                                    className={styles.QuestionLink}
                                    onClick={() =>
                                      handleQuestionClick(
                                        number,
                                        relatedSlugs[locale],
                                      )
                                    }
                                  >
                                    #{number}. {relatedTitles[locale]}
                                  </div>
                                );
                              }

                              return null;
                            },
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <ModalRaiting id={el.number} type="question" />
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    )
  );
};

export default UXCGModalMobile;
