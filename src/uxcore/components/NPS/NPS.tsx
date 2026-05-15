import Button from '@uxcore/components/Button';
import useMobile from '@uxcore/hooks/useMobile';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import styles from './NPS.module.scss';

type NPSProps = {
  pleaseRateTxt: string;
  pleaseRateFirstWord: string;
  sendScore: (score: number) => void;
  setIsVisible: (isVisible: boolean) => void;
  isVisible: boolean;
};
const NPS: FC<NPSProps> = ({
  pleaseRateTxt,
  sendScore,
  setIsVisible,
  isVisible,
  pleaseRateFirstWord,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [closing, setClosing] = useState(false);
  const { isMobile } = useMobile()[1];

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  const handleCloseAndSend = score => {
    setClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sendScore(score);
    }, 1000);
  };

  useEffect(() => {
    if (isMobile) {
      // @ts-ignore
      const isChrome = !!window.chrome;
      const overflowDefaultValue = isChrome ? 'overlay' : 'auto';

      if (isVisible) {
        document.documentElement.style.overflowY = 'hidden';
        document.body.classList.add('hide-body-move');
      } else {
        document.documentElement.style.overflowY = overflowDefaultValue;
        document.body.classList.remove('hide-body-move');
      }

      return () => {
        document.documentElement.style.overflowY = overflowDefaultValue;
        document.body.classList.remove('hide-body-move');
      };
    }
  }, [isVisible, isMobile]);

  return (
    <>
      <div className={styles.mobileOverlay}></div>
      <div
        className={cn(styles.nps, {
          [styles.visible]: isVisible,
          [styles.closing]: closing,
        })}
      >
        <div className={styles.closeBtn} onClick={() => handleClose()}>
          <Image
            src={'/assets/biases/cross.svg'}
            alt="modal close button"
            width={16}
            height={16}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.evasImgMobile}>
            <Image
              src={'/assets/uxcat/Eva.svg'}
              alt="Eva"
              width={85}
              height={94}
            />
          </div>
          <div>
            <label className={styles.title}>
              <span className={styles.firstWord}>{pleaseRateFirstWord}</span>{' '}
              {pleaseRateTxt}
            </label>
            <div className={styles.scoreWrapper}>
              {Array.from({ length: 10 }, (_, index) => (
                <label
                  key={index + 1}
                  className={cn(styles.score, {
                    [styles.filled]:
                      !isMobile &&
                      hoveredIndex !== null &&
                      index <= hoveredIndex,
                    [styles.selected]:
                      !isMobile &&
                      selectedNumber !== null &&
                      index < selectedNumber,
                    [styles.mobileSelected]:
                      isMobile && selectedNumber === index + 1,
                  })}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() =>
                    !isMobile
                      ? handleCloseAndSend(index + 1)
                      : setSelectedNumber(index + 1)
                  }
                >
                  {index + 1}
                </label>
              ))}
            </div>
            <div className={styles.btnWrapper}>
              <Button
                label={locale === 'en' ? 'Submit' : 'Отправить'}
                type={'orange'}
                disabled={selectedNumber === null}
                onClick={() => handleCloseAndSend(selectedNumber)}
              />
            </div>
          </div>
        </div>
        <div className={styles.evasImg}>
          <Image
            src={'/assets/uxcat/Eva.svg'}
            alt="Eva, the cat"
            width={85}
            height={94}
          />
        </div>
      </div>
    </>
  );
};

export default NPS;
