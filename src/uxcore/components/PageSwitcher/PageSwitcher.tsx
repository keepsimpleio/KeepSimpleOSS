import ArcOfSelfIcon from '@uxcore/assets/icons/ArcOfSelfIcon';
import UXCatIcon from '@uxcore/assets/icons/UXCatIcon';
import UXCGIcon from '@uxcore/assets/icons/UXCGIcon';
import UXCoreIcon from '@uxcore/assets/icons/UXCoreIcon';
import UXCPIcon from '@uxcore/assets/icons/UXCPIcon';
import Link from '@uxcore/components/NextLink';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect } from 'react';

import styles from './PageSwitcher.module.scss';

type TPageSwitcher = {
  page?: string;
};

const PageSwitcher: FC<TPageSwitcher> = ({ page }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const bobUrl =
    'https://chatgpt.com/g/g-BtuSiGF18-bob-bias-trickery-and-deception-by-uxcore-io/';
  const arcUrl = 'https://arc-of-self.com/?uxcore';

  const handleKeyPress = useCallback(
    (e: { shiftKey: any; ctrlKey: any; keyCode: number }) => {
      if (e.shiftKey && e.ctrlKey) {
        if (e.keyCode == 49) {
          router.push('/uxcore', null);
        }

        if (e.keyCode == 50) {
          router.push('/uxcg', null);
        }
      }
    },
    [],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const isUXCore = page === 'uxcore';
  const isUXCG = page === 'uxcg';
  const isUXCP = page === 'uxcp';
  const isUXCat = page === 'uxcat';

  useEffect(() => {
    if (page !== 'uxcore') {
      localStorage.removeItem('mobileScrolledPosition');
      localStorage.removeItem('scrollSnapshotBeforeModal');
    }
  }, [page]);

  return (
    <div className={styles.PageSwitcher}>
      <div className={styles.GridWrapper}>
        <Link href="/uxcore" legacyBehavior>
          <a
            className={cn(styles.Button, {
              [styles.Active]: isUXCore,
            })}
          >
            <UXCoreIcon />
            <span className={styles.Description}>UX CORE</span>
          </a>
        </Link>
        <Link href="/uxcg" legacyBehavior>
          <a
            className={cn(styles.Button, {
              [styles.Active]: isUXCG,
            })}
          >
            <UXCGIcon />
            <span className={styles.Description}>GUIDE</span>
          </a>
        </Link>
        <Link href="/uxcp" legacyBehavior>
          <a
            className={cn(styles.Button, {
              [styles.Active]: isUXCP,
            })}
          >
            <UXCPIcon />
            <span className={styles.Description}>PERSONA</span>
          </a>
        </Link>
        <Link href="/uxcat" legacyBehavior>
          <a
            className={cn(styles.Button, {
              [styles.Active]: isUXCat,
            })}
          >
            <UXCatIcon />
            <span className={styles.Description}>UX CAT</span>
          </a>
        </Link>
        <Link href={bobUrl} legacyBehavior>
          <a target={'_blank'} className={styles.Button}>
            <Image
              src={'/assets/Bob.png'}
              alt={'Bob - AI Assistant'}
              width={30}
              height={30}
              className={styles.bob}
            />
            <span className={styles.Description}>
              {locale === 'ru' ? 'Боб - ИИ Ассистент' : 'Bob - AI Assistant'}
            </span>
          </a>
        </Link>
        <Link href={arcUrl} legacyBehavior>
          <a
            target={'_blank'}
            rel={'noopener noreferrer'}
            className={styles.Button}
          >
            <ArcOfSelfIcon />
            <span className={styles.Description}>Arc of Self</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PageSwitcher;
