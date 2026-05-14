import cn from 'classnames';
import { FC, useEffect, useLayoutEffect, useRef } from 'react';

import { useBrowserScale } from '@uxcore/hooks/useBrowserScale';

import {
  getLeftEndOfPath,
  getRightEndOfPath,
  handleExceptionalIndex,
  sortPathsByVerticalPosition,
} from '@uxcore/lib/core-view-helpers';

import { defaultPaths, forthPaths, secondPaths, thirdPaths } from './paths';
import { UXCoreLinesProps } from './UXCoreLines.types';

import styles from './UXCoreLines.module.scss';

const UXCoreLines: FC<UXCoreLinesProps> = ({
  startGreen,
  startPink,
  startPurple,
  setHovered,
  hovered,
  setPathGeometry,
  isLeftSection,
  className,
  setSvgSize,
  pathName,
  searchResults,
  sectionId,
}) => {
  const refs = useRef([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const scaleDetector = useBrowserScale();
  const isScaleMoreThanOne = scaleDetector > 1;

  const PATH_MAP: Record<string, string[]> = {
    first: defaultPaths,
    second: secondPaths,
    third: thirdPaths,
    forth: forthPaths,
  };
  const activePaths = PATH_MAP[pathName] || defaultPaths;
  const svgHeightRes = pathName === 'third' ? 350 : 325;

  useEffect(() => {
    const geoms = activePaths.map((d, index) => {
      if (
        !isLeftSection &&
        index === activePaths.length - 1 &&
        pathName !== 'second'
      ) {
        return { x: 352.029, y: 320.736 };
      }
      if (pathName === 'second' && index === 25) {
        return { x: 352.029, y: 1 };
      }
      if (pathName === 'forth' && index === 25) {
        return { x: 1.029, y: 0 };
      }

      const g = isLeftSection
        ? getLeftEndOfPath(d, index, pathName)
        : getRightEndOfPath(d);
      return g;
    });
    let sorted = activePaths;

    if (isLeftSection) {
      sorted = sortPathsByVerticalPosition(activePaths);
    }

    const thirdGeoms = sorted.map((d, index) =>
      getLeftEndOfPath(d, index, pathName),
    );

    setPathGeometry?.(pathName === 'third' ? thirdGeoms : geoms);
  }, [isLeftSection]);

  // This is for resizing SVG on window resize
  useEffect(() => {
    if (!svgRef.current) return;

    const obs = new ResizeObserver(entries => {
      const box = entries[0].contentRect;
      setSvgSize({ width: box.width, height: box.height });
    });

    obs.observe(svgRef.current);

    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width && rect.height) {
        setSvgSize({ width: rect.width, height: rect.height });
      }
    };

    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayPaths =
    pathName === 'third'
      ? sortPathsByVerticalPosition(activePaths)
      : activePaths;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 353 ${svgHeightRes}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(styles.svg, className, {
        [styles.leftSectionSvg]: pathName === 'third',
        [styles.scaleMoreThanOne]: isScaleMoreThanOne,
      })}
    >
      {displayPaths.map((d, index) => {
        const geom = getRightEndOfPath(d);
        const cssIndex = handleExceptionalIndex(index, pathName);
        const searchedBiasLine = searchResults.map(bias => bias?.index);
        return (
          <path
            onMouseEnter={() =>
              !!setHovered && setHovered({ sectionId, index: cssIndex })
            }
            onMouseLeave={() => !!setHovered && setHovered(null)}
            data-x={geom?.x}
            data-y={geom?.y}
            ref={el => (refs.current[index] = el)}
            key={index}
            d={d}
            className={cn(styles.path, {
              [styles.greenPath]: startGreen >= index,

              [styles.pinkPath]: startPink !== undefined && startPink <= index,

              [styles.purplePath]:
                startPurple !== undefined && startPurple >= index,

              [styles.hoveredBluePath]:
                hovered?.sectionId === sectionId && hovered?.index === cssIndex,

              [styles.hoveredGreenPath]:
                startGreen >= index &&
                hovered?.sectionId === sectionId &&
                hovered?.index === index,

              [styles.hoveredPinkPath]:
                startPink <= index &&
                hovered?.sectionId === sectionId &&
                hovered?.index === cssIndex,

              [styles.hoveredPurplePath]:
                startPurple >= index &&
                hovered?.sectionId === sectionId &&
                hovered?.index === index,

              [styles.searchedPathGreen]:
                startGreen >= index && searchedBiasLine.includes(cssIndex),

              [styles.searchedBluePath]: searchedBiasLine.includes(cssIndex),

              [styles.searchedPathPink]:
                startPink <= index && searchedBiasLine.includes(cssIndex),

              [styles.searchedPathPurple]:
                startPurple >= index && searchedBiasLine.includes(cssIndex),

              [styles.fadedPath]:
                searchResults.length > 0 &&
                !searchedBiasLine.includes(cssIndex),
            })}
          />
        );
      })}
    </svg>
  );
};
export default UXCoreLines;
