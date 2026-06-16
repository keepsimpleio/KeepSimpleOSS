import classNames from 'classnames';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { LibraryInfoCard } from '@components/library/molecules/LibraryInfoCard';

import { CoverHotspot, coverHotspots } from './coverHotspots';
import type { InteractiveCoverProps } from './InteractiveCover.types';
import { HotspotMode, useHotspotTrigger } from './useHotspotTrigger';

import styles from './InteractiveCover.module.scss';

interface HotspotProps {
  hotspot: CoverHotspot;
  mode: HotspotMode;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

function Hotspot({ hotspot, mode, activeId, setActiveId }: HotspotProps) {
  const { isActive, triggerProps } = useHotspotTrigger({
    id: hotspot.id,
    mode,
    activeId,
    setActiveId,
  });

  const { hit, highlight, card, library } = hotspot;

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        style={{
          left: `${hit.left}%`,
          top: `${hit.top}%`,
          width: `${hit.width}%`,
          height: hit.height ? `${hit.height}%` : undefined,
        }}
        aria-label={library.libraryName}
        aria-pressed={mode === 'click' ? isActive : undefined}
        {...triggerProps}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={highlight.src}
        alt={highlight.alt}
        aria-hidden
        draggable={false}
        className={classNames(styles.highlight, { [styles.active]: isActive })}
        style={{
          left: `${highlight.left}%`,
          top: `${highlight.top}%`,
          width: `${highlight.width}%`,
        }}
      />

      <div
        className={classNames(styles.card, { [styles.cardActive]: isActive })}
        style={{ left: `${card.left}%`, top: `${card.top}%` }}
      >
        <LibraryInfoCard {...library} isActive={isActive} />
      </div>
    </>
  );
}

export function InteractiveCover({
  src,
  alt,
  mode = 'hover',
  className,
}: InteractiveCoverProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // In click mode the card stays open until dismissed, so an outside click or
  // Escape needs to close it. Hover mode dismisses itself via onMouseLeave.
  useEffect(() => {
    if (mode !== 'click' || !activeId) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!frameRef.current?.contains(event.target as Node)) {
        setActiveId(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveId(null);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mode, activeId]);

  const clearActive = useCallback(() => setActiveId(null), []);

  return (
    <div ref={frameRef} className={classNames(styles.frame, className)}>
      <Image
        className={styles.image}
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
      />

      <div
        className={styles.layer}
        onMouseLeave={mode === 'hover' ? clearActive : undefined}
      >
        {coverHotspots.map(hotspot => (
          <Hotspot
            key={hotspot.id}
            hotspot={hotspot}
            mode={mode}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </div>
    </div>
  );
}
