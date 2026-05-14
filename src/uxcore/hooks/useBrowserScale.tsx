'use client';
import { useEffect, useState } from 'react';

export function useBrowserScale() {
  const [dpr, setDpr] = useState<number>(() =>
    typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1,
  );

  useEffect(() => {
    const update = () => setDpr(window.devicePixelRatio || 1);

    window.addEventListener('resize', update);

    const mq = window.matchMedia(
      `(resolution: ${window.devicePixelRatio || 1}dppx)`,
    );
    mq.addEventListener?.('change', update);

    window.visualViewport?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      mq.removeEventListener?.('change', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return dpr;
}
