import React, { CSSProperties } from 'react';

import { digitsPaths, DigitValue } from './digitPaths';

type Props = {
  value: DigitValue | number;
  className?: string;
  color?: string;
  size?: number;
};

const ASPECT = 20 / 32;

export default function Digit({
  value,
  className,
  color = 'currentColor',
  size = 32,
}: Props) {
  const digits = String(value).split('') as DigitValue[];

  if (digits.some(d => !digitsPaths[d])) return null;

  const w = size * ASPECT;
  const h = size;

  const svgProps = (d: DigitValue) => ({
    viewBox: digitsPaths[d].viewBox,
    className,
    'aria-hidden': true as const,
    xmlns: 'http://www.w3.org/2000/svg',
    width: w,
    height: h,
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
    } as CSSProperties,
  });

  if (digits.length === 1) {
    const d = digits[0];
    return (
      <svg {...svgProps(d)}>
        {digitsPaths[d].paths.map((path, i) => (
          <path key={i} d={path} fill={color} />
        ))}
      </svg>
    );
  }

  return (
    <span>
      {digits.map((d, i) => (
        <svg key={i} {...svgProps(d)}>
          {digitsPaths[d].paths.map((path, j) => (
            <path key={j} d={path} fill={color} />
          ))}
        </svg>
      ))}
    </span>
  );
}
