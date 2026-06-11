import { MutableRefObject, ReactNode } from 'react';

export interface ModalProps {
  title?: string;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  onClose: () => void;
  // Modal assigns its animated-close fn here so a modal's own content buttons
  // (Cancel/Close/etc.) can trigger the same fade-out the backdrop and Esc use.
  closeRef?: MutableRefObject<(() => void) | null>;
}
