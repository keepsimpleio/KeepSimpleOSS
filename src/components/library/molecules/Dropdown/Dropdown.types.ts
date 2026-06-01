import { ReactNode } from 'react';

export interface DropdownSubOption {
  value: string;
  label: string;
}

export interface DropdownOption {
  value: string;
  label: string;
  subOptions?: DropdownSubOption[];
}

export interface DropdownProps {
  value?: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  customHeader?: ReactNode;
  menuClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
  /**
   * Render the menu via `createPortal(document.body)` with fixed positioning
   * glued to the trigger. Use inside scrolling containers (modals) so the
   * menu doesn't push the modal's body content. Defaults to `false`.
   */
  portal?: boolean;
  /**
   * Accessible label for the trigger. Defaults to `'Select option'`; pass a
   * context-specific label (e.g. `'Select library'`) where the dropdown's
   * purpose isn't conveyed by surrounding text.
   */
  ariaLabel?: string;
}
