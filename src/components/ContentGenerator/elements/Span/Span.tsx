import type { FC } from 'react';

type TSpan = {
  styles: any;
  children?: any;
};

const Span: FC<TSpan> = ({ styles, children }) => {
  return <span className={styles.span}>{children}</span>;
};

export default Span;
