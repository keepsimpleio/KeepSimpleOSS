import { FC } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import { HeadingProps } from './Heading.types';

import styles from './Heading.module.scss';

const Heading: FC<HeadingProps> = ({
  text,
  showRightIcon = true,
  showLeftIcon = true,
  textAlign = 'left',
  className,
  Tag = 'h1',
  hasUnderline,
  isDarkTheme,
  locale,
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
            [styles.big]: isBig,
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
    </div>
  );
};

export default Heading;
