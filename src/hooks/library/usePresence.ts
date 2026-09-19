import { useEffect, useRef, useState } from 'react';

// Keeps a popover, menu or notice in the DOM for the length of its exit so it
// can fade out instead of vanishing on the frame its state flips. `mounted`
// says whether to render at all; `shown` drives the open/closing class. Under
// prefers-reduced-motion the exit is skipped and the node leaves at once.
export function usePresence(
  open: boolean,
  exitMs: number,
): { mounted: boolean; shown: boolean } {
  const [mounted, setMounted] = useState(open);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (open) {
      setMounted(true);
      return;
    }
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced || exitMs <= 0) {
      setMounted(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setMounted(false);
    }, exitMs);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [open, exitMs]);

  return { mounted, shown: open };
}
