import cn from 'classnames';
import { FC } from 'react';

import styles from './Section.module.scss';

type TSection = {
  noStyles?: boolean;
  style?: any;
  children?: any;
};

const Section: FC<TSection> = ({ style = {}, noStyles, children }) => {
  return (
    <div className={cn({ [styles.Section]: !noStyles })} style={style}>
      {children}
    </div>
  );
};

export default Section;
