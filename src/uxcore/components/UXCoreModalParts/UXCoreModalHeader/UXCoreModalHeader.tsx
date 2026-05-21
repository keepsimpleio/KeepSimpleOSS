import LanguageSwitcher from '@uxcore/components/LanguageSwitcher';
import cn from 'classnames';
import React, { FC } from 'react';

import ThemeToggle from '@components/ThemeToggle';

import styles from './UXCoreModalHeader.module.scss';

type UXCoreModalHeaderProps = {
  number?: number;
  title: string;
  p?: boolean;
  m?: boolean;
  productValue?: string;
  managementValue?: string;
  wikiLink?: string;
  handleCopyLink?: () => void;
  copyLink?: string;
  isCopyTooltipVisible?: boolean;
  copied?: string;
  share?: string;
  linkedIn?: string;
  facebook?: string;
  tweeter?: string;
  onClose?: () => void;
  slugs?: Record<string, string>;
};

const UXCoreModalHeader: FC<UXCoreModalHeaderProps> = ({
  number,
  p,
  m,
  managementValue,
  productValue,
  title,
  share,
  wikiLink,
  copied,
  handleCopyLink,
  copyLink,
  isCopyTooltipVisible,
  linkedIn,
  facebook,
  tweeter,
  onClose,
  slugs,
}) => {
  return (
    <div className={styles.modalHeader}>
      <div className={styles.headerTop}>
        <div className={styles.modalHeaderArticleInfo}>
          <span>#{number}</span>
          {p && (
            <img
              src="/assets/biases/p-rounded.svg"
              title={productValue}
              alt="product-value-icon"
              width={12}
              height={12}
            />
          )}
          {m && (
            <img
              src="/assets/biases/m-rounded.svg"
              title={managementValue}
              alt="management-value-icon"
            />
          )}
        </div>
        <div
          className={cn(styles.modalHeaderTitleContainer, {
            [styles.longTxt]: number === 7 || number === 19 || number === 87,
          })}
        >
          <h1 className={styles.modalHeaderTitle}>{title}</h1>
          <a href={wikiLink} target="_blank" className={styles.wikiLink}>
            <img src="/assets/biases/wiki-logo.svg" alt="wiki-link" />
          </a>
        </div>
        <div
          className={cn(styles.LangAndCloseBtn, {
            [styles.LangAndCloseBtnLongTxt]:
              number === 7 || number === 19 || number === 87,
          })}
        >
          <ThemeToggle />
          <LanguageSwitcher section={'uxcore'} languageSwitchSlugs={slugs} />
          <img
            src="/assets/biases/cross.svg"
            onClick={onClose}
            alt="modal close button"
            className={styles.closeBtn}
            data-cy="uxcore-modal-close-button"
          />
        </div>
      </div>
      <div className={styles.modalHeaderLeft}>
        <div className={styles.modalHeaderLeftBottom}>
          <div
            onClick={handleCopyLink}
            className={styles.copy}
            data-cy="copy-container"
          >
            <span className={styles.copyTxt} data-cy="copy-text">
              {copyLink}
            </span>
            <span
              className={cn(styles.tooltip, {
                [styles.visible]: isCopyTooltipVisible,
              })}
              data-cy="copy-tooltip"
            >
              {copied}
            </span>
          </div>
          <div className={styles.share}>
            <span> {share} </span>
            <div className={styles.tooltip}>
              <a href={linkedIn} target="_blank" title="LinkedIn">
                <img
                  src="/assets/biases/linkedin.svg"
                  alt="linked-in-share-button"
                />
              </a>
              <a href={facebook} target="_blank" title="Facebook">
                <img
                  src="/assets/biases/facebook.svg"
                  alt="facebook-share-button"
                />
              </a>
              <a href={tweeter} target="_blank" title="Twitter">
                <img
                  src="/assets/biases/TwitterX.svg"
                  alt="tweeter-share-button"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UXCoreModalHeader;
