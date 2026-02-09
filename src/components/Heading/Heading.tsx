import { FC } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import { HeadingProps } from './Heading.types';

import styles from './Heading.module.scss';
import RedLine from '@icons/longevity/RedLine';

const Heading: FC<HeadingProps> = ({
  text,
  showRightIcon = true,
  showLeftIcon = true,
  textAlign = 'left',
  className,
  Tag = 'h1',
  hasUnderline,
  isDarkTheme,
  hasRedUnderline,
  locale,
  isBold,
  isBig,
}) => {
  return (
    <div
      className={cn(styles.headingAndUnderline, {
        [styles.darkTheme]: isDarkTheme,
        [styles.russianVersion]: locale === 'ru',
      })}
    >
      <div
        className={cn(styles.headingWrapper, className, {
          [styles.left]: textAlign === 'left',
          [styles.center]: textAlign === 'center',
          [styles.right]: textAlign === 'right',
        })}
      >
        {showLeftIcon && (
          <span
            className={cn(styles.diamond, {
              [styles.smallDiamond]: Tag === 'h4',
            })}
          />
        )}
        <Tag
          className={cn(styles.heading, {
            [styles.small]: Tag === 'h2' || Tag === 'h3',
            [styles.h4]: Tag === 'h4',
            [styles.h5]: Tag === 'h5',
            [styles.big]: isBig,
            [styles.bold]: isBold,
          })}
        >
          {text}
        </Tag>
        {showRightIcon && (
          <span
            className={cn(styles.diamond, {
              [styles.smallDiamond]: Tag === 'h4',
            })}
          />
        )}
      </div>
      {hasUnderline && (
        <Image
          src={'/keepsimple_/assets/articles-blog/line.svg'}
          alt={'line'}
          width={1000}
          height={2}
          className={styles.underline}
        />
      )}
      {hasRedUnderline && <RedLine className={styles.redUnderline} />}
    </div>
  );
};

export default Heading;
