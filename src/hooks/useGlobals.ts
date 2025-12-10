import { useState, useEffect, useCallback } from 'react';
import { CustomHookType, DispatchFuntion } from '@local-types/global';

type TFullscreenFunction = (options?: FullscreenOptions) => Promise<void>;

interface StateType {
  isDarkTheme: boolean;
  isOpenedSidebar: boolean;
  isFullScreen: boolean;
  articleRef: HTMLElement & {
    mozRequestFullScreen: TFullscreenFunction;
    webkitRequestFullScreen: TFullscreenFunction;
    msRequestFullscreen: TFullscreenFunction;
  };
}

let listeners: DispatchFuntion[] = [];
let state: StateType = {
  isDarkTheme: false,
  isOpenedSidebar: false,
  isFullScreen: false,
  articleRef: null,
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

// dark theme action
const toggleIsDarkTheme = () => {
  const newThemeState = !state.isDarkTheme;
  localStorage.setItem('darkTheme', String(newThemeState));
  document.body.classList.toggle('darkTheme', newThemeState);
  if (state.articleRef) {
    state.articleRef.classList.toggle('darkTheme', newThemeState);
  }
  reducer({ isDarkTheme: newThemeState });
};

// sidebar action
const toggleSidebar = () => {
  const isOpenedSidebar = !state.isOpenedSidebar;

  if (isOpenedSidebar) {
    document.documentElement.style.overflowY = 'hidden';
  } else {
    // @ts-ignore
    const isChrome = !!window.chrome;
    const overflowDefaultValue = isChrome ? 'overlay' : 'auto';
    document.documentElement.style.overflowY = overflowDefaultValue;
  }
  reducer({ isOpenedSidebar });
};

const handleSidebarChanges = () => {
  if (window.innerWidth > 961 && state.isOpenedSidebar) {
    toggleSidebar();
  }
};

// fullscreen actions
const fullScreenCancel = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore
    document.webkitExitFullscreen();
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen();
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    // @ts-ignore
    document.msExitFullscreen();
  }

  reducer({ isFullScreen: false });
};

const handleExitFullscreenByKeydown = () => {
  document.removeEventListener(
    'fullscreenchange',
    handleExitFullscreenByKeydown,
  );
  reducer({ isFullScreen: false });
};

const moveTofullScreen = () => {
  const { articleRef } = state;

  if (articleRef.requestFullscreen) {
    articleRef.requestFullscreen();
  } else if (articleRef.mozRequestFullScreen) {
    articleRef.mozRequestFullScreen();
  } else if (articleRef.webkitRequestFullScreen) {
    articleRef.webkitRequestFullScreen();
  } else if (articleRef.msRequestFullscreen) {
    articleRef.msRequestFullscreen();
  }

  reducer({ isFullScreen: true });

  setTimeout(() => {
    document.addEventListener(
      'fullscreenchange',
      handleExitFullscreenByKeydown,
    );
  }, 50);
};

// article setter
const setArticleRef = (articleRef: HTMLElement) => {
  reducer({ articleRef });
};

/* INIT */
const initUseGlobals = (articleRef: HTMLElement) => {
  // Init articleRef
  setArticleRef(articleRef);

  // Dark theme
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  if (isDarkTheme) {
    document.body.classList.add('darkTheme');
    articleRef.classList.add('darkTheme');
    reducer({ isDarkTheme: true });
  }

  window.addEventListener('resize', handleSidebarChanges);
};

const unmountUseGlobals = () => {
  window.removeEventListener('resize', handleSidebarChanges);
};

/* CUSTOM HOOK */
const useGlobals = (): CustomHookType => {
  const newListener = useState()[1];

  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  }, [newListener]);

  const handleToggleTheme = useCallback(() => {
    toggleIsDarkTheme();
  }, []);

  return [
    {
      initUseGlobals,
      unmountUseGlobals,
      toggleIsDarkTheme: handleToggleTheme,
      toggleSidebar,
      moveTofullScreen,
      fullScreenCancel,
    },
    state,
  ];
};

export default useGlobals;
