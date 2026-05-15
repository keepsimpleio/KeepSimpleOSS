import uxcpLocalization from '@uxcore/data/uxcp';
import type { TRouter } from '@uxcore/local-types/global';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import styles from './MobileDisclimer.module.scss';

const MobileDisclimer: FC = () => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { mobileDisclimer } = uxcpLocalization[locale];

  return (
    <div className={styles.MobileDisclimer}>
      <Image
        src="/assets/icons/mobile-disclimer.svg"
        alt="mobile disclimer for mobile version"
        width={24}
        height={22}
        unoptimized
      />
      <div>{mobileDisclimer}</div>
    </div>
  );
};

export default MobileDisclimer;
