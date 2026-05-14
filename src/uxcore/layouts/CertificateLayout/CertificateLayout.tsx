import { FC, useContext, useState } from 'react';
import { usePDF } from 'react-to-pdf';

import copyButtonData from '@data/copyButton';
import downloadButtonData from '@data/downloadButton';

import CopyLinkIcon from '@icons/CopyLinkIcon';

import Button from '@uxcore/components/Button';
import CertificateContainer from '@uxcore/components/CertificateContainer';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';

import styles from './CertificateLayout.module.scss';

export type CertificateLayoutProps = {
  name?: string;
  userId?: number | string;
  receivedDate?: string;
  locale?: string;
  link?: string;
  username?: string;
};
const CertificateLayout: FC<CertificateLayoutProps> = ({
  name,
  userId,
  receivedDate,
  locale,
  link,
  username,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { accountData } = useContext(GlobalContext);
  const isOwner = accountData?.username === username;
  const { toPDF, targetRef } = usePDF({ filename: 'UXCat-Certificate.pdf' });

  const { copied, copyButton } = copyButtonData[locale];
  const { download, downloaded } = downloadButtonData[locale];

  const handleCopy = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleDownload = async () => {
    const targetDiv = targetRef.current;
    setIsDownloaded(true);

    targetDiv.classList.add(styles.pdfFont);
    targetDiv.classList.remove(styles.screenFont);

    toPDF(targetDiv);

    targetDiv.classList.add(styles.screenFont);
    targetDiv.classList.remove(styles.pdfFont);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  return (
    <section className={styles.wrapper}>
      <div ref={targetRef}>
        <CertificateContainer
          name={name || ''}
          userId={userId || ''}
          receivedDate={receivedDate || ''}
        />
      </div>
      {isOwner && (
        <div className={styles.btnWrapper}>
          <Button
            label={isCopied ? copied : copyButton}
            onClick={handleCopy}
            icon={<CopyLinkIcon />}
          />
          <Button
            label={isDownloaded ? downloaded : download}
            onClick={handleDownload}
          />
        </div>
      )}
    </section>
  );
};

export default CertificateLayout;
