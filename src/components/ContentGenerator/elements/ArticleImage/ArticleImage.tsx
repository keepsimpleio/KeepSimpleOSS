import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';

import type { TRouter } from '@local-types/global';

import useImageModule from '@hooks/useImageModule';

import imageModuleData from '@data/imageModule';

type TImage = {
  styles: any;
  src: string;
  alt?: string;
};

const ArticleImage: FC<TImage> = ({ styles, src, alt }) => {
  const router = useRouter();

  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = imageModuleData[currentLocale];
  const { zoomTitle, pinTitle, unpinTitle, newWindowTitle } = data;
  const [{ setZoomedImage, setPinnedImage }, { pinnedImage }] =
    useImageModule();

  const handleZoom = useCallback(() => {
    setZoomedImage(src);
  }, [src]);

  const handleTogglePin = useCallback(() => {
    setPinnedImage(pinnedImage === src ? undefined : src);
  }, [pinnedImage, src]);

  const handleOpenInNewWindow = useCallback(() => {
    window.open(src);
  }, [src]);

  return (
    <div className={styles.image}>
      <div className={styles.imageActions}>
        <div className={styles.zoom} onClick={handleZoom} title={zoomTitle} />
        <div
          className={cn(styles.pin, {
            [styles.unpin]: pinnedImage === src,
          })}
          onClick={handleTogglePin}
          title={pinnedImage ? unpinTitle : pinTitle}
        />
        <div
          className={styles.newWindow}
          onClick={handleOpenInNewWindow}
          title={newWindowTitle}
        />
      </div>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: 'inherit', height: 'auto' }}
        src={src}
        alt={alt}
        onClick={handleZoom}
        data-cy="zoom-trigger"
      />
    </div>
  );
};

export default ArticleImage;
