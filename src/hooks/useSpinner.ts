import { useState, useEffect } from 'react';
import { CustomHookType, DispatchFuntion } from '@local-types/global';

interface StateType {
  isVisible: boolean;
}

let listeners: DispatchFuntion[] = [];

let state: StateType = {
  isVisible: false,
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
const setIsVisible = (isVisible: boolean) => {
  reducer({ isVisible });
};

/* CUSTOM HOOK */
const useSpinner = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      setIsVisible,
    },
    state,
  ];
};

export default useSpinner;
