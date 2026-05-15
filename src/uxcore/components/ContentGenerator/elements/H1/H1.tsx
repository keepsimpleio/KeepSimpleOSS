import type { FC } from 'react';

interface H1Props {
  styles: any;
  children?: any;
}

const H1: FC<H1Props> = ({ styles, children }) => {
  return <h1 className={styles.h1}>{children}</h1>;
};

export default H1;
