import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

interface TState {
  isOpenedUXCatRules: boolean;
}

let listeners: DispatchFuntion[] = [];
let state: TState = {
  isOpenedUXCatRules: false,
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

// UXCat Description
const toggleUXCatRules = () => {
  localStorage.setItem('isOpenedUXCatRules', String(!state.isOpenedUXCatRules));
  reducer({ isOpenedUXCatRules: !state.isOpenedUXCatRules });
};

/* INIT */
const initUXCatGlobals = () => {
  const changeRulesState =
    (localStorage.getItem('isOpenedUXCatRules') || true) === 'false';
  if (changeRulesState) {
    toggleUXCatRules();
  }
};

/* CUSTOM HOOK */
const useUXCatGlobals = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      initUXCatGlobals,
      toggleUXCatRules,
    },
    state,
  ];
};

export default useUXCatGlobals;
