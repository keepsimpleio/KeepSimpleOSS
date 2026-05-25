import { useEffect, useState } from 'react';

import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';

interface StateType {
  searchResults: number[];
}

let listeners: DispatchFuntion[] = [];

let state: StateType = {
  searchResults: [],
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
const setSearchResults = (searchResults: number[]) => {
  reducer({ searchResults });
};

/* CUSTOM HOOK */
const useImageModule = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      setSearchResults,
    },
    state,
  ];
};

export default useImageModule;
