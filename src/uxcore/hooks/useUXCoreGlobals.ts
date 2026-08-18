import { isOffsecEnabled } from '@uxcore/lib/offsec';
import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

interface TState {
  isCoreView: boolean;
  isProductView?: boolean;
  isOffsecView?: boolean;
  // Remembers the most recent PM/HR selection so clicking the active
  // OffSec row can revert to where the user was before they detoured
  // into Cybersecurity. Never holds 'offsec'.
  lastBaseUseCase?: 'product' | 'hr';
  showArrows?: boolean;
}

let listeners: DispatchFuntion[] = [];
let state: TState = {
  isCoreView: true,
  isProductView: true,
  isOffsecView: false,
  lastBaseUseCase: 'product',
  showArrows: true,
};

const reducer = (newState: any) => {
  state = {
    ...state,
    ...newState,
  };

  listeners.forEach(listener => {
    listener(state);
  });
};

/* ACTIONS */

// UXCG Description
const toggleIsCoreView = () => {
  localStorage.setItem('isCoreView', String(!state.isCoreView));
  reducer({ isCoreView: !state.isCoreView });
};
const toggleIsProductView = () => {
  localStorage.setItem('isProductView', String(!state.isProductView));
  // Switching to a PM/HR view always exits OffSec — the three use cases
  // are mutually exclusive.
  if (state.isOffsecView) {
    localStorage.setItem('isOffsecView', 'false');
    reducer({ isProductView: !state.isProductView, isOffsecView: false });
  } else {
    reducer({ isProductView: !state.isProductView });
  }
};
const toggleIsOffsecView = () => {
  localStorage.setItem('isOffsecView', String(!state.isOffsecView));
  reducer({ isOffsecView: !state.isOffsecView });
};

// Explicit setter used by the vertical Use cases panel — three mutually
// exclusive targets. Clicking the already-active OffSec row reverts to
// the last PM/HR state (lastBaseUseCase) so the user can declick
// Cybersecurity and return to the canonical pair.
const setUseCase = (target: 'product' | 'hr' | 'offsec') => {
  let resolved: 'product' | 'hr' | 'offsec' = target;
  if (target === 'offsec' && state.isOffsecView) {
    resolved = state.lastBaseUseCase || 'hr';
  }
  const next: Partial<TState> = {
    isProductView: resolved === 'product',
    isOffsecView: resolved === 'offsec',
  };
  if (resolved === 'product' || resolved === 'hr') {
    next.lastBaseUseCase = resolved;
    localStorage.setItem('lastBaseUseCase', resolved);
  }
  localStorage.setItem('isProductView', String(next.isProductView));
  localStorage.setItem('isOffsecView', String(next.isOffsecView));
  reducer(next);
};
const toggleShowArrows = () => {
  localStorage.setItem('showArrows', String(!state.showArrows));
  reducer({ showArrows: !state.showArrows });
};

/* INIT */
// Restores the persisted view choices. Applies absolute values (no toggles),
// so calling it on every mount is safe. The OffSec flag only restores when
// the layer is enabled for this build: a flag persisted on the dev preview
// must not resurface the layer on a public build. Returns the merged state
// so a caller can reconcile a URL hash against what was actually restored.
export const initUseUXCoreGlobals = (): TState => {
  const next: Partial<TState> = {};
  const storedCore = localStorage.getItem('isCoreView');
  if (storedCore !== null) {
    next.isCoreView = storedCore !== 'false';
  }
  const storedProduct = localStorage.getItem('isProductView');
  if (storedProduct !== null) {
    next.isProductView = storedProduct !== 'false';
  }
  next.isOffsecView =
    isOffsecEnabled && localStorage.getItem('isOffsecView') === 'true';
  const storedArrows = localStorage.getItem('showArrows');
  if (storedArrows !== null) {
    next.showArrows = storedArrows !== 'false';
  }
  const storedBase = localStorage.getItem('lastBaseUseCase');
  if (storedBase === 'product' || storedBase === 'hr') {
    next.lastBaseUseCase = storedBase;
  }
  reducer(next);
  return state;
};

/* CUSTOM HOOK */
const useUXCoreGlobals = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      initUseUXCoreGlobals,
      toggleIsCoreView,
      toggleIsProductView,
      toggleIsOffsecView,
      setUseCase,
      toggleShowArrows,
    },
    state,
  ];
};

export default useUXCoreGlobals;
