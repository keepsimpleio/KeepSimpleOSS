import { useEffect, useState } from 'react';

export const useIsWidthLessThan = (breakpoint: number) => {
  const [isLessThan, setIsLessThan] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLessThan(window.innerWidth <= breakpoint);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isLessThan;
};
