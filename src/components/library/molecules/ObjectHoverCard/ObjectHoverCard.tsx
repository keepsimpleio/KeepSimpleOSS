import classNames from 'classnames';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  DIFFICULTY_META,
  formatObjectDate,
  formatObjectDuration,
  htmlToPlainText,
  OVERALL_COLORS,
} from '@lib/library/objectMeta';

import { InkLine } from '@components/library/atoms/InkLine';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tag } from '@components/library/molecules/Tag';

import type { ObjectHoverCardProps } from './ObjectHoverCard.types';

import styles from './ObjectHoverCard.module.scss';

// The panel mounts on the first hover frame — no dwell timer. The fade below
// carries the softness that a delay used to buy.
// Matches the fade in the stylesheet: the panel leaves the DOM only once it
// has faded out, so the exit is eased like the entrance.
const EXIT_MS = 200;
// Matches the panel width in the stylesheet; used for the first placement pass,
// before the panel has been measured.
const PANEL_WIDTH = 300;
const GAP = 14;
const VIEWPORT_MARGIN = 12;
const MAX_TAGS = 4;

const KIND_LABEL: Record<string, string> = {
  book: 'Book',
  video: 'Video',
  audio: 'Audio',
};

interface PanelPosition {
  top: number;
  left: number;
  side: 'left' | 'right';
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

/**
 * The dossier that opens beside an object on hover: what the card itself has
 * no room to say. Read-only and `pointer-events: none`, so it never stands
 * between the cursor and the object it describes.
 *
 * It is portaled to the body because the shelf clips its own scroll row
 * (`overflow` + `clip-path`), which would slice any panel rendered in place.
 *
 * The appear transition and its `prefers-reduced-motion: reduce` branch (which
 * drops both the fade and the drift) live in ObjectHoverCard.module.scss.
 */
export function ObjectHoverCard({
  object,
  anchorRef,
  open,
  disabled = false,
  ownerUsername,
}: ObjectHoverCardProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  // `mounted` keeps the panel in the DOM; `shown` drives the fade. They part
  // company on the way out, where the panel stays mounted until it is invisible.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);

  const { attributes } = object;
  const type = attributes.type;

  // Touch and pen sessions have no hover to speak of; a tap would otherwise
  // leave the panel stranded on screen.
  useEffect(() => {
    if (!open || disabled) return;
    const canHover =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    setMounted(true);
  }, [open, disabled]);

  useEffect(() => {
    if (open && !disabled) return;
    setShown(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, disabled]);

  // Placement is measured, not guessed: the panel sits to the right of the
  // object when the viewport allows and flips to its left when it does not,
  // vertically centred on the object and kept inside the viewport either way.
  // Recomputed while the shelf or the page scrolls so it stays glued.
  useEffect(() => {
    if (!mounted) {
      setPosition(null);
      return;
    }
    let raf = 0;
    const place = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const panelWidth = panelRef.current?.offsetWidth || PANEL_WIDTH;
      const panelHeight = panelRef.current?.offsetHeight ?? 0;

      const roomRight = window.innerWidth - rect.right;
      const side: PanelPosition['side'] =
        roomRight >= panelWidth + GAP + VIEWPORT_MARGIN ? 'right' : 'left';

      const rawLeft =
        side === 'right' ? rect.right + GAP : rect.left - GAP - panelWidth;
      const left = clamp(
        rawLeft,
        VIEWPORT_MARGIN,
        window.innerWidth - panelWidth - VIEWPORT_MARGIN,
      );
      const top = clamp(
        rect.top + rect.height / 2 - panelHeight / 2,
        VIEWPORT_MARGIN,
        window.innerHeight - panelHeight - VIEWPORT_MARGIN,
      );

      setPosition(prev =>
        prev && prev.top === top && prev.left === left && prev.side === side
          ? prev
          : { top, left, side },
      );
      // Only fade in once there is a real position to fade in at.
      setShown(true);
    };

    place();
    // The panel mounts after the first pass, so re-measure once it has a
    // height and can be centred properly.
    raf = window.requestAnimationFrame(place);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [mounted, anchorRef]);

  const tags = attributes.tags?.data ?? [];
  const published = formatObjectDate(attributes.publicationDate);
  const duration =
    type === 'book' || !attributes.duration
      ? null
      : formatObjectDuration(attributes.duration);
  const byline =
    type === 'book'
      ? attributes.author
      : (attributes.author ?? attributes.source);
  const difficulty = attributes.difficulty
    ? DIFFICULTY_META[attributes.difficulty]
    : null;
  const description = useMemo(
    () => htmlToPlainText(attributes.description),
    [attributes.description],
  );

  const metaRows = [
    published ? { label: 'Published', value: published } : null,
    duration ? { label: 'Duration', value: duration } : null,
    // Video and audio fall back to the source as their byline, so only list it
    // again here when the byline is showing something else.
    type !== 'book' && attributes.source && byline !== attributes.source
      ? { label: 'Source', value: attributes.source }
      : null,
    attributes.shelfName
      ? { label: 'Shelf', value: attributes.shelfName }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // Books carry a review; the block appears whether or not it has been filled
  // in, so an unrated book says so instead of going silent.
  const showReview = type === 'book';
  const isRated = !!attributes.overall || !!difficulty;
  const reviewHeading = ownerUsername
    ? `${ownerUsername} ${isRated ? 'rated this book' : 'didn’t rate this book'}`
    : isRated
      ? 'Rating'
      : 'Not rated yet';

  const hasDetails =
    !!byline ||
    !!description ||
    metaRows.length > 0 ||
    tags.length > 0 ||
    showReview;

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="library">
      <div
        ref={panelRef}
        role="tooltip"
        aria-hidden="true"
        className={classNames(styles.panel, {
          [styles.placed]: shown && !!position,
          [styles.fromLeft]: position?.side === 'left',
        })}
        style={{ top: position?.top ?? 0, left: position?.left ?? 0 }}
      >
        <div className={styles.head}>
          <span className={styles.kind}>{KIND_LABEL[type] ?? type}</span>
        </div>

        <Text
          variant={TypographyVariant.TextBaseSemibold}
          className={styles.title}
        >
          {attributes.title}
        </Text>

        {byline && <p className={styles.byline}>{byline}</p>}

        <InkLine seed={9} className={styles.rule} />

        {metaRows.length > 0 && (
          <dl className={styles.meta}>
            {metaRows.map(row => (
              <div key={row.label} className={styles.metaRow}>
                <dt className={styles.metaLabel}>{row.label}</dt>
                <dd className={styles.metaValue}>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {description && <p className={styles.description}>{description}</p>}

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, MAX_TAGS).map(tag => (
              <Tag
                key={tag.id}
                className={styles.tag}
                label={tag.attributes.name}
                color={tag.attributes.color}
              />
            ))}
            {tags.length > MAX_TAGS && (
              <span className={styles.tagOverflow}>
                +{tags.length - MAX_TAGS}
              </span>
            )}
          </div>
        )}

        {showReview && (
          <>
            <InkLine seed={3} className={styles.rule} />
            <p className={styles.reviewHeading}>{reviewHeading}</p>
            {isRated ? (
              <dl className={styles.meta}>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Overall</dt>
                  <dd
                    className={classNames(styles.metaValue, styles.chipValue)}
                  >
                    {attributes.overall ? (
                      <>
                        <span
                          className={styles.chip}
                          style={{
                            backgroundColor: OVERALL_COLORS[attributes.overall],
                          }}
                        />
                        {attributes.overall}
                        <span className={styles.chipSuffix}>/5</span>
                      </>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Difficulty</dt>
                  <dd
                    className={classNames(styles.metaValue, styles.chipValue)}
                  >
                    {difficulty ? (
                      <>
                        <span
                          className={styles.chip}
                          style={{ backgroundColor: difficulty.color }}
                        />
                        {difficulty.label}
                      </>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>
              </dl>
            ) : null}
          </>
        )}

        {!hasDetails && (
          <p className={styles.empty}>No details added to this object yet.</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
