import classNames from 'classnames';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { LibraryInfoCard } from '@components/library/molecules/LibraryInfoCard';

import { CoverHotspot, coverHotspots } from './coverHotspots';
import type { InteractiveCoverProps } from './InteractiveCover.types';
import { HotspotMode, useHotspotTrigger } from './useHotspotTrigger';

import styles from './InteractiveCover.module.scss';

// Tracks a media query on the client; false during SSR and first paint so the
// markup is deterministic, then corrected in the effect after hydration.
function useMatchMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return matches;
}

interface HotspotProps {
  hotspot: CoverHotspot;
  mode: HotspotMode;
  activeId: string | null;
  setActiveId: Dispatch<SetStateAction<string | null>>;
  isUltraWide: boolean;
  debug?: boolean;
}

function Hotspot({
  hotspot,
  mode,
  activeId,
  setActiveId,
  isUltraWide,
  debug = false,
}: HotspotProps) {
  const { isActive, triggerProps } = useHotspotTrigger({
    id: hotspot.id,
    mode,
    activeId,
    setActiveId,
  });

  // 768–1920px shows the wide artwork; 1920px+ swaps to the panorama, which
  // frames the buildings differently and so carries its own geometry.
  const { library } = hotspot;
  const { hit, highlight, card } = isUltraWide
    ? hotspot.ultraWide
    : hotspot.wide;

  return (
    <>
      <button
        type="button"
        className={classNames(styles.trigger, { [styles.debugHit]: debug })}
        style={{
          left: `${hit.left}%`,
          top: `${hit.top}%`,
          width: `${hit.width}%`,
          height: hit.height ? `${hit.height}%` : undefined,
        }}
        aria-label={library.libraryName}
        aria-pressed={mode === 'click' ? isActive : undefined}
        data-hotspot={debug ? hotspot.id : undefined}
        {...triggerProps}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={highlight.src}
        alt={highlight.alt}
        aria-hidden
        draggable={false}
        className={classNames(styles.highlight, {
          [styles.active]: isActive || debug,
        })}
        style={{
          left: `${highlight.left}%`,
          top: `${highlight.top}%`,
          width: `${highlight.width}%`,
        }}
      />

      <div
        className={classNames(styles.card, { [styles.cardActive]: isActive })}
        style={{
          left: card.left !== undefined ? `${card.left}%` : undefined,
          right: card.right !== undefined ? `${card.right}%` : undefined,
          top: `${card.top}%`,
        }}
      >
        <LibraryInfoCard {...library} isActive={isActive} />
      </div>
    </>
  );
}

export function InteractiveCover({
  src,
  wideSrc,
  ultraWideSrc,
  alt,
  mode = 'hover',
  className,
}: InteractiveCoverProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Calibration overlay: draws a 5% grid, outlines hit boxes, and forces glows
  // on so the geometry in coverHotspots.ts can be aligned to the art. Dev-only.
  //   ?coverDebug=1        -> show every hotspot
  //   ?coverDebug=house-3  -> isolate a single hotspot for precise alignment
  const [debug, setDebug] = useState(false);
  const [isolateId, setIsolateId] = useState<string | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('coverDebug');
    setDebug(value !== null);
    setIsolateId(value && value !== '1' && value !== '' ? value : null);
  }, []);

  // 768px+ swaps to the wide artwork (see <source> below) and runs the hotspot
  // layer with its wide geometry. Below that is mobile/touch territory: the
  // taller art shows and hover hotspots are dropped.
  const isWide = useMatchMedia('(min-width: 768px)');
  const isUltraWide = useMatchMedia('(min-width: 1920px)');

  // In click mode the card stays open until dismissed, so an outside click or
  // Escape needs to close it. Hover mode dismisses itself via onMouseLeave.
  useEffect(() => {
    if (mode !== 'click' || !activeId) {
      return;
    }

    const onMouseDown = (event: MouseEvent) => {
      if (!frameRef.current?.contains(event.target as Node)) {
        setActiveId(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveId(null);
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mode, activeId]);

  const clearActive = useCallback(() => setActiveId(null), []);

  return (
    <div ref={frameRef} className={classNames(styles.frame, className)}>
      {/* Blurred fill so the side gaps on viewports wider than the art read as
          intentional. Decorative — the <picture> below carries the real alt. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.background}
        src={ultraWideSrc ?? wideSrc ?? src}
        alt=""
        aria-hidden
        draggable={false}
      />

      <picture>
        {ultraWideSrc && (
          <source media="(min-width: 1920px)" srcSet={ultraWideSrc} />
        )}
        {wideSrc && <source media="(min-width: 768px)" srcSet={wideSrc} />}
        <img
          className={styles.image}
          src={src}
          alt={alt}
          draggable={false}
          fetchPriority="high"
        />
      </picture>

      {isWide && (
        <div
          className={classNames(styles.layer, { [styles.debugLayer]: debug })}
          onMouseLeave={mode === 'hover' ? clearActive : undefined}
        >
          {debug && <div className={styles.debugGrid} aria-hidden />}
          {coverHotspots
            .filter(hotspot => !isolateId || hotspot.id === isolateId)
            .map(hotspot => (
              <Hotspot
                key={hotspot.id}
                hotspot={hotspot}
                mode={mode}
                activeId={activeId}
                setActiveId={setActiveId}
                isUltraWide={isUltraWide}
                debug={debug}
              />
            ))}
        </div>
      )}
    </div>
  );
}
