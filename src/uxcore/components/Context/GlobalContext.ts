import { createContext } from 'react';

// Safe default: noop setters for any set<X> key, null for everything else.
// Prevents `useContext(GlobalContext)` from returning null and crashing on
// destructure or setter calls in UX Core pages that lack a Provider wrap.
const noop = () => {};
const defaultGlobalContext: any = new Proxy(
  {},
  {
    get: (_, prop) => {
      if (typeof prop === 'string' && /^set[A-Z]/.test(prop)) return noop;
      return null;
    },
  },
);

export const GlobalContext = createContext<any>(defaultGlobalContext);
