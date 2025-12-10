import React, { FC } from 'react';
import cn from 'classnames';

import type { ContributorsLabelProps } from './ContributorsLabel.types';

import styles from './ContributorsLabel.module.scss';

const ContributorsLabel: FC<ContributorsLabelProps> = ({
  isDarkTheme,
  text,
}) => {
  return (
    <div className={styles.labelWrapper}>
      <span
        className={cn(styles.label, {
          [styles.labelDark]: isDarkTheme,
        })}
      >
        {text}
      </span>
    </div>
  );
};
export default ContributorsLabel;
