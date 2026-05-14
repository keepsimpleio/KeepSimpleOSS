import type { FC } from 'react';

type TUnderline = {
  children?: any;
};
const Underline: FC<TUnderline> = ({ children }) => {
  return <u>{children}</u>;
};

export default Underline;
