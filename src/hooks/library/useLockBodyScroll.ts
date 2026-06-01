import { useEffect } from 'react';

// Module-level counter so nested modals (e.g. ObjectOverviewModal opening a
// ConfirmationModal) compose: lock when the count goes 0→1, unlock when it
// returns to 0.
let lockCount = 0;
let savedPaddingRight = '';

const lock = () => {
  if (lockCount === 0) {
    // Compensate for the vanishing scrollbar with padding-right so the page
    // doesn't reflow under the modal (which read as "right-panel data
    // disappearing" — the sticky Sidebar was shifting off-screen).
    // `scrollbar-gutter: stable` does not apply with overflow:hidden per spec.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    savedPaddingRight = document.body.style.paddingRight;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
};

const unlock = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = savedPaddingRight;
  }
};

export const useLockBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return;
    lock();
    return () => unlock();
  }, [isOpen]);
};
