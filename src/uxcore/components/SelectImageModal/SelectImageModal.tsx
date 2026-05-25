import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import modalData from '@uxcore/data/uxcat/imageSelectModal';

import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';

import styles from './SelectImageModal.module.scss';

type SelectImageModalProps = {
  title: string;
  selectedImage?: string;
  setSelectedImage?: (image: string) => void;
  setCloseModal: (closeModal: boolean) => void;
  closeModal?: boolean;
  images?: any; // TODO Mary - handle this plz
  updateImage: (url: string) => void;
  imageURLExtractor?: (item) => { thumbnail: string; image: string };
  defaultImage?: string;
  isBgImageModal?: boolean;
};

const SelectImageModal: FC<SelectImageModalProps> = ({
  title,
  setCloseModal,
  images,
  imageURLExtractor,
  updateImage,
  defaultImage,
  isBgImageModal,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const { saveBtn, cancelBtn } = modalData[locale];
  const baseURL = process.env.NEXT_PUBLIC_STRAPI;
  const imageList = images.data;
  const handleClose = () => {
    setCloseModal(false);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleImageUpdate = image => {
    updateImage(image);
    handleClose();
  };

  return (
    <Modal
      size={'small'}
      onClick={handleClose}
      hasBorder
      title={title}
      wrapperClassName={styles['modalWrapper']}
      bodyClassName={styles['modalBody']}
    >
      <div className={styles.container}>
        <div className={styles.imagesWrapper}>
          {isBgImageModal && (
            <div
              className={cn(styles.img, {
                [styles.selected]: selectedImage === null,
                [styles.defaultBg]: isBgImageModal,
              })}
              onClick={() => handleImageClick(null)}
            ></div>
          )}
          {imageList && imageList.length > 0
            ? imageList
                .slice()
                .reverse()
                .map((item, index) => {
                  const thumbnailUrl = imageURLExtractor(item).thumbnail;
                  const imageUrl = imageURLExtractor(item).image;
                  const isSelected = selectedImage === imageUrl;

                  return (
                    <Image
                      key={index}
                      src={`${baseURL}${thumbnailUrl}`}
                      alt={`Thumbnail ${index + 1}`}
                      width={210}
                      height={124}
                      className={cn(styles.img, {
                        [styles.selected]: isSelected,
                      })}
                      onClick={() => handleImageClick(imageUrl)}
                    />
                  );
                })
            : Array.from({ length: imageList.length }).map((_, index) => (
                <div key={index} className={styles.skeleton}></div>
              ))}
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button label={cancelBtn} onClick={handleClose} />
        <Button
          label={saveBtn}
          onClick={() => {
            handleImageUpdate(selectedImage);
          }}
          type={'primary'}
        />
      </div>
    </Modal>
  );
};

export default SelectImageModal;
