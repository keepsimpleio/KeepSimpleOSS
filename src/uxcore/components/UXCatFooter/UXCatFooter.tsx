import { useRouter } from 'next/router';
import { FC } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import TelegramIcon from '@uxcore/assets/icons/TelegramIcon';

import styles from './UXCatFooter.module.scss';

const UXCatFooter: FC = () => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const contactUs =
    locale === 'ru' ? 'Обратная связь' : 'For feedback/suggestions';

  return (
    <div className={styles.footerContainer}>
      <span className={styles.contactUsTxt}> {contactUs}</span>
      <div className={styles.contactInfo}>
        {/*Temporary disabled*/}
        {/*<div className={styles.mailInfo}>*/}
        {/*  <MailIcon />*/}
        {/*  <a href={"mailto:alexanyanwolf@gmail.com"} className={styles.mail}>*/}
        {/*    alexanyanwolf@gmail.com*/}
        {/*  </a>*/}
        {/*</div>*/}
        <a
          href="https://t.me/productmanager"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.telegram}
        >
          <TelegramIcon />
          @productmanager
        </a>
      </div>
      <span className={styles.motto}>Be Kind. Do Good.</span>
    </div>
  );
};
export default UXCatFooter;
