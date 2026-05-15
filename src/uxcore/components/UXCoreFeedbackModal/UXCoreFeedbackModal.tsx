import feedbackData from '@uxcore/data/feedbackData';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';

import styles from './UXCoreFeedbackModal.module.scss';

type UXCoreFeedbackModal = {
  open: boolean;
};
const UXCoreFeedbackModal: FC<UXCoreFeedbackModal> = ({ open }) => {
  const [feedback, setFeedback] = useState('');
  const [close, setClose] = useState(false);
  const [submit, setSubmit] = useState(false);
  const router = useRouter();
  const { locale } = router as TRouter;
  const {
    mainTitle,
    title,
    placeholderText,
    thankYouText,
    submitTxt,
    closeTxt,
    cancel,
  } = feedbackData[locale];

  const closePopUp = () => {
    Cookies.set('feedbackModal', 'seen', { expires: 14 });
    sessionStorage.setItem('seenFeedback', String(true));
    setClose(!close);
  };

  //TODO - move to the api page
  const feedBackRequest = async (data: { Text: string }) => {
    const body = JSON.stringify({
      data,
    });

    const feedbackLink = `${process.env.NEXT_PUBLIC_STRAPI}/api/feed-backs`;
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(feedbackLink, {
      method: 'POST',
      headers,
      body,
    }).then(data => data.json());
  };

  const handleSubmit = useCallback(async () => {
    try {
      await feedBackRequest({ Text: feedback });
      setSubmit(true);
    } catch (err) {
      console.log('error');
    }
  }, [feedBackRequest]);

  useEffect(() => {
    const cookieEnabled = Cookies.get('feedbackModal') === 'seen';
    if (cookieEnabled) {
      setClose(!cookieEnabled);
    } else {
      const reopeningPopUp = sessionStorage.getItem('seenFeedback');
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
            <h4 className={styles.mainTitle}> {mainTitle}</h4>
            <div className={styles.closeBtn} onClick={closePopUp}>
              <Image
                src={'/assets/biases/cross.svg'}
                width={16}
                height={16}
                alt={'closing icon'}
              />
            </div>
          </div>
          <hr className={styles.separator} />
          {!submit ? (
            <div>
              <div className={styles.feedbackBody}>
                <span className={styles.title}>
                  <b>{title} </b>
                  {locale === 'en' && 'UX Core.'}
                </span>
                <textarea
                  placeholder={placeholderText}
                  className={styles.textarea}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                ></textarea>
              </div>
              <div className={styles.imageAndButton}>
                <div className={styles.textAndImage}>
                  <Image
                    src={'/assets/images/feedback/cat.svg'}
                    alt="Cat's domeownation"
                    width={82}
                    height={89}
                  />
                  <p className={styles.text}></p>
                </div>
                <div className={styles.btnWrapper}>
                  <button className={styles.buttonDismiss} onClick={closePopUp}>
                    {cancel}
                  </button>
                  <button
                    className={styles.buttonSubmit}
                    onClick={handleSubmit}
                  >
                    {submitTxt}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.thankYouWrapper}>
              <div>
                <span className={styles.thankYouTitle}>{thankYouText}</span>
              </div>

              <div className={styles.buttonCloseWrapper}>
                <button className={styles.buttonClose} onClick={closePopUp}>
                  {closeTxt}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};
export default UXCoreFeedbackModal;
