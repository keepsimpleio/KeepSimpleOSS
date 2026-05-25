import customModalData from '@uxcore/data/customModal';
import type { TagType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { AddQuestion, ContactUs } from './contentTypes';

import styles from './CustomModal.module.scss';

type ContentTypes = 'contactUs' | 'addQuestion';
type CustomModalProps = {
  isVisible: boolean;
  contentType: ContentTypes;
  tags?: TagType[];
  onClose: () => void;
};

const CustomModal: FC<CustomModalProps> = ({
  isVisible,
  onClose,
  contentType,
  tags,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { titles } = customModalData[locale];
  const [closing, setClosing] = useState(false);

  // Trigger fade-out CSS animation, then unmount on next tick.
  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 180);
  };

  // Mount-time Escape listener reads handleClose through a ref so the
  // `closing` guard inside handleClose sees the latest value on a second
  // press during the 180ms fade-out.
  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseRef.current();
    };

    // @ts-ignore
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // @ts-ignore
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // @ts-ignore
    const isChrome = !!window.chrome;
    const overflowDefaultValue = isChrome ? 'overlay' : 'auto';

    if (isVisible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = overflowDefaultValue;
    }

    return () => {
      document.documentElement.style.overflowY = overflowDefaultValue;
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {createPortal(
        <div
          className={cn(styles.ModalOverlay, {
            [styles.ModalOverlayClosing]: closing,
          })}
          onClick={handleClose}
          data-cy={'custom-modal-close'}
        >
          <div
            data-cy={'custom-modal-content'}
            className={cn(styles.Modal, {
              [styles.hyLang]: locale === 'hy',
              [styles.ModalClosing]: closing,
            })}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.ModalHeader}>
              <div className={styles.ModalHeaderBody}>
                {titles[contentType]}
              </div>
              <div className={styles.ModalHeaderCloseButtonContainer}>
                <div className={styles.ModalHeaderCloseButton}>
                  <img
                    src="/assets/biases/cross.svg"
                    onClick={handleClose}
                    alt="modal close button"
                  />
                </div>
              </div>
            </div>
            <div className={styles.ModalBody}>
              {contentType === 'addQuestion' && (
                <AddQuestion closeModal={handleClose} tags={tags} />
              )}
              {contentType === 'contactUs' && (
                <ContactUs closeModal={handleClose} />
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default CustomModal;
