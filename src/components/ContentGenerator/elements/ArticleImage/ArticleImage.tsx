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

  const strapiBase = process.env.NEXT_PUBLIC_STRAPI ?? '';
  const imageSrc = src.includes(strapiBase) ? src : `${strapiBase}${src}`;

  const handleZoom = useCallback(() => {
    setZoomedImage(imageSrc);
  }, [imageSrc]);

  const handleTogglePin = useCallback(() => {
    setPinnedImage(pinnedImage === imageSrc ? undefined : imageSrc);
  }, [pinnedImage, imageSrc]);

  const handleOpenInNewWindow = useCallback(() => {
    window.open(imageSrc);
  }, [imageSrc]);

  return (
    <div className={styles.image}>
      <div className={styles.imageActions}>
        <div className={styles.zoom} onClick={handleZoom} title={zoomTitle} />
        <div
          className={cn(styles.pin, {
            [styles.unpin]: pinnedImage === imageSrc,
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
        src={imageSrc}
        alt={alt}
        onClick={handleZoom}
        data-cy="zoom-trigger"
      />
    </div>
  );
};

export default ArticleImage;
