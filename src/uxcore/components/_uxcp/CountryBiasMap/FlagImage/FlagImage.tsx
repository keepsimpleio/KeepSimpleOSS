import cn from 'classnames';
import { type FC, useState } from 'react';

import styles from './FlagImage.module.scss';

interface FlagImageProps {
  countryCode: string;
  countryName?: string;
  size?: number;
  className?: string;
}

// Convert "AR" → "🇦🇷" using Unicode regional indicator symbols.
const codeToEmoji = (code: string): string => {
  if (code.length !== 2) return '';
  const A = 0x1f1e6; // 🇦
  return Array.from(code.toUpperCase())
    .map(c => String.fromCodePoint(A + (c.charCodeAt(0) - 65)))
    .join('');
};

const FlagImage: FC<FlagImageProps> = ({
  countryCode,
  countryName,
  size = 20,
  className = '',
}) => {
  const code = countryCode.toLowerCase();
  const w = Math.round(size * 1.5);
  const cdnW = w >= 40 ? 80 : 40;
  const cdnW2x = w >= 40 ? 160 : 80;
  const [failed, setFailed] = useState(false);

  if (failed) {
    // External flag CDN (flagcdn.com) is sometimes blocked by ad-blockers
    // or restrictive network policies. Fall back to an emoji flag so the
    // row still reads instead of showing a broken-image icon.
    return (
      <span
        className={cn(styles.Flag, className)}
        style={{
          width: w,
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size,
          lineHeight: 1,
        }}
        aria-hidden
      >
        {codeToEmoji(countryCode) || countryCode.toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w${cdnW}/${code}.png`}
      srcSet={`https://flagcdn.com/w${cdnW2x}/${code}.png 2x`}
      width={w}
      height={size}
      alt={`Flag of ${countryName || countryCode.toUpperCase()}`}
      className={cn(styles.Flag, className)}
      style={{ width: w, height: size }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default FlagImage;
