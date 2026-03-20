import Image from 'next/image';
import { FC } from 'react';

import { EnvironmentSubSectionProps } from './EnvironmentSubSection.types';

import styles from './EnvironmentSubSection.module.scss';

const EnvironmentSubSection: FC<EnvironmentSubSectionProps> = ({
  name,
  description,
  iconUrl,
}) => {
  // TODO: Add alt text
  return (
    <div className={styles.environmentSubSection}>
      <div className={styles.titleAndIcon}>
        <Image src={iconUrl} alt={''} width={24} height={24} unoptimized />
        <span className={styles.title}> {name}</span>
      </div>
      <hr className={styles.hr} />
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className={styles.description}
      />
    </div>
  );
};
export default EnvironmentSubSection;
