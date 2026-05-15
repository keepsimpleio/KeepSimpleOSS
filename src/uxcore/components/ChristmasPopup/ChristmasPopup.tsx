import EmojiFall from '@uxcore/components/EmojiFall';
import Modal from '@uxcore/components/Modal';
import useMobile from '@uxcore/hooks/useMobile';
import { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import styles from './ChristmasPopup.module.scss';

interface ChristmasPopupProps {
  open: boolean;
}

const ChristmasPopup: FC<ChristmasPopupProps> = ({ open }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { isMobile } = useMobile()[1];

  const [close, setClose] = useState(false);
  const title =
    locale === 'ru'
      ? 'С Новым Годом и Рождеством!'
      : 'MERRY CHRISTMAS AND HAPPY NEW YEAR';

  const happyNewYearTxt =
    locale === 'ru'
      ? '🎄 С Новым Годом и Рождеством! 🎄'
      : '🎄 Merry Christmas and Happy New Year! 🎄';

  const descriptionEn = (
    <p>
      Over 200,000 visitors from 183 (!) countries have spent 140 DAYS with
      us🎉🎉🎉
    </p>
  );
  const descriptionRu = (
    <p>
      200,000 пользователей из 183 стран провели на нашем проекте 140 ДНЕЙ!
      🎉🎉🎉
    </p>
  );
  const description = locale === 'ru' ? descriptionRu : descriptionEn;
  const thankYouTxtEn = (
    <p className={styles.thankYouTxt}>
      We love you all. We&#39;ll build more epic stuff just for you!
    </p>
  );
  const thankYouTxtRu = (
    <p className={styles.thankYouTxt}>
      Мы любим вас. Мы продолжим релизить классные штуки.
    </p>
  );
  const thankYouTxt = locale === 'ru' ? thankYouTxtRu : thankYouTxtEn;
  const closePopUp = () => {
    Cookies.set('helpToHelpModal', 'seen', { expires: 14 });
    sessionStorage.setItem('seenHelpToHelp', String(true));
    setClose(!close);
  };

  useEffect(() => {
    const cookieEnabled = Cookies.get('helpToHelpModal') === 'seen';
    if (cookieEnabled) {
      setClose(!cookieEnabled);
    } else {
      const reopeningPopUp = sessionStorage.getItem('seenHelpToHelp');
      setClose(!reopeningPopUp);
    }
  }, []);

  return (
    open && (
      <Modal
        hasBorder
        title={title}
        blackTitle
        onClick={closePopUp}
        className={cn(styles.modalContainer, {
          [styles.disableModal]: !close,
        })}
        close={!close}
      >
        <div className={styles.mainContainer}>
          <Image
            alt={'Domeownation squad'}
            useMap="#catMap"
            src={'/assets/images/squad.png'}
            width={379}
            height={163}
            className={styles.catSquad}
          />
          <map name="catMap">
            <area
              shape="rect"
              coords={isMobile ? '0,0,106,138' : '0,0,126,163'}
              alt="Cat 1"
              href="https://www.instagram.com/mumuk_evn/"
              target="_blank"
            />
            <area
              shape="rect"
              coords={isMobile ? '107,0,213,138' : '127,0,252,163'}
              alt="Cat 2"
              href="https://www.linkedin.com/in/melkonyanvahan/"
              target="_blank"
            />
            <area
              shape="rect"
              coords={isMobile ? '214,0,320,138' : '253,0,379,163'}
              alt="Cat 3"
              href="https://www.instagram.com/_mary_wylde__/"
              target="_blank"
            />
          </map>
          <div className={styles.greenContainer}>{description}</div>
          {thankYouTxt}

          <span className={styles.happyNewYearTxt} onClick={closePopUp}>
            <EmojiFall className={styles.candies} />
            {happyNewYearTxt}
          </span>
        </div>
      </Modal>
    )
  );
};
export default ChristmasPopup;
