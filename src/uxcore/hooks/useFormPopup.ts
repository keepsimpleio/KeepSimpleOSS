import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

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
const togglePopupVisibiity = () => {
  reducer({ isVisible: !state.isVisible });
};

/* CUSTOM HOOK */
const useFormPopup = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      togglePopupVisibiity,
    },
    state,
  ];
};

export default useFormPopup;
