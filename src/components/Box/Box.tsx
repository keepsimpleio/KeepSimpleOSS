import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { TRouter } from '@local-types/global';

import cookieData from '@data/cookies';

import styles from './Box.module.scss';

interface CookiesBoxProps {
  setIsSeen?: () => void;
}

const Box: FC<CookiesBoxProps> = ({ setIsSeen }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { title, description, ok } = cookieData[locale];

  return (
    <div
      data-cy="cookie-box"
      className={cn(styles.content, {
        [styles.hyLang]: locale === 'hy',
        [styles.ruLang]: locale === 'ru',
      })}
    >
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <span className={styles.title}>{title}</span>
          <button
            type="button"
            aria-label="Close"
            onClick={setIsSeen}
            className={styles.closeBtn}
            data-cy="cookie-box-close"
          >
            <Image
              src="/keepsimple_/assets/cookies/close.svg"
              alt=""
              width={26}
              height={26}
              className={styles.closeIcon}
            />
          </button>
        </div>
        <span className={styles.divider} aria-hidden />
      </div>
      <p className={styles.txt}>{description}</p>
      <div className={styles.btnWrapper}>
        <button
          type="button"
          data-cy="cookie-box-accept"
          onClick={setIsSeen}
          className={styles.acceptBtn}
        >
          {ok}
        </button>
      </div>
    </div>
  );
};

export default Box;
