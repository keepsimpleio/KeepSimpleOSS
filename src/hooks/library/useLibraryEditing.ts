import { useEffect, useState } from 'react';

// Editing requires a desktop pointer. Start read-only until the device is known.
export default function useLibraryEditing(): boolean {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(
      '(min-width: 1025px) and (hover: hover) and (pointer: fine)',
    );
    const touch = window.matchMedia('(any-pointer: coarse)');
    const update = () => setCanEdit(desktop.matches && !touch.matches);
    update();
    desktop.addEventListener('change', update);
    touch.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      touch.removeEventListener('change', update);
    };
  }, []);

  return canEdit;
}
