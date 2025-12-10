import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';

import { TRouter } from '@local-types/global';

import staticData from '@data/companyManagement';

import styles from './PyramidTooltip.module.scss';

type TooltipContent = {
  content: string;
  icon: string;
};

interface PyramidTooltipProps {
  children: any;
  title?: string;
  parentClassName?: string;
  tooltipContent?: TooltipContent[];
  tooltipImg?: string;
  onMouseOver?: () => void;
  onClick?: () => void;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
}

const PyramidTooltip: FC<PyramidTooltipProps> = ({
  children,
  title,
  parentClassName,
  tooltipContent,
  tooltipImg,
  onMouseOver,
  onClick,
  onMouseLeave,
  onMouseEnter,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const wrappedElementRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const { learnMoreTxt } = staticData[currentLocale];

  useEffect(() => {
    const tooltip = tooltipRef.current;
    const wrappedElement = wrappedElementRef.current;

    if (!tooltip || !wrappedElement) {
      return;
    }

    const mouseOverEventListener = (): void => {
      setTooltipVisible(true);
    };

    const moveLeaveEventListener = (): void => {
      setTooltipVisible(false);
    };

    const mouseMoveEventListener = (e: MouseEvent): void => {
      const tooltipWidth = tooltip.clientWidth;

      tooltip.style.top = `${e.pageY + -150}px`;
      tooltip.style.left = `${e.pageX - tooltipWidth + 420}px`; // Adjusted for centering tooltip
    };

    wrappedElement.addEventListener('mousemove', mouseMoveEventListener);
    wrappedElement.addEventListener('mouseover', mouseOverEventListener);
    wrappedElement.addEventListener('mouseout', moveLeaveEventListener);

    return () => {
      wrappedElement.removeEventListener('mouseover', mouseOverEventListener);
      wrappedElement.removeEventListener('mouseleave', moveLeaveEventListener);
      wrappedElement.removeEventListener('mousemove', mouseMoveEventListener);
    };
  }, []);

  return (
    <>
      <div
        ref={wrappedElementRef}
        className={parentClassName}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </div>
      {createPortal(
        <div
          className={cn(styles.tooltip, {
            [styles.visible]: tooltipVisible,
          })}
          ref={tooltipRef}
        >
          <div className={styles.titleAndImg}>
            <div className={cn(styles.imgWrapper, styles.block)}>
              <img src={tooltipImg} alt="tooltip" width={40} height={35} />
            </div>
            <h4 className={styles.title}> {title}</h4>
          </div>
          <div>
            {tooltipContent?.map((item, index) => (
              <p key={index} className={styles.txt}>
                {item.content}
                {!!item.icon && (
                  <span
                    className={cn(
                      item.icon === 'up' && styles.up,
                      item.icon === 'down' && styles.down,
                      false,
                    )}
                  ></span>
                )}
              </p>
            ))}
          </div>
          <span className={styles.learnMore}>
            <Image
              src={'/keepsimple_/assets/company-management/cursor.svg'}
              width={17}
              height={17}
              alt={'cursor'}
            />
            {learnMoreTxt}
          </span>
        </div>,
        document.body,
      )}
    </>
  );
};

export default PyramidTooltip;
