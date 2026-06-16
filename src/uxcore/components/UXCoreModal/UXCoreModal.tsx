import HrIcon from '@uxcore/assets/icons/HrIcon';
import { OffSecIcon, OffSecIconGrey } from '@uxcore/assets/icons/OffSecIcon';
import ProductIcon from '@uxcore/assets/icons/ProductIcon';
import BiasBody from '@uxcore/components/_biases/BiasBody';
import ContentParser from '@uxcore/components/ContentParser';
import ModalRaiting from '@uxcore/components/ModalRaiting';
import OffsecBiasView from '@uxcore/components/OffsecBiasView';
import Spinner from '@uxcore/components/Spinner';
import Table from '@uxcore/components/Table';
import UXCoreModalHeader from '@uxcore/components/UXCoreModalParts/UXCoreModalHeader';
import { getOffsecBiasContent } from '@uxcore/data/biasOffsec';
import modalIntl from '@uxcore/data/modal';
import useUXCoreGlobals from '@uxcore/hooks/useUXCoreGlobals';
import { copyToClipboard, generateSocialLinks } from '@uxcore/lib/helpers';
import { isOffsecEnabled } from '@uxcore/lib/offsec';
import type { QuestionType, TagType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import { useRouter } from 'next/router';
import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './UXCoreModal.module.scss';

type UXCoreModalProps = {
  biasNumber: number;
  questions: QuestionType[];
  tags: TagType[];
  onClose: () => void;
  onChangeBiasId: (nextBiasId: number, nextBiasName: string) => void;
  isProductView: boolean;
  isSecondView: boolean;
  secondViewLabel: string;
  setIsModalClosed: (isModalClosed: boolean) => void;
  defaultViewLabel: string;
  data?: any;
  headingTitle?: string;
  nextBiasName?: string;
  prevBiasName?: string;
  slugs?: Record<string, string>;
};

const UXCoreModal: FC<UXCoreModalProps> = ({
  biasNumber,
  questions,
  tags,
  onClose,
  onChangeBiasId,
  isProductView,
  isSecondView,
  data,
  setIsModalClosed,
  secondViewLabel,
  defaultViewLabel,
  headingTitle,
  nextBiasName,
  prevBiasName,
  slugs,
}) => {
  const router = useRouter();
  const [{ setUseCase }, { isOffsecView }] = useUXCoreGlobals();
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
  const [isQuestionHovered, setIsQuestionHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Closing the modal navigates back to the list route; on a slow connection
  // that hop is visibly delayed, so dim + spin until the route settles.
  const [isClosing, setIsClosing] = useState(false);
  const tooltipTimer: { current: any } = useRef();
  const modalBodyRef = useRef(null);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const { locale } = router as TRouter;
  const isOpen = !!biasNumber && data;
  // biasNumber flips instantly on Prev/Next tap, while data (and the title)
  // arrives only after the route change — dim everything until both agree so
  // the swap reads as a single motion instead of a staggered repaint.
  const isBiasSwitching = !!data && Number(data.number) !== Number(biasNumber);

  const handleUseCaseClick = useCallback(
    e => {
      const { usecase } = e.currentTarget.dataset;
      setUseCase(usecase as 'product' | 'hr' | 'offsec');
    },
    [setUseCase],
  );

  const handleCopyLink = useCallback(() => {
    copyToClipboard(window.location.href);
    setIsCopyTooltipVisible(true);

    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => {
      setIsCopyTooltipVisible(false);
    }, 2500);
  }, [copyToClipboard]);

  const handleArrowClick = useCallback(
    ({ active, dir }) => {
      if (active !== 'true') return;

      let nextBiasId: number;
      let biasName: string | undefined;

      if (dir === 'next') {
        nextBiasId = biasNumber === 105 ? 1 : biasNumber + 1;
        biasName = nextBiasName;
      } else {
        nextBiasId = biasNumber === 1 ? 105 : biasNumber - 1;
        biasName = prevBiasName;
      }

      if (biasName) {
        onChangeBiasId(nextBiasId, biasName);
      } else {
        console.warn('Bias name not available yet, skipping navigation.');
      }
    },
    [onChangeBiasId, biasNumber, nextBiasName, prevBiasName],
  );

  const handleModalClick = useCallback(e => {
    e.stopPropagation();
    setIsModalClosed(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const stop = () => setIsClosing(false);
    router.events.on('routeChangeComplete', stop);
    router.events.on('routeChangeError', stop);
    return () => {
      router.events.off('routeChangeComplete', stop);
      router.events.off('routeChangeError', stop);
    };
  }, [router.events]);

  // Each bias starts reading from the top; keep the page behind the modal
  // from scrolling along (iOS scroll chaining).
  useEffect(() => {
    modalBodyRef.current?.scrollTo?.(0, 0);
  }, [biasNumber]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const arrowClickData: any = {};

      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') {
        arrowClickData.active = String(biasNumber >= 1);
        arrowClickData.dir = 'prev';
        handleArrowClick(arrowClickData);
      }
      if (e.key === 'ArrowRight') {
        arrowClickData.active = String(biasNumber <= 105);
        arrowClickData.dir = 'next';
        handleArrowClick(arrowClickData);
      }
    };
    // @ts-ignore
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // @ts-ignore
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [biasNumber, handleArrowClick, handleClose, isOpen]);

  useEffect(() => {
    data ? setIsLoading(false) : setIsLoading(true);
  }, []);

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
    offsecText,
    offsecComingSoon,
    nextLabel,
    prevLabel,
  } = modalIntl[locale];

  const { linkedIn, facebook, tweeter } = generateSocialLinks(
    shareUrl,
    data.title,
  );

  return isLoading ? (
    <Spinner />
  ) : (
    <div className={styles.ModalOverlay} onClick={handleClose}>
      <div
        className={cn(styles.Modal, {
          [styles.hyLang]: locale === 'hy',
          [styles.biasSwitching]: isBiasSwitching,
        })}
        onClick={handleModalClick}
        data-cy="modal-body"
      >
        <UXCoreModalHeader
          title={headingTitle}
          p={data.p}
          m={data.m}
          wikiLink={data.wikiLink}
          number={data.number}
          productValue={productValue}
          managementValue={managementValue}
          onClose={handleClose}
          linkedIn={linkedIn}
          facebook={facebook}
          tweeter={tweeter}
          handleCopyLink={handleCopyLink}
          isCopyTooltipVisible={isCopyTooltipVisible}
          copied={copied}
          share={share}
          copyLink={copyLink}
          slugs={slugs}
        />
        <div className={styles.ModalBody} ref={modalBodyRef}>
          <div className={styles.ModalBodyTitle}>
            <span>{description}</span>
          </div>
          <div className={styles.ModalBodyContent}>
            <ContentParser data={data.description} styles={styles} />
          </div>
          <div className={styles.ModalBodyTitle}>
            <span className={styles.metaTitle}>{usage}</span>
          </div>
          <div className={styles.ModalBodyContent}>
            <div
              className={cn(styles.switcher, {
                [styles.twoCol]: !isOffsecEnabled,
              })}
            >
              <div
                onClick={handleUseCaseClick}
                data-cy="switch-product"
                data-usecase="product"
                className={cn(styles.switcherItem, {
                  [styles.activeProduct]: !isOffsecView && !isProductView,
                })}
              >
                <ProductIcon />
                <span className={styles.switcherItemText}> {productText}</span>
              </div>
              <div
                onClick={handleUseCaseClick}
                data-cy="switch-hr"
                data-usecase="hr"
                className={cn(styles.switcherItem, {
                  [styles.activeHr]: !isOffsecView && isProductView,
                })}
              >
                <HrIcon />
                <span className={styles.switcherItemText}> {hrText}</span>
              </div>
              {isOffsecEnabled && (
                <div
                  onClick={handleUseCaseClick}
                  data-cy="switch-offsec"
                  data-usecase="offsec"
                  className={cn(styles.switcherItem, {
                    [styles.activeOffsec]: isOffsecView,
                  })}
                >
                  {isOffsecView ? <OffSecIcon /> : <OffSecIconGrey />}
                  <span className={styles.switcherItemText}> {offsecText}</span>
                </div>
              )}
            </div>
            <div
              key={
                isOffsecView && isOffsecEnabled
                  ? 'offsec'
                  : isProductView
                    ? 'product'
                    : 'hr'
              }
              className={styles.usageFade}
            >
              {isOffsecView && isOffsecEnabled ? (
                (() => {
                  const offsecContent = getOffsecBiasContent(biasNumber);
                  return offsecContent ? (
                    <OffsecBiasView content={offsecContent} />
                  ) : (
                    <div className={styles.offsecComingSoon}>
                      {offsecComingSoon}
                    </div>
                  );
                })()
              ) : (
                <ContentParser
                  data={!isProductView ? data.usage : data.usageHr}
                  styles={styles}
                />
              )}
            </div>
          </div>
          {(!isOffsecView || !isOffsecEnabled) && data.title && (
            <BiasBody biasNumber={biasNumber} locale={locale} />
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
                  isUXCoreModal
                  showMoreButton
                  disableTooltips={false}
                  activeFilter={'all'}
                  data={questions}
                  tags={tags}
                  biasNumber={biasNumber}
                  setIsQuestionHovered={setIsQuestionHovered}
                />
              </div>
            </>
          )}
          <ModalRaiting id={biasNumber} type="bias" />
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
            aria-disabled={!prevBiasName}
            data-cy="arrow-prev"
            className={cn(styles.ModalButton, {
              [styles.Disabled]: !prevBiasName,
            })}
            data-active={biasNumber >= 1}
            data-dir="prev"
            // @ts-ignore
            onClick={e => handleArrowClick(e.currentTarget.dataset)}
          >
            <img src="/assets/biases/caret-left.svg" alt="previous bias" />
          </div>
          <div
            data-cy="arrow-next"
            className={cn(styles.ModalButton, {
              [styles.Disabled]: !nextBiasName,
            })}
            data-active={biasNumber <= 105}
            data-dir="next"
            // @ts-ignore
            onClick={e => handleArrowClick(e.currentTarget.dataset)}
          >
            <img src="/assets/biases/caret-right.svg" alt="next bias" />
          </div>
        </div>
      </div>
      {isClosing && (
        <div className={styles.ClosingOverlay} aria-live="polite">
          <span className={styles.ClosingSpinner} />
        </div>
      )}
    </div>
  );
};

export default UXCoreModal;
