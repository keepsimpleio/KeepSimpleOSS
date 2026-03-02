import { FC, useEffect } from 'react';

import styles from './Loader.module.scss';

const Loader: FC = () => {
  useEffect(() => {
    const overflowDefaultValue = 'auto';
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.scrollbarGutter = 'stable';

    return () => {
      document.documentElement.style.overflowY = overflowDefaultValue;
      document.documentElement.style.scrollbarGutter = 'auto';
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        {Array.from({ length: 26 }).map((_, i) => (
          <div className={styles.dot} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Loader;
