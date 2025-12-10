import React, { FC, KeyboardEvent, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';

import Image from 'next/image';
import styles from './Modal.module.scss';

type ModalProps = {
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
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
  removeBorderMobile?: boolean;
  disableBackgroundClick?: boolean;

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
  grayTitle,
  dataCy,
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
          [wrapperClassName]: wrapperClassName,
          [styles.fullSizeMobile]: fullSizeMobile,
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
            <div className={styles.closeIconWrapper} onClick={onClick}>
              <div className={`${styles.lineWrapper} ${styles.rightWrapper}`}>
                <Image
                  src="/assets/close-right-line.svg"
                  alt="close right line"
                  width={24}
                  height={24}
                  className={styles.lineImage}
                />
              </div>
              <div className={`${styles.lineWrapper} ${styles.leftWrapper}`}>
                <Image
                  src="/assets/close-left-line.svg"
                  alt="close left line"
                  width={24}
                  height={24}
                  className={styles.lineImage}
                />
              </div>
            </div>
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
