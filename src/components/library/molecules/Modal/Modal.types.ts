import { MutableRefObject, ReactNode } from 'react';

export interface ModalProps {
  title?: string;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  // A close that finishes later (a route change) returns its promise; the
  // modal stays faded out until it settles instead of flashing back.
  onClose: () => void | Promise<unknown>;
  // Modal assigns its animated-close fn here so a modal's own content buttons
  // (Cancel/Close/etc.) can trigger the same fade-out the backdrop and Esc use.
  closeRef?: MutableRefObject<(() => void) | null>;
}
