import cn from 'classnames';
import { useId, useState } from 'react';

import revealPaths from './revealPaths';

import styles from './Loader.module.scss';

export function Loader() {
  const id = useId().replace(/:/g, '');
  const maskId = `root-growth-${id}`;
  const blurId = `root-tip-${id}`;
  const [isReady, setIsReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={cn(styles.status, { [styles.fallback]: imageFailed })}>
        Loading
      </span>
      <svg
        className={cn(styles.scenery, { [styles.ready]: isReady })}
        viewBox="0 0 1536 1024"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id={blurId}
            x="0"
            y="0"
            width="1536"
            height="1024"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <mask
            id={maskId}
            x="0"
            y="0"
            width="1536"
            height="1024"
            maskUnits="userSpaceOnUse"
            className={styles.mask}
          >
            <g
              filter={`url(#${blurId})`}
              fill="none"
              stroke="white"
              strokeLinecap="round"
            >
              {revealPaths.map(({ d, stage, width }, index) => (
                <path
                  key={index}
                  d={d}
                  pathLength={1}
                  strokeWidth={width}
                  className={cn(styles.brush, styles[stage])}
                />
              ))}
            </g>
            <rect
              width="1536"
              height="1024"
              fill="white"
              className={styles.fibers}
            />
          </mask>
        </defs>
        <g className={styles.material} mask={`url(#${maskId})`}>
          <image
            href="/keepsimple_/assets/library/loader/roots-realistic-v1.webp"
            width="1536"
            height="1024"
            onLoad={() => setIsReady(true)}
            onError={() => setImageFailed(true)}
          />
        </g>
      </svg>
    </div>
  );
}
