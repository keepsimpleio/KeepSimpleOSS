import { useEffect, useRef } from 'react';

const useKonamiCode = callback => {
  const codeSequence = useRef([
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ]);

  const currentIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === codeSequence.current[currentIndex.current]) {
        currentIndex.current += 1;

        if (currentIndex.current === codeSequence.current.length) {
          callback();
          currentIndex.current = 0; // reset for next time
        }
      } else {
        currentIndex.current = 0; // reset if the sequence is broken
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
};

export default useKonamiCode;
