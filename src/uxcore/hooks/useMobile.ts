import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

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
// Nothing calls initUseMobile since the UXCoreOSS fold-in (the old _app did),
// so the hook self-initializes on first mount; the guard keeps a single
// app-lifetime resize listener.
let initialized = false;

const initUseMobile = () => {
  if (initialized) return;
  initialized = true;
  handleResize();
  window.addEventListener('resize', handleResize);
};

/* CUSTOM HOOK */
const useMobile = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    initUseMobile();
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
