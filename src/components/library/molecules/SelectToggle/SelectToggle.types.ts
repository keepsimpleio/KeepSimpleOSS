export interface SelectToggleProps {
  selected: boolean;
  onToggle: () => void;
  className?: string;
  // Blocks adding once the share-selection cap is reached. A selected toggle is
  // never disabled, so the object can still be removed.
  disabled?: boolean;
}
