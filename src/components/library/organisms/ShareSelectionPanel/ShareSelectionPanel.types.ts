import type { IObject } from '@local-types/library/object';

export interface ShareSelectionPanelProps {
  // Objects in the order they'll be shared (owner) or were shared (recipient).
  objects: IObject[];
  // Decorates the generated share URL: `${DOMAIN}/library/${ownerUsername}/share/${token}`.
  ownerUsername: string;
  // Recipient view: sequence numbers, no remove/reorder/share controls.
  readOnly?: boolean;
  // Start open. The recipient asked to see the selection; handing them a
  // folded bar to open again would be a second click for the same request.
  initiallyExpanded?: boolean;
  // Selection hit the 21-object cap — show the warning copy.
  limitReached?: boolean;
  onReorder?: (next: IObject[]) => void;
  onRemove?: (id: number) => void;
  onClear?: () => void;
  // Recipient view only: open the object's overview modal on card click,
  // mirroring how a shelf card opens it.
  onObjectClick?: (object: IObject) => void;
  className?: string;
}
