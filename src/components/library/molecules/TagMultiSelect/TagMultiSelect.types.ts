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
}
