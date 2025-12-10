import type { FC } from 'react';
import Link from 'next/link';

const NextLink: FC<any> = ({ children, shallow, ...restProps }) => {
  const shallowValue = shallow === false ? false : true;

  return (
    <Link {...restProps} prefetch={false} shallow={shallowValue}>
      {children}
    </Link>
  );
};

export default NextLink;
