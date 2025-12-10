import type { FC } from 'react';

type TDiv = {
  styles: any;
  children?: any;
};

const Div: FC<TDiv> = ({ styles, children }) => {
  return <div className={styles.p}>{children}</div>;
};

export default Div;
