import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';
import congratulationsModal from '@uxcore/data/uxcat/congratulationsModal';
import useMobile from '@uxcore/hooks/useMobile';
import { TRouter } from '@uxcore/local-types/global';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import Confetti from 'react-confetti';

import styles from './CongratsModal.module.scss';

type CongratsModalProps = {
  closeModal: () => void;
  username: string;
};
const CongratsModal: FC<CongratsModalProps> = ({ closeModal, username }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { isMobile } = useMobile()[1];
  const urlLocale = locale === 'en' ? '/' : `/${locale}/`;

  const {
    title,
    mainInfo,
    description,
    downloadOption,
    showCertificate,
    hooray,
  } = congratulationsModal[locale];

  const modalTitle = isMobile ? '' : title;

  const handleOpenCertificate = () => {
    const url = `${urlLocale}user/${username}/certificate`;
    window.open(url, '_blank');
  };

  return (
    <Modal
      title={modalTitle}
      blackTitle
      hasBorder
      wrapperClassName={styles['wrapper']}
      removeBorderMobile
      onClick={closeModal}
    >
      <Confetti
        gravity={0.04}
        recycle={false}
        numberOfPieces={600}
        className={styles.canvas}
        colors={[
          '#87c58d',
          '#ffec9f',
          '#aebafa',
          '#e4879b',
          '#ffffff',
          '#ff9900',
          '#d253ff',
        ]}
      />
      <div className={styles.content}>
        <Image
          src={'/assets/uxcat/milestone.png'}
          width={isMobile ? 120 : 146}
          height={isMobile ? 120 : 146}
          alt={'Milestone png'}
        />
        {isMobile && <h2 className={styles.mobileTitle}> {title} </h2>}
        <h3 className={styles.mainInfo}>{mainInfo}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.downloadOption}>
          <span className={styles.downloadTxt}> {downloadOption}</span>
          <Image
            src={'/assets/uxcat/certificate-example.png'}
            width={isMobile ? 113 : 116}
            height={isMobile ? 84 : 71}
            alt={'Certificate example'}
          />
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button
          label={showCertificate}
          onClick={() => handleOpenCertificate()}
          className={styles['firstBtn']}
        />
        <Button label={hooray} onClick={closeModal} type={'primary'} />
      </div>
    </Modal>
  );
};

export default CongratsModal;
