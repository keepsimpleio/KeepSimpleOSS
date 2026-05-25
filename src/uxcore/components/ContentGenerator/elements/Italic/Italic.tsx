import type { FC } from 'react';

type TItalic = {
  children?: any;
};

const Italic: FC<TItalic> = ({ children }) => {
  return <i>{children}</i>;
};

export default Italic;
