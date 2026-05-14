import { useRouter } from 'next/router';
import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import type { TRouter } from '@uxcore/local-types/global';

import useFormPopup from '@uxcore/hooks/useFormPopup';

import formPopupIntl from '@uxcore/data/formPopup';

import Button from '@uxcore/components/Button';

import styles from './FormPopup.module.scss';

const FormPopup = () => {
  const [{ togglePopupVisibiity }, { isVisible }] = useFormPopup();
  const router = useRouter();
  const { locale } = router as TRouter;
  const [container, setContainer] = useState(null);
  // HYTranslation TODO
  const { title, buttonLabel } =
    locale === 'hy' ? formPopupIntl['en'] : formPopupIntl[locale];

  const handleClose = useCallback(() => {
    if (isVisible) {
      togglePopupVisibiity();
    }
  }, [togglePopupVisibiity, isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    // @ts-ignore
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // @ts-ignore
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setContainer(document.body);
    }
  }, []);

  if (!isVisible || !container) return null;

  return (
    <>
      {createPortal(
        <div className={styles.ModalOverlay} onClick={handleClose}>
          <div className={styles.Modal} onClick={e => e.stopPropagation()}>
            <div className={styles.ModalHeader}>
              <div className={styles.ModalHeaderBody} />
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
            <div className={styles.ModalBody}>{title}</div>
            <div className={styles.ModalFooter}>
              <Button
                label={buttonLabel}
                type="primary"
                onClick={handleClose}
              />
            </div>
          </div>
        </div>,
        container,
      )}
    </>
  );
};

export default FormPopup;
