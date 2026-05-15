import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import { PanelHeaderProps } from './PanelHeader.types';

import styles from './PanelHeader.module.scss';

const PanelHeader: FC<PanelHeaderProps> = ({ text, icon, className }) => {
  return (
    <div className={cn(styles.panelHeader, className)}>
      <Image
        src={icon}
        alt={text}
        width={24}
        height={24}
        className={styles.img}
        unoptimized
      />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default PanelHeader;
