export interface SharedWithYouModalProps {
  // Display name (or username) of the library owner who minted the link.
  ownerName: string;
  // How many objects the link carries — shown so the recipient knows the size
  // of the selection before opening it.
  itemCount: number;
  onViewSelection: () => void;
  onClose: () => void;
}
