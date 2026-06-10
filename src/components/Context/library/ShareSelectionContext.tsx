import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
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
  remove: (id: number) => void;
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

  const remove = useCallback((id: number) => {
    setSelectedObjects(prev => prev.filter(o => o.id !== id));
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
      remove,
      reorder,
      clear,
    }),
    [selectedObjects, isSelected, toggle, remove, reorder, clear],
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
