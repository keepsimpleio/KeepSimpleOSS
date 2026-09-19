import type { MagicShelfSlot } from '@hooks/library/useMagicBooks';

export interface MagicBookCardProps {
  /** The shelf's slot as the engine reports it. */
  slot: MagicShelfSlot;
  /** The shelf the slot stands on, for the roll and the brief. */
  shelfName?: string;
  /** Names the owner in the dossier heading. */
  ownerUsername?: string;
  className?: string;
}
