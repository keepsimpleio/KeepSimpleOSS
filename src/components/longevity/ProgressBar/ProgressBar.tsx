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
  minutesTxt,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const labelsRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedMinutes = useMemo(() => stops[stopIndex], [stops, stopIndex]);
  const percent = useMemo(
    () => (stopIndex / (stops.length - 1)) * 100,
    [stopIndex, stops.length],
  );

  const fillPercentage = useMemo(() => {
    const n = isStrengthSection ? activityLevels?.length : stops.length;
    const isFirst = stopIndex === 0;
    const isLast = stopIndex === n - 1;

    if (isFirst) return '4%';
    if (isLast) return '100%';

    const labelsEl = labelsRef.current;
    const containerEl = trackRef.current;
    if (labelsEl && containerEl) {
      const labelSpans = labelsEl.querySelectorAll('span');
      const label = labelSpans[stopIndex];
      if (label) {
        const labelRect = label.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();
        const labelCenter =
          labelRect.left + labelRect.width / 2 - containerRect.left;
        const pct = (labelCenter / containerRect.width) * 100;
        return `${pct}%`;
      }
    }

    return `${percent}%`;
  }, [stopIndex, stops.length, percent, isStrengthSection, activityLevels]);

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

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    jumpTo(e.clientX);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragging(true);

    e.currentTarget.setPointerCapture(e.pointerId);

    jumpTo(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    jumpTo(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerCancel = () => setIsDragging(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels} ref={labelsRef}>
        {isStrengthSection
          ? activityLevels.map(l => (
              <span key={l.level} className={styles.label}>
                {l.level}
              </span>
            ))
          : stops.map(m => (
              <span key={m} className={styles.label}>
                {m} {minutesTxt}
              </span>
            ))}
      </div>
      <div
        className={styles.container}
        onClick={onTrackClick}
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div className={styles.track} />
        <div className={styles.fill} style={{ width: fillPercentage }} />
        <button
          type="button"
          className={styles.thumb}
          style={{ left: fillPercentage }}
          aria-label={`Selected ${selectedMinutes} minutes`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
