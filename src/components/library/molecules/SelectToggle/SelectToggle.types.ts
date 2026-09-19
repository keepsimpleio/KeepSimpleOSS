export interface SelectToggleProps {
  selected: boolean;
  onToggle: () => void;
  className?: string;
  // Blocks adding once the share-selection cap is reached, or while the object
  // sits on a private shelf. A selected toggle is never disabled, so the object
  // can still be removed.
  disabled?: boolean;
  // What is in the way, said on the chip itself while it is off ('Shelf is
  // private', 'Link is full'). Without it a disabled chip is a dead control
  // with no explanation.
  reason?: string;
}
