import { useEffect } from 'react';

// Module-level counter so nested modals (e.g. ObjectOverviewModal opening a
// ConfirmationModal) compose: lock when the count goes 0→1, unlock when it
// returns to 0.
let lockCount = 0;
let savedOverflowY = '';
let savedScrollY = 0;
let savedBodyStyle = { position: '', top: '', left: '', right: '', width: '' };

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

    // iOS Safari ignores overflow on the root for touch scrolling: a swipe on
    // the modal still dragged the page underneath. The only lock it honours
    // is taking the page out of the scroll flow — pin <body> where the user
    // was and give the height back on unlock. Scrollers inside the modal
    // keep working, since they are their own overflow contexts.
    const { body } = document;
    savedScrollY = window.scrollY;
    savedBodyStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  }
  lockCount += 1;
};

const unlock = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const root = document.documentElement;
    const { body } = document;
    body.style.position = savedBodyStyle.position;
    body.style.top = savedBodyStyle.top;
    body.style.left = savedBodyStyle.left;
    body.style.right = savedBodyStyle.right;
    body.style.width = savedBodyStyle.width;
    // Restoring the inline style to its prior value (usually '') lets the
    // stylesheet's `overflow-y: overlay` take back over.
    root.style.overflowY = savedOverflowY;
    root.classList.remove('hide-body-move');
    // Put the page back exactly where it was before the pin; without this the
    // user lands at the top after every modal.
    window.scrollTo(0, savedScrollY);
  }
};

export const useLockBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return;
    lock();
    return () => unlock();
  }, [isOpen]);
};
