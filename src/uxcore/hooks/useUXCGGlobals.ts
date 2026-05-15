import { CustomHookType, DispatchFuntion } from '@uxcore/local-types/global';
import { useEffect, useState } from 'react';

interface TState {
  isOpenedUXCGDescription: boolean;
  showModalArrows?: boolean;
}

let listeners: DispatchFuntion[] = [];
let state: TState = {
  isOpenedUXCGDescription: true,
  showModalArrows: true,
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

// UXCG Description
const toggleUXCGDescription = () => {
  localStorage.setItem(
    'isOpenedUXCGDescription',
    String(!state.isOpenedUXCGDescription),
  );
  reducer({ isOpenedUXCGDescription: !state.isOpenedUXCGDescription });
};

const toggleShowModalArrows = () => {
  localStorage.setItem('showModalArrows', String(!state.showModalArrows));
  reducer({ showModalArrows: !state.showModalArrows });
};

/* INIT */
const initUseUXCGGlobals = () => {
  // UXCG Description
  const changeDescriptionState =
    localStorage.getItem('isOpenedUXCGDescription') === 'false';
  const changeArrowsState = localStorage.getItem('showModalArrows') === 'false';
  if (changeDescriptionState) {
    toggleUXCGDescription();
  }
  if (changeArrowsState) {
    toggleShowModalArrows();
  }
};

/* CUSTOM HOOK */
const useUXCGGlobals = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  return [
    {
      initUseUXCGGlobals,
      toggleUXCGDescription,
      toggleShowModalArrows,
    },
    state,
  ];
};

export default useUXCGGlobals;
