import type { RefObject } from 'react';

import type { IObject } from '@local-types/library/object';

export interface ObjectHoverCardProps {
  /** DOM id, so the anchoring card can name the panel as its description. */
  id?: string;
  /** The object the panel describes. */
  object: IObject;
  /** The card the panel is pinned beside. */
  anchorRef: RefObject<HTMLElement | null>;
  /** True while the card is hovered or keyboard-focused. */
  open: boolean;
  /** Suppresses the panel entirely (compact tiles, drag surfaces). */
  disabled?: boolean;
  /** Library owner — named in the rating block heading. */
  ownerUsername?: string;
  /** Replaces the object-type label in the panel head ("Book"). */
  kindLabel?: string;
  /** Extra rows, laid before the object's own metadata. */
  rows?: { label: string; value: string }[];
  /** Whether the rating block closes the panel. Defaults to true for books.
   * Off for anything the owner has not shelved yet. */
  showReview?: boolean;
}
