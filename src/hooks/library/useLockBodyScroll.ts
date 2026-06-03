import { useEffect } from 'react';

// Module-level counter so nested modals (e.g. ObjectOverviewModal opening a
// ConfirmationModal) compose: lock when the count goes 0→1, unlock when it
// returns to 0.
let lockCount = 0;
let savedOverflowY = '';

const lock = () => {
  if (lockCount === 0) {
    // The page scroll container is <html> (`html { overflow-y: overlay }` in
    // globals.scss), NOT <body> — so locking body.overflow left the background
    // scrolling behind the modal. Match keepsimple's core Modal: lock the
    // documentElement's overflow and flag it with `hide-body-move`. The global
    // `html { scrollbar-gutter: stable }` keeps the gutter reserved, so there's
    // no horizontal jump when the scrollbar vanishes.
    const root = document.documentElement;
    savedOverflowY = root.style.overflowY;
    root.style.overflowY = 'hidden';
    root.classList.add('hide-body-move');
  }
  lockCount += 1;
};

const unlock = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const root = document.documentElement;
    // Restoring the inline style to its prior value (usually '') lets the
    // stylesheet's `overflow-y: overlay` take back over.
    root.style.overflowY = savedOverflowY;
    root.classList.remove('hide-body-move');
  }
};

export const useLockBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return;
    lock();
    return () => unlock();
  }, [isOpen]);
};
