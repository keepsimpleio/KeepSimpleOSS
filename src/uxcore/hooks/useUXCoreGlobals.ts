import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

interface TState {
  isCoreView: boolean;
  isProductView?: boolean;
  isOffsecView?: boolean;
  showArrows?: boolean;
}

let listeners: DispatchFuntion[] = [];
let state: TState = {
  isCoreView: true,
  isProductView: true,
  isOffsecView: false,
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
// exclusive targets. Persists both flags atomically so any consumer
// reading the next state gets a consistent snapshot.
const setUseCase = (target: 'product' | 'hr' | 'offsec') => {
  const next = {
    isProductView: target === 'product',
    isOffsecView: target === 'offsec',
  };
  // 'hr' leaves isProductView=false, isOffsecView=false.
  if (target === 'hr') next.isProductView = false;
  localStorage.setItem('isProductView', String(next.isProductView));
  localStorage.setItem('isOffsecView', String(next.isOffsecView));
  reducer(next);
};
const toggleShowArrows = () => {
  localStorage.setItem('showArrows', String(!state.showArrows));
  reducer({ showArrows: !state.showArrows });
};

/* INIT */
const initUseUXCoreGlobals = () => {
  const changeState = (localStorage.getItem('isCoreView') || true) === 'false';
  const changeStateView =
    (localStorage.getItem('isProductView') || true) === 'false';
  const changeStateOffsec = localStorage.getItem('isOffsecView') === 'true';
  const changeStateArrows =
    (localStorage.getItem('showArrows') || true) === 'false';
  if (changeState) {
    toggleIsCoreView();
  }
  if (changeStateView) {
    toggleIsProductView();
  }
  if (changeStateOffsec) {
    toggleIsOffsecView();
  }
  if (changeStateArrows) {
    toggleShowArrows();
  }
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
