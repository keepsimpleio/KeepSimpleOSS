import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { ProgressBarProps } from './ProgressBar.types';

import styles from './ProgressBar.module.scss';

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const ProgressBar: FC<ProgressBarProps> = ({
  stops,
  stopIndex,
  setStopIndex,
  isStrengthSection,
  activityLevels,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const selectedMinutes = useMemo(() => stops[stopIndex], [stops, stopIndex]);
  const percent = useMemo(
    () => (stopIndex / (stops.length - 1)) * 100,
    [stopIndex, stops.length],
  );

  const firstItemPercentage = stopIndex === 0 ? `4%` : `${percent - 1.5}%`;

  const getClosestIndexFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return stopIndex;

      const rect = el.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const ratio = rect.width === 0 ? 0 : x / rect.width;

      const rawIndex = ratio * (stops.length - 1);
      const snappedIndex = Math.round(rawIndex);
      return clamp(snappedIndex, 0, stops.length - 1);
    },
    [stops.length, stopIndex],
  );

  const jumpTo = useCallback(
    (clientX: number) => {
      const next = getClosestIndexFromClientX(clientX);
      setStopIndex(next);
    },
    [getClosestIndexFromClientX],
  );

  const onPointerDownThumb = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    jumpTo(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    jumpTo(e.clientX);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        {isStrengthSection
          ? activityLevels.map(l => (
              <span key={l.level} className={styles.label}>
                {l.level}
              </span>
            ))
          : stops.map(m => (
              <span key={m} className={styles.label}>
                {m} minutes
              </span>
            ))}
      </div>
      <div ref={trackRef} className={styles.container} onClick={onTrackClick}>
        <div className={styles.track} />
        <div className={styles.fill} style={{ width: firstItemPercentage }} />
        <button
          type="button"
          className={styles.thumb}
          style={{ left: firstItemPercentage }}
          aria-label={`Selected ${selectedMinutes} minutes`}
          onPointerDown={onPointerDownThumb}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
