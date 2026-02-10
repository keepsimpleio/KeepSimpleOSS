import { useEffect, useRef } from 'react';

export const useClickOutside = (callback?: VoidFunction) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        typeof callback === 'function' && callback();
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [ref]);

  return ref;
};
