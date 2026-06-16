import type { HotspotMode } from './useHotspotTrigger';

export interface InteractiveCoverProps {
  /** Cover artwork rendered behind the hotspots. */
  src: string;
  alt: string;
  /**
   * How a hotspot reveals its card. Defaults to 'hover'; flip to 'click' for
   * touch-first contexts without touching any markup.
   */
  mode?: HotspotMode;
  className?: string;
}
