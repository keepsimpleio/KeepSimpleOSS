import cn from 'classnames';
import { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { BiasType } from '@uxcore/local-types/data';

import styles from './ZoomBox.module.scss';

type TLabel = {
  data: BiasType;
  sectionId: number;
  id: number;
};

type ZoomBoxProps = {
  alignment?: 'left' | 'right';
  isVisible: boolean;
  x: number;
  y: number;
  labels: TLabel[];
  locale: 'en' | 'ru' | 'hy';
};

// eslint-disable-next-line react/display-name
const ZoomBox = forwardRef<HTMLDivElement, ZoomBoxProps>(
  ({ alignment, isVisible, x, y, labels, locale }, ref) => {
    const [container, setContainer] = useState(null);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setContainer(document.body);
      }
    }, []);

    if (!container || !isVisible) return null;
    return (
      <>
        {createPortal(
          <div
            data-cy={'core-zoom-box'}
            className={cn(styles.ZoomBox, {
              [styles.Right]: alignment === 'right',
            })}
            ref={ref}
            style={{
              left: x,
              top: y,
            }}
          >
            {labels.map(({ sectionId, id, data }, index) => (
              <div
                key={index}
                className={cn(styles.ZoomBoxLabel, {
                  [styles[`Section${sectionId}`]]: true,
                })}
                style={{ visibility: id === 999 ? 'hidden' : 'visible' }}
              >
                #<span>{id}</span>
                {/*HYTranslation TODO*/}
                <span>{data?.attributes?.title}</span>
                {data?.p && (
                  <img src="/assets/biases/p.svg" height="12" width="12" />
                )}
                {data?.m && (
                  <img src="/assets/biases/m.svg" height="12" width="12" />
                )}
              </div>
            ))}
          </div>,
          container,
        )}
      </>
    );
  },
);

ZoomBox.defaultProps = {
  alignment: 'left',
};
export default ZoomBox;
