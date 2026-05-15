import cn from 'classnames';
import type { FC } from 'react';

import styles from './FlagImage.module.scss';

interface FlagImageProps {
  countryCode: string;
  size?: number;
  className?: string;
}

const FlagImage: FC<FlagImageProps> = ({
  countryCode,
  size = 20,
  className = '',
}) => {
  const code = countryCode.toLowerCase();
  const w = Math.round(size * 1.5);
  const cdnW = w >= 40 ? 80 : 40;
  const cdnW2x = w >= 40 ? 160 : 80;

  return (
    <img
      src={`https://flagcdn.com/w${cdnW}/${code}.png`}
      srcSet={`https://flagcdn.com/w${cdnW2x}/${code}.png 2x`}
      width={w}
      height={size}
      alt=""
      className={cn(styles.Flag, className)}
      style={{ width: w, height: size }}
      loading="lazy"
    />
  );
};

export default FlagImage;
