import cn from 'classnames';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './PieTooltip.module.scss';

type PieTooltipProps = {
  data: any;
  hoveredIndex: number | null;
};

const PieTooltip: FC<PieTooltipProps> = ({ data, hoveredIndex }) => {
  const [container, setContainer] = useState(null);

  const tooltipRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setContainer(document.body);
    }
  }, []);

  useEffect(() => {
    function handlePosition(e: MouseEvent) {
      // @ts-ignore
      const { clientX, clientY } = e;

      if (tooltipRef.current) {
        tooltipRef.current.style.top = `${clientY - 20}px`;
        tooltipRef.current.style.left = `${clientX}px`;
      }
    }

    window.addEventListener('mousemove', handlePosition);

    return () => {
      window.addEventListener('mousemove', handlePosition);
    };
  }, []);

  const tooltipTitle = useMemo(() => {
    if (hoveredIndex !== null) {
      return data[hoveredIndex].name;
    }

    return '';
  }, [hoveredIndex]);

  if (!container || !tooltipTitle) return null;

  return (
    <>
      {createPortal(
        <div
          ref={tooltipRef}
          className={cn(styles.PieTooltip, {
            [styles.Active]: hoveredIndex !== null,
          })}
        >
          {tooltipTitle}
        </div>,
        container,
      )}
    </>
  );
};

export default PieTooltip;
