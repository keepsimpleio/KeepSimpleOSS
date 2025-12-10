import { type FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { TRouter } from '@local-types/global';

import styles from './PyramidStats.module.scss';

type PyramidStatsProps = {
  summary: any;
  setSelectedSummaryItem: any;
  isPurple?: boolean;
};

const PyramidStats: FC<PyramidStatsProps> = ({
  summary,
  setSelectedSummaryItem,
  isPurple,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });
  const isMobile = windowSize.width <= 1140;

  const isMobileRef = useRef<boolean>(isMobile);
  isMobileRef.current = isMobile;
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const foregroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const blockBackground = backgroundRef.current;
    const blockForeground = foregroundRef.current;

    const handleMouseMove = (e: any) => {
      const xPos = e.clientX;
      const yPos = e.clientY;

      const xCenter = window.innerWidth / 2;
      const yCenter = window.innerHeight / 2;

      const xOffset = (xPos - xCenter) / xCenter;
      const yOffset = (yPos - yCenter) / yCenter;

      const angleX = -Math.min(Math.max(yOffset * 4, -4), 4);
      const angleY = Math.min(Math.max(xOffset * 4, -4), 4);

      if (isMobileRef.current) {
        blockBackground.style.transform = 'none';
        blockForeground.style.transform = 'none';
      } else {
        blockBackground.style.transform = `translate(-50%, -50%) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(-50px)`;
        blockForeground.style.transform = `translate(-50%, -50%) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={cn(styles.container, {
        [styles.purpleContainer]: isPurple && locale === 'ru',
      })}
    >
      <div
        className={cn(styles.block, styles.background)}
        ref={backgroundRef}
      />
      <div className={cn(styles.block, styles.foreground)} ref={foregroundRef}>
        {summary.map((item: any, index: number) => (
          <>
            <div key={index} className={cn(styles.item, styles[item.color])}>
              <p
                className={styles.summaryItem}
                onMouseOver={() => setSelectedSummaryItem(item.label)}
                onMouseOut={() => setSelectedSummaryItem(null)}
              >
                {item.label}
                {item.value && (
                  <span className={styles.green}>
                    {index > 1 ? `(${item.value}` : item.value}
                    {item.icon === 'up' ? (
                      <span className={cn(styles.arrow, styles.up)} />
                    ) : item.icon === 'down' ? (
                      <span className={cn(styles.arrow, styles.down)} />
                    ) : null}
                    {index > 1 ? ')' : ''}
                  </span>
                )}
                {!item.value && item.icon === 'up' ? (
                  <span
                    className={cn(styles.arrow, styles.up, styles.greenArrow)}
                  />
                ) : !item.value && item.icon === 'down' ? (
                  <span
                    className={cn(styles.arrow, styles.down, styles.redArrow)}
                  />
                ) : null}
              </p>
            </div>
            {item.includePs && (
              <span className={styles.subtext}>{item.psNote}</span>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default PyramidStats;
