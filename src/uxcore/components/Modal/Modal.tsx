import cn from 'classnames';
import React, { FC, KeyboardEvent, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

import styles from './Modal.module.scss';

type ModalProps = {
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'custom-decision-table' | 'bob-modal';
  onClick?: () => void;
  title?: string | ReactNode;
  close?: boolean;
  hasBorder?: boolean;
  withoutHeader?: boolean;
  isConfirmationModal?: boolean;
  blackTitle?: boolean;
  removeHeader?: boolean;
  className?: string;
  bodyClassName?: string;
  wrapperClassName?: string;
  fullSizeMobile?: boolean;
  fullHeightMobile?: boolean;
  removeBorderMobile?: boolean;
  disableBackgroundClick?: boolean;
  disableClose?: boolean;
  grayTitle?: boolean;
  dataCy?: string;
};

const Modal: FC<ModalProps> = ({
  size,
  close,
  title,
  onClick,
  children,
  hasBorder,
  className,
  blackTitle,
  removeHeader,
  bodyClassName,
  withoutHeader,
  wrapperClassName,
  isConfirmationModal,
  removeBorderMobile,
  fullSizeMobile,
  disableBackgroundClick,
  disableClose,
  grayTitle,
  dataCy,
  fullHeightMobile,
}) => {
  const handleClose = () => {
    onClick();
  };

  useEffect(() => {
    if (!isConfirmationModal) {
      // @ts-ignore
      const isChrome = !!window.chrome;
      const overflowDefaultValue = isChrome ? 'overlay' : 'auto';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!close) {
          if (e.key === 'Escape') handleClose();
        }
      };

      if (!close) {
        document.documentElement.style.overflowY = 'hidden';
        document.body.classList.add('hide-body-move');
      } else {
        document.documentElement.style.overflowY = overflowDefaultValue;
        document.body.classList.remove('hide-body-move');
      }

      // @ts-ignore
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.documentElement.style.overflowY = overflowDefaultValue;
        document.body.classList.remove('hide-body-move');
        // @ts-ignore
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [close]);

  return createPortal(
    <div
      className={cn(styles.overlay, {
        [className]: className,
      })}
      data-cy={dataCy}
    >
      <div
        className={styles.background}
        onClick={!disableBackgroundClick ? handleClose : () => {}}
        data-cy={'modal-background-click'}
      />
      <div
        className={cn(styles.wrapper, styles.small, {
          [styles.large]: size === 'large',
          [styles.medium]: size === 'medium',
          [styles.customDecisionTable]: size === 'custom-decision-table',
          [styles.bobModal]: size === 'bob-modal',
          [wrapperClassName]: wrapperClassName,
          [styles.fullSizeMobile]: fullSizeMobile,
          [styles.fullHeightMobile]: fullHeightMobile,
        })}
      >
        {!removeHeader && (
          <div
            className={cn(styles.header, {
              [styles.hasBorder]: hasBorder,
              [styles.removeBorderMobile]: removeBorderMobile,
              [styles.withoutHeader]: withoutHeader,
            })}
          >
            <span
              className={cn(styles.title, {
                [styles.blackTitle]: blackTitle,
                [styles.grayTitle]: grayTitle,
              })}
            >
              {title}
            </span>
            {!disableClose && (
              <img
                src="/assets/biases/cross.svg"
                alt="modal close button"
                className={styles.closeBtn}
                onClick={handleClose}
              />
            )}
          </div>
        )}
        {withoutHeader && (
          <img
            src="/assets/biases/close-icon-white.svg"
            alt="modal close button"
            className={styles.closeBtnWithoutHeader}
            onClick={handleClose}
          />
        )}
        <div
          className={cn(styles.body, {
            [bodyClassName]: bodyClassName,
          })}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
