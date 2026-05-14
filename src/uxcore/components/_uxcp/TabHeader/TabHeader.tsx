import cn from 'classnames';
import { FC } from 'react';

import CalloutIcon from '@icons/CalloutIcon';

import styles from './TabHeader.module.scss';

type TabHeaderTypes = {
  title: string;
  description: string;
  icon?: JSX.Element;
  style?: 'pink' | 'blue';
  url?: string;
};
const TabHeader: FC<TabHeaderTypes> = ({
  description,
  style,
  url,
  title,
  icon,
}) => {
  return (
    <a
      href={url}
      target={'_blank'}
      className={cn(styles.TabHeader, styles[style])}
    >
      <div className={styles.icons}>
        <div className={styles.iconWrapper}>
          <CalloutIcon />
          <span className={styles.insideIcon}>{icon}</span>
        </div>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{title}</span>
      </div>
    </a>
  );
};
export default TabHeader;
