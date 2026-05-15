import Image from 'next/image';
import { FC } from 'react';

import styles from './CertificateContainer.module.scss';

export type CertificateProps = {
  name: string;
  receivedDate?: string;
  userId?: number | string;
};
const CertificateContainer: FC<CertificateProps> = ({
  name,
  userId,
  receivedDate,
}) => {
  const info =
    `This certificate means that ${name}. has finished studying course of patterns of human thinking (cognitive biases).\n` +
    "Their adept analysis of more than 300 real-world situations under pressure is no accident but the culmination of dedicated self-improvement. This achievement distinguishes their awareness from the majority of society. They promptly identify their own biases, mitigate the impact of others' biased decisions, and deserve applause for reaching the final level of the uxCAT project.";

  return (
    <div className={styles.certificateContainer}>
      <Image
        width={1142}
        height={694}
        className={styles.background}
        src={'/assets/certificate/bg.svg'}
        alt={'Certificate Background'}
      />
      <div className={styles.certificate}>
        <div className={styles.firstWrapper}>
          <div className={styles.info}>
            <Image
              src={'/assets/certificate/uxcore-logo.svg'}
              alt={'UXCore Logo'}
              width={160}
              height={34}
              className={styles.uxcoreLogo}
            />
            <Image
              src={'/assets/certificate/title.svg'}
              alt={'Title Icon'}
              width={560}
              height={50}
              className={styles.titleIcon}
            />
            <h1 className={styles.name}>{name}</h1>
            <span className={styles.subText}>
              has successfully passed UX Core Final Test on {receivedDate}
            </span>
            <p className={styles.description}> {info}</p>
          </div>
        </div>
        <div className={styles.secondWrapper}>
          <div className={styles.signingAndId}>
            <Image
              src={'/assets/certificate/signature.svg'}
              alt={'UXCore Logo'}
              width={170}
              height={32}
            />
            <span className={styles.authorName}> Author of UX Core</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateContainer;
