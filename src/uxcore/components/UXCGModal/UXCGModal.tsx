import AnswerContentGenerator from '@uxcore/components/AnswerContentGenerator';
import LanguageSwitcher from '@uxcore/components/LanguageSwitcher';
import ModalRaiting from '@uxcore/components/ModalRaiting';
import RouteLoadingOverlay, {
  useRouteLoading,
} from '@uxcore/components/RouteLoadingOverlay';
import Tag from '@uxcore/components/Tag';
import Tooltip from '@uxcore/components/Tooltip';
import Share from '@uxcore/components/UXCGModalSubComponents/Share';
import modalIntl from '@uxcore/data/modal';
import useMobile from '@uxcore/hooks/useMobile';
import useTooltip from '@uxcore/hooks/useTooltip';
import {
  copyToClipboard,
  generateSocialLinks,
  updateVH,
} from '@uxcore/lib/helpers';
import type {
  QuestionType,
  StrapiBiasType,
  TagType,
} from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, {
  FC,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ThemeToggle from '@components/ThemeToggle';

import styles from './UXCGModal.module.scss';

type TUXCGModal = {
  questionId: number;
  answerId: number;
  biases: StrapiBiasType[];
  tags: TagType[];
  totalLength: number;
  onChangeQuestionId: (
    nextQuestionId: number,
    nextQuestionSlug: string,
  ) => void;
  data: QuestionType;
  setIsModalClosed: (isModalClosed: boolean) => void;
  closeModal: () => void;
  relatedQuestions: any;
  handleCopyLink: () => void;
  isCopyTooltipVisible: boolean;
  handleQuestionClick: (number: number, questionSlug: string) => void;
  nextQuestion?: string;
  prevQuestion?: string;
  id: number;
  slugs?: {
    en?: string;
    ru?: string;
    hy?: string;
  };
};

const UXCGModal: FC<TUXCGModal> = ({
  questionId,
  answerId,
  biases,
  tags,
  totalLength,
  data,
  setIsModalClosed,
  onChangeQuestionId,
  relatedQuestions,
  closeModal,
  handleCopyLink,
  handleQuestionClick,
  isCopyTooltipVisible,
  nextQuestion,
  prevQuestion,
  id,
  slugs,
}) => {
  const { isMobile } = useMobile()[1];
  const { setActiveTooltipId } = useTooltip()[0];
  const router = useRouter();

  const [isCopied, setIsCopied] = useState(false);

  const [highlightAnswer, setHighlightAnswer] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(105);
  const [isNavigating, startNavigation] = useRouteLoading();

  const modalBodyRef = useRef(null);
  const modalHeaderRef = useRef(null);
  const modalRef = useRef(null);

  const { locale } = router as TRouter;
  const isOpen = !!id;

  const handleArrowClick = useCallback(
    ({ active, dir }) => {
      if (active === 'true') {
        let nextQuestionId;
        if (dir === 'next') {
          nextQuestionId = id === 63 ? 1 : id + 1;
        } else {
          nextQuestionId = id === 1 ? 63 : id - 1;
        }
        const questionSlug = dir === 'next' ? nextQuestion : prevQuestion;
        startNavigation();
        onChangeQuestionId(nextQuestionId, questionSlug);
      }
    },
    [onChangeQuestionId, id, nextQuestion, prevQuestion, startNavigation],
  );

  const handleClose = useCallback(() => {
    startNavigation();
    closeModal();
  }, [closeModal, startNavigation]);

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

  useEffect(() => {
    if (answerId !== null) {
      const currentAnswer = document.querySelector(
        `.${styles.AnswerItem}[data-index="${answerId}"]`,
      );

      setTimeout(() => {
        setHighlightAnswer(true);

        if (currentAnswer && modalBodyRef.current) {
          const { top } = currentAnswer.getBoundingClientRect();
          const y = top - headerHeight - 28; // - paddings(20) - additional gap(2)
          modalBodyRef.current.scrollTo(0, y);
        }

        setTimeout(() => {
          setHighlightAnswer(false);
        }, 3000);
      }, 500);
    }
  }, [answerId]);

  useEffect(() => {
    // @ts-ignore
    const isChrome = !!window.chrome;
    const overflowDefaultValue = isChrome ? 'overlay' : 'auto';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        const arrowClickData: any = {};

        if (e.key === 'Escape') handleClose();
        if (e.key === 'ArrowLeft') {
          arrowClickData.active = String(id >= 1);
          arrowClickData.dir = 'prev';
          handleArrowClick(arrowClickData);
        }
        if (e.key === 'ArrowRight') {
          arrowClickData.active = String(id <= totalLength);
          arrowClickData.dir = 'next';
          handleArrowClick(arrowClickData);
        }
      }
    };

    if (isOpen) {
      handleHeightCalc();
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo(0, 0);
      }
      setActiveTooltipId(null);

      document.documentElement.style.overflowY = 'hidden';
      document.body.classList.add('hide-body-move');
    } else {
      document.documentElement.style.overflowY = overflowDefaultValue;
      document.body.classList.remove('hide-body-move');
    }

    document.addEventListener('keydown', handleKeyDown as any);

    return () => {
      document.documentElement.style.overflowY = overflowDefaultValue;
      document.body.classList.remove('hide-body-move');
      document.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [questionId, isOpen]);

  useEffect(() => {
    handleHeightCalc();

    window.addEventListener('resize', handleHeightCalc);

    return () => {
      window.removeEventListener('resize', handleHeightCalc);
    };
  }, [handleHeightCalc]);

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      const desiredTopPosition =
        scrollY + window.innerHeight / 2 - modal.offsetHeight / 2;
      modal.style.top = `${desiredTopPosition}px`;
    }
  }, []);

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

    const footerHeight = isMobile ? 100 : 105;
    const headerAndFooterHeights = headerHeight + footerHeight;
    const gaps = isMobile ? 56 : 95;

    const height = `calc(${windowHeight} - ${headerAndFooterHeights}px - ${gaps}px)`;

    return {
      height,
    };
  }, [headerHeight]);

  if (!isOpen) return null;

  const routes = {
    en: '/',
    ru: '/ru',
    hy: '/hy',
  };

  const {
    copyLink,
    copied,
    share,
    answersLabel,
    relatedQuestionsLabel,
    nextLabel,
    prevLabel,
  } = modalIntl[locale];

  const {
    number,
    titleEn,
    titleRu,
    titleHy,
    tags: modalTags,
    answersEn,
    answersRu,
    answersHy,
  } = data;

  const titles = {
    en: titleEn,
    ru: titleRu,
    hy: titleHy,
  };
  const answersByLocale = {
    en: answersEn,
    ru: answersRu,
    hy: answersHy,
  };
  const title = titles[locale];
  const answers = answersByLocale[locale].split('\n');
  const copyText = isCopied ? copied : copyLink;

  const { linkedIn, facebook, tweeter } = generateSocialLinks(
    process.env.NEXT_PUBLIC_DOMAIN + `${routes[locale]}${router.asPath}`,
    titles[locale],
  );

  return (
    <div className={styles.ModalOverlay} onClick={handleClose} ref={modalRef}>
      <div
        className={cn(styles.Modal, {
          [styles.hyLang]: locale === 'hy',
        })}
        onClick={handleModalClick}
      >
        <div className={styles.ModalHeader} ref={modalHeaderRef}>
          <div className={styles.ModalHeaderTop}>
            <span className={styles.Number}>#{number}</span>
            <div className={styles.ModalHeaderTags}>
              {modalTags.map(tagId => {
                const tagData = tags.find(({ id }) => id === tagId);
                return (
                  <Tag
                    key={tagId}
                    {...tagData}
                    tooltipPosition="bottom"
                    dataCy={'modal-tag'}
                  />
                );
              })}
            </div>
            <div className={styles.ModalHeaderCloseButtonContainer}>
              <ThemeToggle />
              <LanguageSwitcher
                section={'uxcg'}
                withFlag
                languageSwitchSlugs={slugs}
              />
              <div className={styles.ModalHeaderCloseButton}>
                <img
                  src="/assets/biases/cross.svg"
                  onClick={handleClose}
                  alt="modal close button"
                />
              </div>
            </div>
          </div>
          <h1 className={styles.ModalHeaderTitle}>{title}</h1>
          <div className={styles.ModalHeaderLinks}>
            <div
              onClick={handleCopyLink}
              className={styles.CopyText}
              data-cy="copy-container"
            >
              <span data-cy="copy-text"> {copyLink} </span>
              <span
                className={cn(styles.Tooltip, {
                  [styles.Visible]: isCopyTooltipVisible,
                })}
                data-cy="copy-tooltip"
              >
                {copied}
              </span>
            </div>
            <Share
              shareTxt={share}
              linkedIn={linkedIn}
              facebook={facebook}
              tweeter={tweeter}
            />
          </div>
        </div>
        <div className={styles.ModalBody} ref={modalBodyRef} style={bodyStyles}>
          <h2 className={styles.PossibleAnswers}>
            {answersLabel} ({answers.length})
          </h2>
          <div className={styles.ModalBodyContent}>
            {answers.map((answer: string, index: number) => (
              <div
                key={index}
                data-index={index}
                className={cn(styles.AnswerItem, {
                  [styles.Higlighted]: index === answerId && highlightAnswer,
                })}
              >
                <Tooltip content={copyText} dark>
                  <Image
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
          {relatedQuestions.length > 0 && (
            <>
              <h2 className={styles.RelatedQuestionTitle}>
                {relatedQuestionsLabel}
              </h2>
              <div className={styles.ModalBodyContent}>
                {relatedQuestions.map((question, index) => {
                  const { titleEn, titleRu, titleHy } = question;
                  const relatedTitles = {
                    en: titleEn,
                    ru: titleRu,
                    hy: titleHy,
                  };
                  const slugs = {
                    en: question.slugEn,
                    ru: question.slugRu,
                    hy: question.slugHy,
                  };
                  const relatedTitle = relatedTitles[locale];
                  return (
                    <div
                      data-number={question.number}
                      key={index}
                      className={styles.QuestionLink}
                      data-cy={'related-question'}
                      onClick={() => {
                        startNavigation();
                        handleQuestionClick(question.number, slugs[locale]);
                      }}
                    >
                      <span className={styles.questionNumber}>
                        #{question.number}.
                      </span>
                      <p className={styles.title}>{relatedTitle}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <ModalRaiting id={id} type="question" />
        </div>
        <div className={styles.MobileNavButtons}>
          <button
            type="button"
            className={styles.MobileNavButton}
            data-cy="mobile-prev"
            onClick={() => handleArrowClick({ active: 'true', dir: 'prev' })}
          >
            <img src="/assets/biases/caret-left.svg" alt="" />
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.MobileNavButton}
            data-cy="mobile-next"
            onClick={() => handleArrowClick({ active: 'true', dir: 'next' })}
          >
            {nextLabel}
            <img src="/assets/biases/caret-right.svg" alt="" />
          </button>
        </div>
        <div className={styles.ModalButtons}>
          <div
            data-cy="arrow-prev"
            className={cn(styles.ModalButton, {})}
            data-active={id >= 1}
            data-dir="prev"
            // @ts-ignore
            onClick={e => handleArrowClick(e.currentTarget.dataset)}
          >
            <img src="/assets/biases/caret-left.svg" alt="previous bias" />
          </div>
          <div
            data-cy="arrow-next"
            className={cn(styles.ModalButton, {})}
            data-active={id <= 63}
            data-dir="next"
            // @ts-ignore
            onClick={e => handleArrowClick(e.currentTarget.dataset)}
          >
            <img src="/assets/biases/caret-right.svg" alt="next bias" />
          </div>
        </div>
      </div>
      <RouteLoadingOverlay active={isNavigating} />
    </div>
  );
};

export default UXCGModal;
