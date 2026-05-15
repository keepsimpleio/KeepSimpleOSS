import Link from 'next/link';
import type { FC } from 'react';

const NextLink: FC<any> = ({ children, shallow, ...restProps }) => {
  const shallowValue = shallow === false ? false : true;

  return (
    <Link {...restProps} prefetch={false} shallow={shallowValue}>
      {children}
    </Link>
  );
};

export default NextLink;
