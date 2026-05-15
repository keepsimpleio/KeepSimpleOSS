import Checkmark from '@uxcore/assets/icons/Checkmark';
import CopyIcon from '@uxcore/assets/icons/CopyIcon';
import sharePopupData from '@uxcore/data/sharePopupData';
import { copyToClipboard, generateSocialLinks } from '@uxcore/lib/helpers';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import styles from './UXCorePleaseShareModal.module.scss';

type UXCorePleaseShareModal = {
  open: boolean;
};
const UXCorePleaseShareModal: FC<UXCorePleaseShareModal> = ({ open }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [close, setClose] = useState(false);
  const router = useRouter();
  const { locale } = router as TRouter;
  const tooltipTimer: { current: any } = useRef();
  const { title, text, url, copyUrl, copySuccessTxt, shareTo } =
    sharePopupData[locale];
  const { linkedIn, facebook, tweeter } = generateSocialLinks(url, '');

  const closePopUp = () => {
    Cookies.set('pleaseShareModal', 'seen', { expires: 14 });
    sessionStorage.setItem('seenPleaseShare', String(true));
    setClose(!close);
  };

  const handleCopyLink = useCallback(() => {
    if (!copySuccess) {
      copyToClipboard(url);
      setCopySuccess(true);
      clearTimeout(tooltipTimer.current);
    }

    tooltipTimer.current = setTimeout(() => {
      setCopySuccess(false);
    }, 1500);
  }, [copyToClipboard, copySuccess]);

  useEffect(() => {
    const cookieEnabled = Cookies.get('pleaseShareModal') === 'seen';
    if (cookieEnabled) {
      setClose(!cookieEnabled);
    } else {
      const reopeningPopUp = sessionStorage.getItem('seenPleaseShare');
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
            <h4 className={styles.title}> {title}</h4>
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
                src="/assets/images/feedback/cat.svg"
                alt="Cat's domeownation"
                width={105}
                height={113}
              />
              <p className={styles.text}>{text}</p>
            </div>
            <div className={styles.linkFields}>
              <div className={styles.outlinedArea}>{url}</div>
              <button
                onClick={handleCopyLink}
                className={cn(styles.copyBtn, [
                  styles[locale === 'en' ? 'shortTxt' : 'longTxt'],
                ])}
              >
                {copySuccess ? (
                  <Checkmark width={14} height={14} />
                ) : (
                  <CopyIcon width={14} height={14} />
                )}
                <span className={styles.copyTxt}>
                  {copySuccess ? copySuccessTxt : copyUrl}
                </span>
              </button>
            </div>
            <div className={styles.shareToText}>{shareTo}</div>
            <div className={styles.btnWrapper}>
              <a
                href={linkedIn}
                target="_blank"
                title="LinkedIn"
                className={styles.shareLink}
              >
                <img
                  src="/assets/biases/linkedin2.svg"
                  alt="linked-in-share-button"
                  className={styles.shareImg}
                />
              </a>
              <a
                href={tweeter}
                target="_blank"
                title="Twitter"
                className={styles.shareLink}
              >
                <img
                  src="/assets/biases/twitterXBlack.svg"
                  alt="tweeter-share-button"
                  className={styles.shareImg}
                />
              </a>
              <a
                href={facebook}
                target="_blank"
                title="Facebook"
                className={styles.shareLink}
              >
                <img
                  src="/assets/biases/facebook2.svg"
                  alt="facebook-share-button"
                  className={styles.shareImg}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default UXCorePleaseShareModal;
