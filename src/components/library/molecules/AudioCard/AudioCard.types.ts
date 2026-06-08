import type { IObject } from '@local-types/library/object';

export interface AudioCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
  selected?: boolean;
  // When provided, a hover Select/Remove toggle is shown on the card.
  onSelectToggle?: () => void;
}
