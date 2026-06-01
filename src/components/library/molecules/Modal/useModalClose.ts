'use client';

import { useCallback, useRef } from 'react';

// Wires a modal's own content buttons (Cancel/Close/etc.) into the Modal's
// fade-out: pass `closeRef` to <Modal> and use `close` as the buttons' onClick.
// Falls back to the raw handler until the Modal has registered its animated
// close, so a click can never be dropped.
export function useModalClose(onClose: () => void): {
  closeRef: React.MutableRefObject<(() => void) | null>;
  close: () => void;
} {
  const closeRef = useRef<(() => void) | null>(null);
  const close = useCallback(() => {
    (closeRef.current ?? onClose)();
  }, [onClose]);

  return { closeRef, close };
}
