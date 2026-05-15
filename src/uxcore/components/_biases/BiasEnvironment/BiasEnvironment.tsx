import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { BiasEnvironmentProps } from './BiasEnvironment.types';

import styles from './BiasEnvironment.module.scss';

const BiasEnvironment: FC<BiasEnvironmentProps> = ({
  title,
  link,
  names,
  linkTitle,
  locale,
}) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}> {title}</span>
      {names.map((name, index) => (
        <div key={index} className={styles.nameRow}>
          <span className={cn(styles.arrow, styles[name.color])}></span>
          <span
            className={cn(styles.nameText, {
              [styles.textHy]: locale === 'hy',
            })}
          >
            {name.title}
          </span>
        </div>
      ))}
      <hr className={styles.hr} />
      <div className={styles.linkWrapper}>
        <span className={styles.square}>
          <Image
            src={'/assets/biases/light-bulb.svg'}
            alt={linkTitle}
            width={12}
            height={14}
          />
        </span>
        <Link
          href={link}
          className={cn(styles.linkText, {
            [styles.textHy]: locale === 'hy',
          })}
          target={'_blank'}
        >
          {linkTitle}
        </Link>
      </div>
    </div>
  );
};

export default BiasEnvironment;
