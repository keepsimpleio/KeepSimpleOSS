import useTooltip from '@uxcore/hooks/useTooltip';
import { calculateTooltipPostion } from '@uxcore/lib/helpers';
import cn from 'classnames';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './Tooltip.module.scss';

const defaultCoords = { top: 0, left: -1000 };

type TTooltip = {
  content: any;
  clickable?: boolean;
  isOnBottom?: boolean;
  dark?: boolean;
  containerClassName?: string;
  isUnique?: boolean;
  children?: any;
  className?: string;
  parentClassName?: string;
  isHy?: boolean;
};

const Tooltip: FC<TTooltip> = ({
  children,
  content,
  clickable,
  isOnBottom,
  dark,
  containerClassName,
  className,
  isUnique,
  parentClassName,
  isHy,
}) => {
  const [{ setActiveTooltipId }, { activeTooltipId }] = useTooltip();
  const [container, setContainer] = useState(null);
  const [coords, setCoords] = useState(defaultCoords);
  const [isHoveredTooltip, setIsHoveredTooltip] = useState(false);
  const [isHoveredBase, setIsHoveredBase] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const tooltipRef = useRef(null);
  const wrapperRef = useRef(null);
  const uniqueId = useMemo(() => uuidv4(), []);

  const getCoords = useCallback(() => {
    const {
      left,
      top,
      bottom,
      width: blockWidth,
    } = wrapperRef.current.getBoundingClientRect();

    const newCoords = calculateTooltipPostion(
      left,
      top,
      bottom,
      blockWidth,
      tooltipRef,
      isOnBottom,
    );

    return newCoords;
  }, [isOnBottom]);

  const handleMouseOver = useCallback(() => {
    if (clickable) return;
    const newCoords = getCoords();

    setCoords(newCoords);
    handleVisibility(true);
    setIsHoveredBase(true);
  }, [isOnBottom, clickable]);

  const handleMouseLeave = useCallback(() => {
    if (clickable) return;
    setIsHoveredBase(false);
    handleVisibility(false);
  }, [clickable]);

  const handleTooltipMouseOver = useCallback(() => {
    if (clickable) return;
    setIsHoveredTooltip(true);
  }, [clickable]);

  const handleTooltipMouseLeave = useCallback(() => {
    if (clickable) return;
    setIsHoveredTooltip(false);
  }, [clickable]);

  const handleVisibility = useCallback(
    (newIsOpened: boolean) => {
      if (isUnique) {
        setActiveTooltipId(newIsOpened ? uniqueId : null);
      } else {
        setIsOpened(newIsOpened);
      }
    },
    [uniqueId, isUnique],
  );

  useEffect(() => {
    if (isUnique) {
      const isVisible = uniqueId === activeTooltipId;
      const newCoords = isVisible ? getCoords() : { ...defaultCoords };

      setCoords(newCoords);
      setIsOpened(isVisible);
    }
  }, [isUnique, uniqueId, activeTooltipId]);

  useEffect(() => {
    if (clickable) return;
    if (!isHoveredBase && !isHoveredTooltip) {
      setCoords(defaultCoords);
    }
  }, [isHoveredBase, isHoveredTooltip]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setContainer(document.body);
    }
  }, []);

  useEffect(() => {
    if (containerClassName) {
      const container = document.getElementsByClassName(containerClassName)[0];

      const handleScroll = () => {
        if (isOpened) {
          const { top: containerTop, bottom: containerBottom } =
            container.getBoundingClientRect();
          const { top: wrapperTop, bottom: wrapperBottom } =
            wrapperRef.current.getBoundingClientRect();
          let newCoords = { ...defaultCoords };

          if (containerTop > wrapperTop || containerBottom < wrapperBottom) {
            handleVisibility(false);
          } else {
            newCoords = getCoords();
          }

          setCoords(newCoords);
        }
      };

      if (container) {
        container.addEventListener('scroll', handleScroll);

        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
      }
    }
  }, [containerClassName, isOpened]);

  const toggleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      if (isUnique) e.stopPropagation();
      if (!clickable) return;

      let newCoords = defaultCoords;

      if (!isOpened) {
        newCoords = getCoords();
      }

      setCoords(newCoords);
      handleVisibility(!isOpened);
    },
    [isOpened, clickable, isOnBottom, isUnique],
  );

  useEffect(() => {
    if (isHoveredBase) {
      const newCoords = getCoords();
      setCoords(newCoords);
    }
  }, [content, isHoveredBase]);

  if (!container) return null;

  return (
    <>
      <div
        ref={wrapperRef}
        className={cn(styles.Tooltip, parentClassName, {
          [styles.Clickable]: clickable,
        })}
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onClick={toggleClick}
      >
        {children}
      </div>
      {createPortal(
        <div
          className={cn(styles.Popup, className, {
            [styles.Bottom]: !!isOnBottom,
            [styles.Dark]: !!dark,
            [styles.Active]: isOpened,
            [styles.HyLang]: isHy,
          })}
          style={coords}
          ref={tooltipRef}
          onMouseEnter={handleTooltipMouseOver}
          onMouseLeave={handleTooltipMouseLeave}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  );
};

export default Tooltip;
