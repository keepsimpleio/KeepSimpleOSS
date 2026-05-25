import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import { generateLabelsData, isMobileDevice } from '@uxcore/lib/helpers';

import ZoomBox from '@uxcore/components/_biases/ZoomBox';

import { BiasLabelProps } from './BiasLabel.types';

import styles from './BiasLabel.module.scss';

const BiasLabel: FC<BiasLabelProps> = ({
  category,
  biasName,
  biasNumber,
  index,
  biases,
  isLeftSection,
  slug,
  geometry,
  className,
  hovered,
  setHovered,
  sectionId,
  searchResults,
}) => {
  const labelRef = useRef(null);
  const zoomBoxRef = useRef(null);

  const router = useRouter();
  const { locale } = router as TRouter;

  const [isZoomBoxVisible, setIsZoomBoxVisible] = useState(false);
  const [labelsData, setLabelsData] = useState(null);
  const [zoomBoxCoords, setZoomBoxCoords] = useState({ x: -300, y: -300 });
  const [zoomBoxPosition, setZoomBoxAlignment] = useState<'left' | 'right'>(
    'right',
  );

  const croppedBiasName =
    locale === 'hy' && biasName.length > 25
      ? biasName.slice(0, 25) + '…'
      : biasName;

  const handleLabelMouseEvents = (e: MouseEvent) => {
    if (isMobileDevice()) return;

    if (e.type === 'mouseover') {
      setIsZoomBoxVisible(true);
      const labelsData = generateLabelsData(
        biases,
        Number(biasNumber),
        zoomBoxPosition,
      );
      setLabelsData(labelsData);
    } else {
      setIsZoomBoxVisible(false);
    }
  };

  const handleLabelMouseMove = (e: MouseEvent) => {
    if (zoomBoxRef.current) {
      const { height, width } = zoomBoxRef.current.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      const top = y - height / 2;
      let left;

      if (zoomBoxPosition === 'left') {
        left = x + 30;
      } else {
        left = x - 30 - width;
      }

      setZoomBoxCoords({
        x: left,
        y: top,
      });
    }
  };

  useEffect(() => {
    const alignment = Number(biasNumber) > 52 ? 'left' : 'right';
    setZoomBoxAlignment(alignment);
  }, [biasNumber]);

  return (
    <>
      <div
        data-cy="search-result-item"
        onMouseOver={handleLabelMouseEvents}
        onMouseOut={handleLabelMouseEvents}
        onMouseMove={handleLabelMouseMove}
        onMouseEnter={() => !!setHovered && setHovered({ sectionId, index })}
        onMouseLeave={() => !!setHovered && setHovered(null)}
        ref={labelRef}
        style={{
          // @ts-ignore
          '--x': geometry?.x,
          '--y': geometry?.y,
        }}
        data-state={
          searchResults.includes(Number(biasNumber)) ? 'hovered' : 'faded'
        }
        className={cn(styles.biasLabel, className, {
          [styles.secondRow]: sectionId === 2,
          [styles.searched]:
            searchResults.length > 0 &&
            searchResults.includes(Number(biasNumber)),
          [styles.faded]:
            searchResults.length > 0 &&
            !searchResults.includes(Number(biasNumber)),
          [styles.isLeftSection]: isLeftSection,
          [styles.biasLabelHy]: locale === 'hy',
          // These are exceptional positions for left-top section labels
          [styles[`bias-label-${biasNumber}`]]: isLeftSection,
          [styles.hovered]:
            hovered?.sectionId === sectionId && hovered?.index === index,
        })}
      >
        <Link href={`/uxcore/${slug}`} scroll={false} className={styles.link}>
          <div
            className={cn(styles.label, {
              [styles[category]]: category,
            })}
          >
            <span className={styles.txt}> {croppedBiasName}</span>
          </div>
        </Link>
      </div>
      {labelsData && (
        <ZoomBox
          locale={locale}
          ref={zoomBoxRef}
          isVisible={isZoomBoxVisible}
          alignment={zoomBoxPosition}
          labels={labelsData}
          {...zoomBoxCoords}
        />
      )}
    </>
  );
};
export default BiasLabel;
