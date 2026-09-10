import type { MagicShelfSlot } from '@hooks/library/useMagicBooks';

export interface MagicBookBriefProps {
  /** The shelf's slot as the engine reports it; re-rolls update it in place. */
  slot: MagicShelfSlot;
  /** The shelf the pick stands on, for the heading. */
  shelfName: string;
  onClose: () => void;
}
