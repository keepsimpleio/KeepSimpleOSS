import cn from 'classnames';
import { FC } from 'react';

import styles from './UXCatPageTitle.module.scss';

type UXCatPageTitleProps = {
  title: string;
  bigFont?: boolean;
  className?: string;
};

const UXCatPageTitle: FC<UXCatPageTitleProps> = ({
  title,
  bigFont,
  className,
}) => {
  return (
    <h3
      className={cn(styles.pageTitle, className, {
        [styles.bigFont]: bigFont,
      })}
    >
      {title}
    </h3>
  );
};
export default UXCatPageTitle;
