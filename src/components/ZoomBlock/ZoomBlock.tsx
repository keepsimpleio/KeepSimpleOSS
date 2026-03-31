import Image from 'next/image';
import { FC, useCallback, useEffect } from 'react';

import useImageModule from '@hooks/useImageModule';

import styles from './ZoomBlock.module.scss';

interface ZoomBlockProps {
  className?: string;
}

const ZoomBlock: FC<ZoomBlockProps> = ({ className }) => {
  const [{ setZoomedImage }, { zoomedImage }] = useImageModule();

  const removeZoomBlock = useCallback(() => {
    setZoomedImage();
  }, [zoomedImage]);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        removeZoomBlock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [removeZoomBlock]);

  if (!zoomedImage) return null;

  return (
    <div
      className={styles.zoomBlock}
      onClick={removeZoomBlock}
      data-cy="zoomed-image"
    >
      <div>
        wtd
        <Image
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 'inherit', height: 'auto' }}
          src={zoomedImage}
          alt={'zoomed image'}
          className={className}
        />
      </div>
    </div>
  );
};

export default ZoomBlock;
