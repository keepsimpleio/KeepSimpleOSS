import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

const useInView = <T extends Element>({
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.15,
  once = true,
}: UseInViewOptions = {}) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
};

export default useInView;
