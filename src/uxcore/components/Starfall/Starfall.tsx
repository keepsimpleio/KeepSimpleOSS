import React, { FC } from 'react';

import styles from './Starfall.module.scss';

type StarfallProps = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
};
const Starfall: FC<StarfallProps> = () => {
  const stars = 250;
  const starsArray = Array.from({ length: stars });

  return (
    <div className={styles.container}>
      {starsArray.map((_, index) => (
        <div key={index} className={styles.star}></div>
      ))}
    </div>
  );
};

export default Starfall;
