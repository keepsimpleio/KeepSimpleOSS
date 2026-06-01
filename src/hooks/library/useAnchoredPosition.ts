import { RefObject, useEffect, useState } from 'react';

export interface AnchoredPosition {
  top: number;
  left: number;
  width: number;
}

// Track the viewport position of an anchor element so a portaled menu can be
// glued to it via `position: fixed`. Recomputes on scroll/resize while enabled,
// so the menu stays attached as a modal or page scrolls. Returns null until the
// first measurement (or while disabled).
export const useAnchoredPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  enabled: boolean
): AnchoredPosition | null => {
  const [position, setPosition] = useState<AnchoredPosition | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorRef, enabled]);

  return position;
};
