import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

interface TState {
  isUxcoreMobile: boolean;
}

let listeners: DispatchFuntion[] = [];
let state: TState = {
  isUxcoreMobile: false,
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
  const newIsMobile = window.innerWidth <= 1010;

  if (newIsMobile !== state.isUxcoreMobile) {
    reducer({ isUxcoreMobile: newIsMobile });
  }
};

/* INIT */
const initUseMobile = () => {
  handleResize();
  window.addEventListener('resize', handleResize);
};

/* CUSTOM HOOK */
const useUCoreMobile = (): CustomHookType => {
  const [, setState] = useState(state);

  useEffect(() => {
    // Initialize resize listener on mount
    initUseMobile();

    listeners.push(setState);

    return () => {
      listeners = listeners.filter(listener => listener !== setState);
      // Clean up the resize listener
      window.removeEventListener('resize', handleResize);
    };
  }, [setState]);

  return [
    {
      initUseMobile,
    },
    state,
  ];
};

export default useUCoreMobile;
