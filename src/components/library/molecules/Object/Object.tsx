import React from 'react';
import classNames from 'classnames';

import { ObjectType, type ObjectProps } from './Object.types';

import { Icon, IconName } from '@/components/atoms/Icon';
import { Text, TypographyVariant } from '@/components/atoms/Text';

import styles from './Object.module.scss';

export const Object: React.FC<ObjectProps> = ({ type, number, className, noBorder = false }) => {
  const getLabel = () => {
    if (type === ObjectType.Audio) return 'Audio';
    if (type === ObjectType.Book) return 'Books';
    if (type === ObjectType.Video) return 'Videos';
    return type;
  };

  return (
    <div className={classNames(className, styles.object, { [styles.border]: !noBorder })}>
      <div className={styles.icon}>
        <Icon
          width={noBorder ? 13 : 18}
          height={noBorder ? 13 : 18}
          name={type.toLowerCase() as IconName}
        />
      </div>
      <div className={styles.count}>
        <Text variant={TypographyVariant.TextRegular}>{number}</Text>
        {noBorder && <Text variant={TypographyVariant.TextRegular}>{getLabel()}</Text>}
      </div>
    </div>
  );
};
