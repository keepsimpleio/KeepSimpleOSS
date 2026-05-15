import HrIcon from '@uxcore/assets/icons/HrIcon';
import ProductIcon from '@uxcore/assets/icons/ProductIcon';
import BiasBody from '@uxcore/components/_biases/BiasBody';
import ContentParser from '@uxcore/components/ContentParser';
import ModalRaiting from '@uxcore/components/ModalRaiting';
import Spinner from '@uxcore/components/Spinner';
import Table from '@uxcore/components/Table';
import UXCoreModalHeader from '@uxcore/components/UXCoreModalParts/UXCoreModalHeader';
import modalIntl from '@uxcore/data/modal';
import { copyToClipboard, generateSocialLinks } from '@uxcore/lib/helpers';
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
  toggleIsProductView: () => void;
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
  toggleIsProductView,
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
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
  const [isQuestionHovered, setIsQuestionHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tooltipTimer: { current: any } = useRef();
  const modalBodyRef = useRef(null);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const { locale } = router as TRouter;
  const isOpen = !!biasNumber && data;

  const handlePageViewChange = useCallback(
    e => {
      const { type } = e.currentTarget.dataset;
      if ((type === secondViewLabel) !== isSecondView) {
        toggleIsProductView();
      }
    },
    [isSecondView, toggleIsProductView],
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const arrowClickData: any = {};

      if (e.key === 'Escape') onClose();
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
  }, [biasNumber, handleArrowClick, isOpen]);

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
  } = modalIntl[locale];

  const { linkedIn, facebook, tweeter } = generateSocialLinks(
    shareUrl,
    data.title,
  );

  return isLoading ? (
    <Spinner />
  ) : (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div
        className={cn(styles.Modal, {
          [styles.hyLang]: locale === 'hy',
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
          onClose={onClose}
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
            <div className={styles.switcher}>
              <div
                onClick={handlePageViewChange}
                data-cy="switch-product"
                data-type={defaultViewLabel}
                className={cn(styles.switcherItem, {
                  [styles.activeProduct]: !isProductView,
                })}
              >
                <ProductIcon />
                <span className={styles.switcherItemText}> {productText}</span>
              </div>
              <div
                onClick={handlePageViewChange}
                data-cy="switch-hr"
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
              data={!isProductView ? data.usage : data.usageHr}
              styles={styles}
            />
          </div>
          {data.title && <BiasBody biasNumber={biasNumber} locale={locale} />}
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
        </div>
        <ModalRaiting id={biasNumber} type="bias" />
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
    </div>
  );
};

export default UXCoreModal;
