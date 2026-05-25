import type { FC } from 'react';

type TBold = {
  children?: any;
};
const Bold: FC<TBold> = ({ children }) => {
  return <b>{children}</b>;
};

export default Bold;
