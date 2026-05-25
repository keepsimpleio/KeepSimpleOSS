import cn from 'classnames';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

import type { TRouter } from '@uxcore/local-types/global';

import styles from './UXCoreHelpToHelpModal.module.scss';

type UXCoreHelpToHelpModal = {
  open: boolean;
};
const UXCoreHelpToHelpModal: FC<UXCoreHelpToHelpModal> = ({ open }) => {
  const [close, setClose] = useState(false);
  const router = useRouter();
  const { locale } = router as TRouter;

  const popupData =
    locale === 'en'
      ? {
          title: 'Help me to help others',
          underlinedText: 'Ask me anything',
          text1:
            ' on X (ex-Twitter), and I’ll generate a structured thread with an answer and explanation.',
          text2:
            'Your profit: you get your answer. My profit: I generate value for the public, on a topic that people are interested in ❤️',
          url: 'https://twitter.com/AlexanyanWolf',
          viewProfile: 'View Profile',
        }
      : {
          title: 'Помогите сообществу',
          underlinedText: 'Задайте мне любой вопрос',
          text1: ' в X (Твиттере) и я дам детальный ответ в одном из постов.',
          text2:
            'Ваша польза: продуманный ответ. Моя польза: Я генерирую ценность для общества, отвечая на вопросы интересующие пользователей ❤️',
          url: 'https://twitter.com/AlexanyanWolf',
          viewProfile: 'Профиль',
        };

  const closePopUp = () => {
    Cookies.set('helpToHelpModal', 'seen', { expires: 14 });
    sessionStorage.setItem('seenHelpToHelp', String(true));
    setClose(!close);
  };
  const handleLinkClick = (label: string) => {
    ReactGA.event({
      category: 'User',
      action: 'Clicked Link in Popup',
      label: label,
    });
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
      <div
        className={cn(styles.overlay, [
          close ? styles.overlay : styles.overlayDisabled,
        ])}
      >
        <div className={styles.shadow} onClick={closePopUp}></div>
        <div className={styles.wrapper}>
          <div className={styles.textAndClosebtn}>
            <h4> {popupData.title}</h4>
            <div className={styles.closeBtn} onClick={closePopUp}>
              <Image
                width={16}
                height={16}
                alt="closing icon"
                src="/assets/biases/cross.svg"
              />
            </div>
          </div>
          <hr className={styles.separator} />
          <div className={styles.content}>
            <div className={styles.imageAndButton}>
              <Image
                src="/assets/images/helpToHelp/cat.svg"
                alt="Cats help"
                width={105}
                height={113}
              />
            </div>
            <span className={styles.text1}>
              <a
                className={styles.askMeAnythingText}
                href={popupData.url}
                target={'_blank'}
                onClick={() => handleLinkClick('Ask me anything')}
              >
                {popupData.underlinedText}
              </a>
              {popupData.text1}
            </span>
            <p className={styles.text2}>{popupData.text2}</p>
            <div className={styles.linkFields}>
              <div className={styles.outlinedArea}>{popupData.url}</div>
              <a
                target={'_blank'}
                href={popupData.url}
                className={styles.viewProfile}
                onClick={() => handleLinkClick('View Profile')}
              >
                {popupData.viewProfile}
              </a>
            </div>
            <a
              href={popupData.url}
              target="_blank"
              title="Twitter"
              className={styles.link}
              onClick={() => handleLinkClick('Twitter')}
            >
              <img
                src="/assets/biases/twitterXBlack.svg"
                alt="tweeter-button"
                className={styles.twitterImg}
              />
            </a>
          </div>
        </div>
      </div>
    )
  );
};
export default UXCoreHelpToHelpModal;
