import uxcpLocalization from '@uxcore/data/uxcp';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';

import styles from './Switcher.module.scss';

type TSwitcher = {
  isActive: boolean;
  onChange: (v: boolean) => void;
};

const Switcher: FC<TSwitcher> = ({ isActive, onChange }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { yes, no } = uxcpLocalization[locale];

  const handleClick = useCallback(e => {
    const { id } = e.target.dataset;
    const newValue = id === 'true';

    onChange(newValue);
  }, []);

  return (
    <div className={styles.Switcher}>
      <div
        className={cn(styles.Button, {
          [styles.Active]: isActive,
        })}
        data-id="true"
        onClick={handleClick}
        data-cy={'uxcp-switcher-as-team-member'}
      >
        {yes}
      </div>
      <div
        className={cn(styles.Button, {
          [styles.Active]: !isActive,
        })}
        data-id="false"
        onClick={handleClick}
      >
        {no}
      </div>
    </div>
  );
};

export default Switcher;
