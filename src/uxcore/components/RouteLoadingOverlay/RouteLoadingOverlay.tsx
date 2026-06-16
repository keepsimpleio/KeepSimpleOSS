import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './RouteLoadingOverlay.module.scss';

// Client-side route hops (open/close a question, jump from bias modal to
// UXCG) have no visible feedback on a slow connection — the tap feels dead.
// Call start() right before router.push; the overlay clears itself when the
// route settles.
export const useRouteLoading = (): [boolean, () => void] => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stop = () => setIsLoading(false);
    router.events.on('routeChangeComplete', stop);
    router.events.on('routeChangeError', stop);
    return () => {
      router.events.off('routeChangeComplete', stop);
      router.events.off('routeChangeError', stop);
    };
  }, [router.events]);

  const start = useCallback(() => setIsLoading(true), []);

  return [isLoading, start];
};

const RouteLoadingOverlay: FC<{ active: boolean }> = ({ active }) => {
  if (!active || typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles.Overlay} aria-live="polite">
      <span className={styles.Spinner} />
    </div>,
    document.body,
  );
};

export default RouteLoadingOverlay;
