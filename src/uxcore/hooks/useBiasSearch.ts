import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

interface StateType {
  searchResults: number[];
  // True while a non-empty query is applied. Distinguishes "no search"
  // from "search with zero hits" — both have searchResults = [].
  isSearchActive: boolean;
}

let listeners: DispatchFuntion[] = [];

let state: StateType = {
  searchResults: [],
  isSearchActive: false,
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
const setSearchResults = (
  searchResults: number[],
  isSearchActive: boolean = searchResults.length > 0,
) => {
  reducer({ searchResults, isSearchActive });
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
