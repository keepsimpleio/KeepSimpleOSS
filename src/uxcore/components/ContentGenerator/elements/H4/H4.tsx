import type { FC } from 'react';

type TH4 = {
  children?: any;
};
const H4: FC<TH4> = ({ children }) => {
  return <h4>{children}</h4>;
};

export default H4;
