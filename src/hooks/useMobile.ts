import { useState, useEffect } from 'react';
import { CustomHookType, DispatchFuntion } from '@local-types/global';

interface TState {
  isMobile: boolean;
}

let listeners: DispatchFuntion[] = [];
let state: TState = {
  isMobile: false,
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
const handleResize = () => {
  const newIsMobile = window.innerWidth <= 800;

  if (newIsMobile !== state.isMobile) {
    reducer({ isMobile: newIsMobile });
  }
};

/* INIT */
const initUseMobile = () => {
  handleResize();
  window.addEventListener('resize', handleResize);
};

/* CUSTOM HOOK */
const useMobile = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      initUseMobile,
    },
    state,
  ];
};

export default useMobile;
