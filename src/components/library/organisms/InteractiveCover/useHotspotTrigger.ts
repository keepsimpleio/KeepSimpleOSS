import { useCallback, useMemo } from 'react';

/**
 * Interaction model for the cover hotspots. The whole feature is wired through
 * this single switch so flipping the trigger from hover to tap (e.g. for touch
 * or a future product decision) is a one-line change in the organism — the
 * hotspot markup and the active-id state never move.
 */
export type HotspotMode = 'hover' | 'click';

interface UseHotspotTriggerArgs {
  id: string;
  mode: HotspotMode;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

/** Event handlers to spread onto a hotspot trigger, shaped by the active mode. */
export function useHotspotTrigger({
  id,
  mode,
  activeId,
  setActiveId,
}: UseHotspotTriggerArgs) {
  const isActive = activeId === id;

  const open = useCallback(() => setActiveId(id), [id, setActiveId]);
  const close = useCallback(() => {
    setActiveId(activeId === id ? null : activeId);
  }, [activeId, id, setActiveId]);
  const toggle = useCallback(
    () => setActiveId(isActive ? null : id),
    [id, isActive, setActiveId],
  );

  const triggerProps = useMemo(() => {
    if (mode === 'click') {
      return { onClick: toggle };
    }

    // Pointer drives hover; focus/blur mirror it so keyboard users get the
    // same reveal without needing the click path.
    return {
      onMouseEnter: open,
      onMouseLeave: close,
      onFocus: open,
      onBlur: close,
    };
  }, [mode, toggle, open, close]);

  return { isActive, triggerProps };
}
