import { FC } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import Button from '@components/Button';

import cookieData from '@data/cookies';

import { TRouter } from '@local-types/global';

import styles from './Box.module.scss';

interface CookiesBoxProps {
  setIsSeen?: () => void;
}

const Box: FC<CookiesBoxProps> = ({ setIsSeen }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { title, description, ok } = cookieData[locale];

  return (
    <div>
      <div
        className={cn(styles.content, {
          [styles.hyLang]: locale === 'hy',
        })}
      >
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
        <p className={styles.txt}>{description}</p>
        <div className={styles.btnWrapper}>
          <Button label={ok} onClick={setIsSeen} variant={'primary'} />
        </div>
      </div>
    </div>
  );
};

export default Box;
