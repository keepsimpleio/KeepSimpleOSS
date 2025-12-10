import type { FC } from 'react';

type TP = {
  styles: any;
  children?: any;
};

const P: FC<TP> = ({ styles, children }) => {
  return <p className={styles.p}>{children}</p>;
};

export default P;
