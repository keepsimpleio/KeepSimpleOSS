import { useCallback } from 'react';
import { useRouter } from 'next/router';

import type { TRouter } from '@local-types/global';
import useImageModule from '@hooks/useImageModule';
import { scrollToImage } from '@lib/helpers';
import imageModuleData from '@data/imageModule';

import styles from './PinBlock.module.scss';

const PinBlock = () => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = imageModuleData[currentLocale];
  const { zoomTitle, unpinTitle, scrollToImageTitle } = data;

  const [{ setZoomedImage, setPinnedImage }, { pinnedImage }] =
    useImageModule();

  const handleZoomImage = useCallback(() => {
    setZoomedImage(pinnedImage);
  }, [pinnedImage]);

  const handleScrollToImage = useCallback(() => {
    scrollToImage(pinnedImage);
  }, [pinnedImage]);

  const handleUnpin = useCallback(() => {
    setPinnedImage();
  }, []);

  if (!pinnedImage) return null;

  return (
    <div className={styles.pinnedImage}>
      <img src={pinnedImage} />
      <div className={styles.actionButtonBlock}>
        <div
          className={styles.zoom}
          title={zoomTitle}
          onClick={handleZoomImage}
        ></div>
        <div
          className={styles.scrollToImage}
          title={scrollToImageTitle}
          onClick={handleScrollToImage}
        ></div>
        <div
          className={styles.unpin}
          title={unpinTitle}
          onClick={handleUnpin}
        ></div>
      </div>
    </div>
  );
};

export default PinBlock;
