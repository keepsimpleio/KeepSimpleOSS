import { useState, useEffect } from 'react';
import { CustomHookType, DispatchFuntion } from '@local-types/global';

interface StateType {
  activeTooltipId: string | null;
}

let listeners: DispatchFuntion[] = [];

let state: StateType = {
  activeTooltipId: null,
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
const setActiveTooltipId = (activeTooltipId: string | null) => {
  reducer({ activeTooltipId });
};

/* CUSTOM HOOK */
const useTooltip = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      setActiveTooltipId,
    },
    state,
  ];
};

export default useTooltip;
