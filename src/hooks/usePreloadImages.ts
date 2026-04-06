import { useEffect } from 'react';

const usePreloadImages = (urls: string[]) => {
  useEffect(() => {
    if (!urls?.length) return;

    urls.forEach(src => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  }, [urls]);
};

export default usePreloadImages;
