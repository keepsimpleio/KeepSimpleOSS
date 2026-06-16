import { getNewUpdate } from '@uxcore/api/new-updates';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import NewUpdateModal from './NewUpdateModal';
import type { NewUpdateData } from './NewUpdateModal.types';

const NewUpdateModalContainer: FC = () => {
  const router = useRouter();
  const [data, setData] = useState<NewUpdateData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    (async () => {
      try {
        const res: NewUpdateData | null = await getNewUpdate(
          router.locale || 'en',
        );

        if (cancelled || !res || !res['Frontend modal visibility']) return;

        setData(res);

        const delaySeconds = Number(res['Appears after x seconds']) || 0;
        timer = setTimeout(
          () => {
            if (!cancelled) setOpen(true);
          },
          Math.max(0, delaySeconds) * 1000,
        );
      } catch (err) {
        console.warn('[new-update] fetch failed:', err);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router.locale]);

  if (!open || !data) return null;

  return <NewUpdateModal data={data} onClose={() => setOpen(false)} />;
};

export default NewUpdateModalContainer;
