import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MAX_SHARE_OBJECTS } from '@constants/library/common';

import type { IObject } from '@local-types/library/object';

interface ShareSelectionContextValue {
  /** Selected objects in the order the owner wants them shared. */
  selectedObjects: IObject[];
  count: number;
  /** True once the selection hits the backend's per-link cap. */
  limitReached: boolean;
  isSelected: (id: number) => boolean;
  /** Append if absent, remove if already selected. Append is a no-op at the cap. */
  toggle: (object: IObject) => void;
  /**
   * Append every object not already selected, stopping at the cap. Returns
   * how many were left out, so the caller can say so instead of stopping
   * silently.
   */
  selectMany: (objects: IObject[]) => number;
  /** Swap a selected object's snapshot for a fresh copy (after an edit). */
  replace: (object: IObject) => void;
  remove: (id: number) => void;
  /** Drop every object whose id is in the set — used to purge a shelf at once. */
  removeMany: (ids: number[]) => void;
  reorder: (next: IObject[]) => void;
  clear: () => void;
}

const ShareSelectionContext = createContext<
  ShareSelectionContextValue | undefined
>(undefined);

export function ShareSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedObjects, setSelectedObjects] = useState<IObject[]>([]);

  const isSelected = useCallback(
    (id: number) => selectedObjects.some(o => o.id === id),
    [selectedObjects],
  );

  const toggle = useCallback((object: IObject) => {
    setSelectedObjects(prev => {
      const exists = prev.some(o => o.id === object.id);
      if (exists) return prev.filter(o => o.id !== object.id);
      // Appending past the cap is silently ignored — the Select chip is the
      // gate (disabled at the limit), this is just a belt-and-braces guard.
      if (prev.length >= MAX_SHARE_OBJECTS) return prev;
      return [...prev, object];
    });
  }, []);

  // Read synchronously against the latest committed selection so the caller
  // learns how many objects did not fit, and the state update stays atomic.
  const selectedRef = useRef<IObject[]>(selectedObjects);
  selectedRef.current = selectedObjects;

  const selectMany = useCallback((objects: IObject[]) => {
    const prev = selectedRef.current;
    const seen = new Set(prev.map(o => o.id));
    const additions: IObject[] = [];
    let leftOut = 0;
    for (const object of objects) {
      if (seen.has(object.id)) continue;
      if (prev.length + additions.length >= MAX_SHARE_OBJECTS) {
        leftOut += 1;
        continue;
      }
      seen.add(object.id);
      additions.push(object);
    }
    if (additions.length) {
      const next = [...prev, ...additions];
      selectedRef.current = next;
      setSelectedObjects(next);
    }
    return leftOut;
  }, []);

  const replace = useCallback((object: IObject) => {
    setSelectedObjects(prev =>
      prev.some(o => o.id === object.id)
        ? prev.map(o => (o.id === object.id ? object : o))
        : prev,
    );
  }, []);

  const remove = useCallback((id: number) => {
    setSelectedObjects(prev => prev.filter(o => o.id !== id));
  }, []);

  const removeMany = useCallback((ids: number[]) => {
    if (ids.length === 0) return;
    const drop = new Set(ids);
    setSelectedObjects(prev => prev.filter(o => !drop.has(o.id)));
  }, []);

  const reorder = useCallback((next: IObject[]) => {
    setSelectedObjects(next);
  }, []);

  const clear = useCallback(() => setSelectedObjects([]), []);

  const value = useMemo(
    () => ({
      selectedObjects,
      count: selectedObjects.length,
      limitReached: selectedObjects.length >= MAX_SHARE_OBJECTS,
      isSelected,
      toggle,
      selectMany,
      replace,
      remove,
      removeMany,
      reorder,
      clear,
    }),
    [
      selectedObjects,
      isSelected,
      toggle,
      selectMany,
      replace,
      remove,
      removeMany,
      reorder,
      clear,
    ],
  );

  return (
    <ShareSelectionContext.Provider value={value}>
      {children}
    </ShareSelectionContext.Provider>
  );
}

export function useShareSelection(): ShareSelectionContextValue {
  const context = useContext(ShareSelectionContext);

  if (!context) {
    throw new Error(
      'useShareSelection must be used within a ShareSelectionProvider',
    );
  }

  return context;
}
