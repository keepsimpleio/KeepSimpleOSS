import Image from 'next/image';
import { FC } from 'react';

import { ArrowButtonProps } from './ArrowButton.types';

const ArrowButton: FC<ArrowButtonProps> = ({
  src,
  alt,
  width,
  height,
  className,
  onClick,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onClick={onClick}
    />
  );
};

export default ArrowButton;
