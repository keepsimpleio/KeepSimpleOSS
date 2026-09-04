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

// Modals stack (a confirmation over an overview, a success card over a form),
// and every layer used to listen for Escape on its own: one keypress tore the
// whole stack down. The stack records mount order so only the topmost layer
// answers Escape; the ones beneath wait their turn.
const modalStack: symbol[] = [];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal(props: ModalProps): JSX.Element {
  const { className, title, wrapperClassName, onClose, closeRef, children } =
    props;
  const titleId = useId();

  const [isClosing, setIsClosing] = useState(false);
  const layerId = useRef<symbol>(Symbol('modal'));
  const contentRef = useRef<HTMLDivElement>(null);

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
    const id = layerId.current;
    modalStack.push(id);
    return () => {
      const index = modalStack.lastIndexOf(id);
      if (index !== -1) modalStack.splice(index, 1);
    };
  }, []);

  useEffect(() => {
    const isTopmost = () =>
      modalStack[modalStack.length - 1] === layerId.current;

    const handleKey = (event: KeyboardEvent) => {
      if (!isTopmost()) return;
      if (event.key === 'Escape') {
        requestClose();
        return;
      }
      // Keep Tab inside the dialog: the page underneath is inert while a modal
      // is up, so focus must never wander into it.
      if (event.key === 'Tab' && contentRef.current) {
        const focusable = Array.from(
          contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter(
          el => el.offsetParent !== null || el === document.activeElement,
        );
        if (focusable.length === 0) {
          event.preventDefault();
          contentRef.current.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const inside = !!active && contentRef.current.contains(active);
        if (event.shiftKey && (!inside || active === first)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (!inside || active === last)) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [requestClose]);

  // Focus lands inside the dialog on open and returns to the control that
  // opened it on close, so a keyboard user is never left on a hidden page.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const content = contentRef.current;
    if (content) {
      const first = content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (first ?? content).focus({ preventScroll: true });
    }
    return () => {
      if (previous && typeof previous.focus === 'function') {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);

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
        <div
          ref={contentRef}
          tabIndex={-1}
          className={classNames(styles.content, className)}
        >
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
