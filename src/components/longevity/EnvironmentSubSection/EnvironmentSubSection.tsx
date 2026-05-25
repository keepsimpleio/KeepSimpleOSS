import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import useInView from '@hooks/useInView';

import { sanitizeHtml } from '@lib/sanitizeHtml';

import { EnvironmentSubSectionProps } from './EnvironmentSubSection.types';

import styles from './EnvironmentSubSection.module.scss';

const EnvironmentSubSection: FC<EnvironmentSubSectionProps> = ({
  name,
  description,
  iconUrl,
}) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(styles.environmentSubSection, {
        [styles.visible]: inView,
      })}
    >
      <div className={styles.titleAndIcon}>
        <Image src={iconUrl} alt={''} width={24} height={24} unoptimized />
        <span className={styles.title}> {name}</span>
      </div>
      <hr className={styles.hr} />
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        className={styles.description}
      />
    </div>
  );
};
export default EnvironmentSubSection;
