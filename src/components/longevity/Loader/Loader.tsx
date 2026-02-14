import { FC } from 'react';

import styles from './Loader.module.scss';

const Loader: FC = () => {
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
