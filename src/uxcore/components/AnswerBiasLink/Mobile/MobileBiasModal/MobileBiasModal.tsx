import type { FC } from 'react';
import { createPortal } from 'react-dom';

import BiasPopupContent from '../../BiasPopupContent';

import styles from './MobileBiasModal.module.scss';

interface MobileBiasModalProps {
  locale: 'en' | 'ru' | 'hy';
  title: string;
  description: string;
  onClose: () => void;
  slug?: string;
  number?: number;
}

const MobileBiasModal: FC<MobileBiasModalProps> = ({
  title,
  locale,
  description,
  onClose,
  slug,
  number,
}) => {
  return (
    <>
      {createPortal(
        <div className={styles.MobileBiasModalOverlay}>
          <div className={styles.MobileBiasModal}>
            <BiasPopupContent
              title={title}
              locale={locale}
              description={description}
              slug={slug}
              onClose={onClose}
              number={number}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default MobileBiasModal;
