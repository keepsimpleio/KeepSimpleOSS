export interface TagProps {
  label?: string;
  color?: string;
  className?: string;
  /**
   * The library is filtered down to this tag. Marked with a ring rather than a
   * size or a shape, so a row of tags never reflows as one is chosen.
   */
  active?: boolean;
  /**
   * What to say on hover instead of the label: why this tag is standing there
   * without a click to give. Shown through the shared Tooltip, the same way
   * every other disabled control in the Library explains itself.
   */
  hint?: string;
  onClick?: () => void;
  onRemove?: () => void;
}
