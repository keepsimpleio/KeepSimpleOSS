import { useState, useEffect } from 'react';
import { CustomHookType, DispatchFuntion } from '@local-types/global';

interface StateType {
  pinnedImage: string | undefined;
  zoomedImage: string;
}

let listeners: DispatchFuntion[] = [];

let state: StateType = {
  pinnedImage: undefined,
  zoomedImage: undefined,
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
const setPinnedImage = (imageSrc?: string) => {
  reducer({ pinnedImage: imageSrc });
};

const setZoomedImage = (imageSrc?: string) => {
  reducer({ zoomedImage: imageSrc });
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
      setPinnedImage,
      setZoomedImage,
    },
    state,
  ];
};

export default useImageModule;
