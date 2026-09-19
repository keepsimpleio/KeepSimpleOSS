import classNames from 'classnames';
import React from 'react';

import { Icon, IconName } from '@components/library/atoms/Icon';
import { Text, TypographyVariant } from '@components/library/atoms/Text';

import { type ObjectProps, ObjectType } from './Object.types';

import styles from './Object.module.scss';

export const Object: React.FC<ObjectProps> = ({
  type,
  number,
  className,
  noBorder = false,
}) => {
  const getLabel = () => {
    if (type === ObjectType.Audio) return 'Audio';
    if (type === ObjectType.Book) return 'Books';
    if (type === ObjectType.Video) return 'Videos';
    return type;
  };

  return (
    <div
      className={classNames(className, styles.object, {
        [styles.border]: !noBorder,
      })}
    >
      <div className={styles.icon}>
        <Icon
          width={noBorder ? 24 : 18}
          height={noBorder ? 24 : 18}
          name={type.toLowerCase() as IconName}
        />
      </div>
      <div className={styles.count}>
        <Text variant={TypographyVariant.TextRegular}>{number}</Text>
        {noBorder && (
          <Text variant={TypographyVariant.TextRegular}>{getLabel()}</Text>
        )}
      </div>
    </div>
  );
};
