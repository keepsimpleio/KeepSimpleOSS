import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';

import type { NewUpdateModalProps } from './NewUpdateModal.types';

import styles from './NewUpdateModal.module.scss';

const NewUpdateModal: FC<NewUpdateModalProps> = ({ data, onClose }) => {
  const closeText = data?.['Close button text'];
  const socialLink = data?.['Social media link'];

  return (
    <Modal
      onClick={onClose}
      title={data?.title}
      blackTitle={true}
      hasBorder
      bodyClassName={styles['modalBody']}
    >
      <div>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI}${data?.image?.data?.attributes?.url}`}
          width={481}
          height={121}
          className={styles.img}
          alt={'New Update'}
        />
        <Link href={socialLink} target={'_blank'}>
          <Image
            src={'/assets/insta-icon.svg'}
            alt={'Insta Icon'}
            width={15}
            height={14}
            className={styles.instaIcon}
          />
        </Link>
      </div>
      <div className={styles.content}>
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {data.description}
        </ReactMarkdown>
        <div className={styles.btnWrapper}>
          <Button
            label={closeText}
            onClick={onClose}
            className={styles['closeBtn']}
          />
        </div>
      </div>
    </Modal>
  );
};
export default NewUpdateModal;
