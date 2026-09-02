import type { RefObject } from 'react';

import type { IObject } from '@local-types/library/object';

export interface ObjectHoverCardProps {
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
}
