import React, { FC } from 'react';
import styles from './Snowfall.module.scss';


type SnowfallProps = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
};
const Snowfall: FC<SnowfallProps> = () => {
  const snowflake = 185;
  const snowfallArray = Array.from({ length: snowflake });

  return (
    <div className={styles.container}>
      {snowfallArray.map((_, index) => (
        <div key={index} className={styles.snow}></div>
      ))}
    </div>
  );
};

export default Snowfall;
