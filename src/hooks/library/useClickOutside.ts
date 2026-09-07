import { RefObject, useEffect, useRef } from 'react';

/**
 * Close-on-outside-click for a subtree.
 *
 * `insideRef` marks a second subtree as "inside" — needed when part of the UI
 * is portaled away from the returned ref's node, as with a popover rendered
 * into `document.body`. The alternative, stopping `pointerdown` inside the
 * portal, also blocks this same document listener for every nested component
 * that relies on it, so a menu inside the portal could never close itself.
 */
export const useClickOutside = (
  callback: () => void,
  insideRef?: RefObject<HTMLElement | null>,
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      const target = event.target as Node;
      if (ref.current?.contains(target)) return;
      if (insideRef?.current?.contains(target)) return;
      callback();
    }

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [callback, insideRef]);

  return ref;
};
