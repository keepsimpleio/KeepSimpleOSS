import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { TRouter } from '@local-types/global';

import cookieData from '@data/cookies';

import Button from '@components/Button';

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
        data-cy="cookie-box"
        className={cn(styles.content, {
          [styles.hyLang]: locale === 'hy',
        })}
      >
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
        <p className={styles.txt}>{description}</p>
        <div className={styles.btnWrapper}>
          <Button
            label={ok}
            onClick={setIsSeen}
            variant={'primary'}
            dataCy="cookie-box-accept"
          />
        </div>
      </div>
    </div>
  );
};

export default Box;
