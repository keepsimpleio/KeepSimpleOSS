import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

interface TState {
  isCoreView: boolean;
  isProductView?: boolean;
  showArrows?: boolean;
}

let listeners: DispatchFuntion[] = [];
let state: TState = {
  isCoreView: true,
  isProductView: true,
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
  reducer({ isProductView: !state.isProductView });
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
  const changeStateArrows =
    (localStorage.getItem('showArrows') || true) === 'false';
  if (changeState) {
    toggleIsCoreView();
  }
  if (changeStateView) {
    toggleIsProductView();
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
      toggleShowArrows,
    },
    state,
  ];
};

export default useUXCoreGlobals;
