import { RefObject, useEffect, useState } from 'react';

export interface AnchoredPosition {
  top: number;
  left: number;
  width: number;
  // 'bottom' = menu drops below the trigger (default). 'top' = menu opens above
  // it; the consumer should translateY(-100%) so its bottom edge meets `top`.
  placement: 'top' | 'bottom';
}

export interface AnchoredPositionOptions {
  // When set, placement is decided purely by viewport width: open upward when
  // `window.innerWidth <= openUpMaxWidth`, downward otherwise. This skips the
  // measure-then-flip pass (the menu's height is not consulted), so the menu
  // lands in its final position on first paint with no reposition flicker.
  openUpMaxWidth?: number;
}

// Track the viewport position of an anchor element so a portaled menu can be
// glued to it via `position: fixed`. Recomputes on scroll/resize while enabled,
// so the menu stays attached as a modal or page scrolls. Returns null until the
// first measurement (or while disabled).
//
// Pass `menuRef` to enable flip-up: when the menu would overflow the bottom of
// the viewport and there's more room above the trigger, it anchors above
// instead. The menu's height is read from `menuRef` once it has mounted (a
// rAF re-measure follows the first paint), so until then it defaults to 'bottom'.
//
// Pass `options.openUpMaxWidth` to bypass that measurement and pick placement by
// viewport width alone (open up at/below the width, down above it).
export const useAnchoredPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  menuRef?: RefObject<HTMLElement | null>,
  options?: AnchoredPositionOptions,
): AnchoredPosition | null => {
  const [position, setPosition] = useState<AnchoredPosition | null>(null);
  const openUpMaxWidth = options?.openUpMaxWidth;

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const menuHeight = menuRef?.current?.offsetHeight ?? 0;
      const gap = 4;
      const margin = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp =
        openUpMaxWidth != null
          ? window.innerWidth <= openUpMaxWidth
          : menuHeight > 0 &&
            spaceBelow < menuHeight + margin &&
            spaceAbove > spaceBelow;

      const next: AnchoredPosition = {
        top: openUp ? rect.top - gap : rect.bottom + gap,
        left: rect.left,
        width: rect.width,
        placement: openUp ? 'top' : 'bottom',
      };
      setPosition(prev =>
        prev &&
        prev.top === next.top &&
        prev.left === next.left &&
        prev.width === next.width &&
        prev.placement === next.placement
          ? prev
          : next,
      );
    };
    update();
    // The menu mounts after the first measurement, so re-measure on the next
    // frame to feed its real height into the flip decision.
    raf = window.requestAnimationFrame(update);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorRef, enabled, menuRef, openUpMaxWidth]);

  return position;
};
