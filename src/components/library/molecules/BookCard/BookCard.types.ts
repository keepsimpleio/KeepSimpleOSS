import type { IObject } from '@local-types/library/object';

export interface BookCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
  selected?: boolean;
  // When provided, a hover Select/Remove toggle is shown on the card.
  onSelectToggle?: () => void;
  // Disables the Select chip (e.g. share-selection cap reached) while still
  // allowing an already-selected card to be removed.
  selectDisabled?: boolean;
  // What is in the way when the Select chip is off (a private shelf, a full
  // share link). Said on the chip itself, so it is never a dead control.
  selectReason?: string;
  // Whether hovering the card opens its dossier. Compact tiles carry no
  // details of their own, so the dossier is the only place a viewer can read
  // what an object is; the selection panel switches it back on there.
  showHoverCard?: boolean;
  // Shrinks the card to a cover-only tile for the share-selection panel.
  compact?: boolean;
  // Passed through to the hover dossier, which names whoever rated the book.
  ownerUsername?: string;
  // Whether the book stands on the Favorites shelf. Shown as a star on the
  // cover for everyone once it is one.
  favorite?: boolean;
  // Owner's star: when provided, the star is a button that adds the book to
  // the Favorites shelf or takes it off. Absent for a visitor.
  onFavoriteToggle?: () => void;
  // True while a star press is being saved.
  favoriteBusy?: boolean;
  // The book stands on a private shelf and is drawn where that shelf is not:
  // in a tag's gathered row, which its owner alone sees it in. The cover is
  // veiled and marked so the owner reads at a glance that no visitor has it.
  hidden?: boolean;
}
