import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// One motion for every list in the library whose members come and go: a
// member that arrives fades and scales in, a member that leaves fades and
// scales out before it is dropped from the DOM, and the ones that stay glide
// to their new places instead of snapping (FLIP). The caller renders the
// entries this hook hands back, marks each slot with `data-flip-id`, and puts
// the container ref on their parent. Nothing here touches layout twice: the
// measurements happen once per commit in a layout effect, and the motion is
// transient Web Animations on the slots, so the CSS below keeps its say.

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const LIST_MOTION = {
  move: { duration: 320, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
  enter: { duration: 220, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
  exit: { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)' },
} as const;

const ENTER_KEYFRAMES: Keyframe[] = [
  { opacity: 0, transform: 'scale(0.94)' },
  { opacity: 1, transform: 'scale(1)' },
];

const EXIT_KEYFRAMES: Keyframe[] = [
  { opacity: 1, transform: 'scale(1)' },
  { opacity: 0, transform: 'scale(0.94)' },
];

export interface AnimatedEntry<T> {
  key: string;
  item: T;
  /** True while the member is on its way out; render it inert. */
  leaving: boolean;
}

interface Options {
  /**
   * Glide surviving members to their new positions. Off for lists that a
   * drag library already moves (dnd-kit sortable), where a second transform
   * would fight the drop.
   */
  moves?: boolean;
  /**
   * Play the entrance on newcomers. Off for lists whose slots already carry
   * a CSS mount animation, so a card is not faded in twice.
   */
  enters?: boolean;
  /**
   * Also shrink the leaver along this axis while it fades, so the members
   * after it slide into the space in the same motion instead of jumping
   * once the node is gone.
   */
  collapse?: 'width' | 'height';
}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useAnimatedList<T>(
  items: T[],
  getKey: (item: T) => string,
  options: Options = {},
): { ref: RefObject<HTMLDivElement | null>; entries: AnimatedEntry<T>[] } {
  const { moves = true, enters = true, collapse } = options;
  const ref = useRef<HTMLDivElement>(null);

  // Members that have left `items` but are still fading out. Each keeps the
  // index it held so it fades out where it stood rather than at the tail.
  const [departing, setDeparting] = useState<
    { key: string; item: T; index: number }[]
  >([]);
  const previous = useRef<{ key: string; item: T }[]>([]);
  // Keys seen in an earlier commit: a key not in here is a newcomer.
  const known = useRef<Set<string>>(new Set());
  const firstCommit = useRef(true);

  const current = useMemo(
    () => items.map(item => ({ key: getKey(item), item })),
    [items, getKey],
  );

  // Diff against the last render to find who left.
  useIsomorphicLayoutEffect(() => {
    const currentKeys = new Set(current.map(e => e.key));
    const removed = previous.current
      .map((entry, index) => ({ ...entry, index }))
      .filter(entry => !currentKeys.has(entry.key));
    previous.current = current;
    if (removed.length === 0 || reducedMotion()) return;
    setDeparting(list => [
      ...list.filter(d => !removed.some(r => r.key === d.key)),
      ...removed,
    ]);
  }, [current]);

  const entries = useMemo<AnimatedEntry<T>[]>(() => {
    const live: AnimatedEntry<T>[] = current.map(e => ({
      ...e,
      leaving: false,
    }));
    if (departing.length === 0) return live;
    const currentKeys = new Set(current.map(e => e.key));
    const merged = [...live];
    // Re-insert leavers at their old index, earliest first so later indexes
    // still mean what they meant.
    [...departing]
      .filter(d => !currentKeys.has(d.key))
      .sort((a, b) => a.index - b.index)
      .forEach(d => {
        const at = Math.min(d.index, merged.length);
        merged.splice(at, 0, { key: d.key, item: d.item, leaving: true });
      });
    return merged;
  }, [current, departing]);

  const layoutKey = entries
    .map(e => `${e.key}${e.leaving ? '-' : ''}`)
    .join(',');

  // Measure before paint, then animate: moves for survivors, an entrance for
  // newcomers, an exit for leavers (dropped from state once it finishes).
  const prevRects = useRef<Map<string, DOMRect>>(new Map());
  useIsomorphicLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    const slots = Array.from(
      container.querySelectorAll<HTMLElement>(':scope > [data-flip-id]'),
    );
    const nextRects = new Map<string, DOMRect>();
    slots.forEach(slot => {
      nextRects.set(
        slot.dataset.flipId as string,
        slot.getBoundingClientRect(),
      );
    });
    const before = prevRects.current;
    prevRects.current = nextRects;

    const reduced = reducedMotion();
    const isFirst = firstCommit.current;
    firstCommit.current = false;

    slots.forEach(slot => {
      const key = slot.dataset.flipId as string;
      const leaving = slot.dataset.flipLeaving === 'true';

      if (leaving) {
        if (slot.dataset.flipExiting === 'true') return;
        slot.dataset.flipExiting = 'true';
        const finish = () =>
          setDeparting(list => list.filter(d => d.key !== key));
        if (reduced) {
          finish();
          return;
        }
        const frames: Keyframe[] = collapse
          ? [
              {
                ...EXIT_KEYFRAMES[0],
                [collapse]: `${slot.getBoundingClientRect()[collapse]}px`,
              },
              { ...EXIT_KEYFRAMES[1], [collapse]: '0px' },
            ]
          : EXIT_KEYFRAMES;
        if (collapse) slot.style.overflow = 'hidden';
        const animation = slot.animate(frames, {
          ...LIST_MOTION.exit,
          fill: 'forwards',
        });
        animation.onfinish = finish;
        animation.oncancel = finish;
        return;
      }

      // A member that came back while still fading out keeps its DOM node
      // (same key), so the half-finished exit has to be cancelled and its
      // held frame released before it can be treated as present again.
      if (slot.dataset.flipExiting === 'true') {
        delete slot.dataset.flipExiting;
        slot.getAnimations().forEach(animation => animation.cancel());
      }

      const isNew = !known.current.has(key);
      known.current.add(key);
      if (reduced || isFirst) return;

      if (isNew) {
        if (enters) slot.animate(ENTER_KEYFRAMES, LIST_MOTION.enter);
        return;
      }

      if (!moves) return;
      const was = before.get(key);
      const now = nextRects.get(key);
      if (!was || !now) return;
      const dx = was.left - now.left;
      const dy = was.top - now.top;
      if (dx === 0 && dy === 0) return;
      slot.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        LIST_MOTION.move,
      );
    });

    // Forget keys that are gone for good, so a member that returns later
    // enters again instead of appearing in place.
    const present = new Set(slots.map(s => s.dataset.flipId as string));
    known.current.forEach(key => {
      if (!present.has(key)) known.current.delete(key);
    });
  }, [layoutKey, moves, enters, collapse]);

  return { ref, entries };
}
