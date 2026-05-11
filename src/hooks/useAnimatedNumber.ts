import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const useAnimatedNumber = (
  target: number,
  duration = 420,
  step = 5,
): number => {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    // Respect prefers-reduced-motion: jump to the target value without tweening.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(target);
      fromRef.current = target;
      return;
    }

    const start = performance.now();
    const distance = target - from;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const raw = from + distance * eased;
      const snapped = t < 1 ? Math.round(raw / step) * step : target;
      setValue(snapped);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      fromRef.current = target;
    };
  }, [target, duration, step]);

  return value;
};

export default useAnimatedNumber;
