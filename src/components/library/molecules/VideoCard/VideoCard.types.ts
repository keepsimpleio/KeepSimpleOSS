import type { IObject } from '@local-types/library/object';

export interface VideoCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
  selected?: boolean;
  // When provided, a hover Select/Remove toggle is shown on the card.
  onSelectToggle?: () => void;
  // Disables the Select chip (e.g. share-selection cap reached) while still
  // allowing an already-selected card to be removed.
  selectDisabled?: boolean;
  // Whether hovering the card opens its dossier. Compact tiles carry no
  // details of their own, so the dossier is the only place a viewer can read
  // what an object is; the selection panel switches it back on there.
  showHoverCard?: boolean;
  // Shrinks the card to a thumbnail-only tile for the share-selection panel.
  compact?: boolean;
}
