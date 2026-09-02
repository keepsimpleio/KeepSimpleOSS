import classNames from 'classnames';
import React, {
  JSX,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useLockBodyScroll } from '@hooks/library/useLockBodyScroll';

import { CloseIcon } from '@icons/library/svg';

import { InkLine } from '@components/library/atoms/InkLine';
import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { ModalProps } from './Modal.types';

import styles from './Modal.module.scss';

// Keep in sync with the fade-out duration in Modal.module.scss.
const CLOSE_ANIMATION_MS = 180;

export function Modal(props: ModalProps): JSX.Element {
  const { className, title, wrapperClassName, onClose, closeRef, children } =
    props;
  const titleId = useId();

  const [isClosing, setIsClosing] = useState(false);

  // Close only when a click both starts and ends on the backdrop itself
  // (`target === currentTarget`). Tracking the pointerdown target avoids a
  // drag that starts inside the modal and releases on the backdrop from
  // closing it, and sidesteps the document-listener races that made the X
  // button and backdrop clicks flaky.
  const pressedOnBackdrop = useRef(false);

  // Play the fade-out, then unmount. requestClose flips isClosing; the effect
  // below fires the real onClose once the animation has had time to run.
  const requestClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  // Expose the animated close so a modal's own content buttons (Cancel/Close)
  // can trigger the same fade-out instead of unmounting instantly.
  useEffect(() => {
    if (!closeRef) return;
    closeRef.current = requestClose;
    return () => {
      closeRef.current = null;
    };
  }, [closeRef, requestClose]);

  useEffect(() => {
    if (!isClosing) return;

    // Fire the real close, then drop back to the open state. If onClose
    // unmounts us (the usual case) this re-render is discarded; if onClose was
    // a guarded no-op (e.g. a confirm dialog is open on top), we revert instead
    // of getting stuck faded-out-but-mounted.
    const finish = () => {
      onClose();
      setIsClosing(false);
    };

    // Skip the delay under reduced-motion (and as a safety net) so the modal
    // can never get stuck open waiting on an animation that never plays.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      finish();
      return;
    }

    const timer = window.setTimeout(finish, CLOSE_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [isClosing, onClose]);

  const handleBackdropPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    pressedOnBackdrop.current = event.target === event.currentTarget;
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && pressedOnBackdrop.current) {
      requestClose();
    }
    pressedOnBackdrop.current = false;
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc);
  }, [requestClose]);

  useLockBodyScroll(true);

  return createPortal(
    <div className="library">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={classNames(styles.modal, wrapperClassName, {
          [styles.closing]: isClosing,
        })}
        onPointerDown={handleBackdropPointerDown}
        onClick={handleBackdropClick}
      >
        <div className={classNames(styles.content, className)}>
          {title && (
            <>
              <div className={styles.header}>
                <Text
                  id={titleId}
                  className={styles.title}
                  variant={TypographyVariant.SubtitleSecondaryAlt}
                >
                  {title}
                </Text>
                <button
                  type="button"
                  className={styles.close}
                  aria-label="Close"
                  onClick={requestClose}
                >
                  <CloseIcon width={24} height={24} />
                </button>
              </div>
              {/* Same drawn rule as the sidebar sections, in place of the boxed
                  1px header border; the wobble varies with the title. */}
              <InkLine seed={title.length} className={styles.headerRule} />
            </>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
