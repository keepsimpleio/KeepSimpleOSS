export interface TagProps {
  label?: string;
  color?: string;
  className?: string;
  /**
   * The library is filtered down to this tag. Marked with a ring rather than a
   * size or a shape, so a row of tags never reflows as one is chosen.
   */
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}
