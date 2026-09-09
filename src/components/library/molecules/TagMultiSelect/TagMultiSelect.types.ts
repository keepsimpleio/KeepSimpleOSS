import { ITagAttributes } from '@local-types/library/tag';

export interface TagOption extends Pick<ITagAttributes, 'name' | 'color'> {
  id: number;
}

export interface TagMultiSelectProps {
  options: TagOption[];
  value: TagOption[];
  onChange: (next: TagOption[]) => void;
  placeholder?: string;
  emptyState?: string;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  /**
   * Render the menu via `createPortal(document.body)` with fixed positioning
   * glued to the trigger. Use inside scrolling containers (modals) so the menu
   * isn't clipped by `overflow`. Defaults to `false`.
   */
  portal?: boolean;
  /**
   * `field` is the full-width form control: a labelled trigger with the chosen
   * tags as chips beneath it. `compact` is a single icon button for a row of
   * icon actions; its menu hangs from the button's right edge and the chosen
   * tags are shown by the surface itself, not by the control.
   */
  variant?: 'field' | 'compact';
  /** Compact only: the menu's width in px. Defaults to 260. */
  menuWidth?: number;
  /** Compact only: what the button says on hover, through the shared Tooltip. */
  hint?: string;
}
