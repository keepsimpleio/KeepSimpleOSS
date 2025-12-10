import {
  type FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/router';
import cn from 'classnames';

import useMobile from '@hooks/useMobile';

import containerData from '@data/companyManagement';

import { TRouter } from '@local-types/global';

import useImageModule from '@hooks/useImageModule';

import ZoomBlock from '@components/ZoomBlock';

import styles from './PyramidInfoSection.module.scss';

interface PyramidInfoSectionProps {
  type?: 'default' | 'main' | 'modal';
  onClose?: () => void;
  selectedPyramid?: any;
  color?: string;
  statisticsInfo?: any;
  onlyPyramidInfo?: boolean;
  currentIcon?: string;
  contentChanged?: boolean;
  setContentChanged?: (changed: boolean) => void;
  defaultSelectedItem?: any;
}

const Portal = ({ children }) => {
  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';

    return () => {
      document.documentElement.style.overflowY = 'auto';
    };
  }, []);

  return createPortal(
    <div className={styles.modal}>{children}</div>,
    document.body,
  );
};

const PyramidInfoSection: FC<PyramidInfoSectionProps> = ({
  selectedPyramid,
  type = 'default',
  color,
  onClose = () => {},
  statisticsInfo,
  onlyPyramidInfo = false,
  currentIcon,
  contentChanged,
  setContentChanged,
}) => {
  const { isMobile } = useMobile()[1];
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const { durationTxt, costTxt } = containerData[currentLocale];
  const Wrapper = useMemo(() => (type === 'modal' ? Portal : Fragment), [type]);

  const iconUrl = `${process.env.NEXT_PUBLIC_STRAPI}${selectedPyramid?.attributes?.icon.data.attributes.url}`;
  const icon = onlyPyramidInfo ? iconUrl : currentIcon ? currentIcon : iconUrl;

  const replaceTitle = (title: string): string => {
    if (title === 'Доступ на основе ролей (RBAC)') {
      return 'Управление доступом на основе ролей (RBAC)';
    }
    return title;
  };

  const pyramidElementTitle = replaceTitle(statisticsInfo?.title);

  const title = onlyPyramidInfo
    ? selectedPyramid.attributes.title
    : pyramidElementTitle || selectedPyramid.attributes.title;

  const firstInfo = onlyPyramidInfo
    ? `${durationTxt}: ${selectedPyramid.attributes.setupDuration}`
    : statisticsInfo
      ? statisticsInfo.tooltip[0]?.content
      : `${durationTxt}: ${selectedPyramid.attributes.setupDuration}`;

  const secondInfo = onlyPyramidInfo
    ? `${costTxt}: ${selectedPyramid.attributes.setupCost}`
    : statisticsInfo
      ? statisticsInfo.tooltip[1]?.content
      : `${costTxt}: ${selectedPyramid.attributes.setupCost}`;

  const firstTooltipIcon = onlyPyramidInfo
    ? undefined
    : statisticsInfo?.tooltip[0]?.icon;

  const secondTooltipIcon = onlyPyramidInfo
    ? undefined
    : statisticsInfo?.tooltip[1]?.icon;

  const description = statisticsInfo
    ? statisticsInfo.description
    : selectedPyramid.attributes.description;

  const contentRef = useRef(null);
  const wrapperRef = useRef(null);
  const [{ setZoomedImage }] = useImageModule();

  const handleZoom = useCallback(
    src => {
      setZoomedImage(src);
    },
    [setZoomedImage, statisticsInfo, selectedPyramid.attributes],
  );

  useEffect(() => {
    const images = contentRef.current.querySelectorAll('img');
    images.forEach(img =>
      img.addEventListener('click', () => handleZoom(img.src)),
    );

    return () =>
      images.forEach(img =>
        img.removeEventListener('click', () => handleZoom(img.src)),
      );
  }, [handleZoom]);

  useEffect(() => {
    if (contentChanged) {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTo(0, 0);
      }
      setContentChanged(false);
    }
  }, [contentChanged]);

  return (
    <Wrapper>
      <div
        className={cn(styles.info, styles[type], {
          [styles.mobile]: isMobile,
          [styles[color]]: color,
          [styles.ruVersion]: locale === 'ru',
        })}
      >
        <div className={styles.container}>
          <div className={styles.center}>
            <div className={styles.wrapper} ref={wrapperRef}>
              {type === 'modal' && (
                <div className={styles.closeButton}>
                  <Image
                    src="/keepsimple_/assets/company-management/modal-close-icon.png"
                    width={30}
                    height={30}
                    onClick={onClose}
                    alt={'Close icon'}
                  />
                </div>
              )}
              <div className={styles.head}>
                <div className={styles.mobileHeader}>
                  <div className={styles.imgWrapper}>
                    <img src={icon} width={45} height={39} alt={title} />
                  </div>
                  <h2 className={styles.title}>{title}</h2>
                </div>
                <div className={styles.imgWrapper}>
                  <Image src={icon} width={45} height={39} alt={title} />
                </div>
                <div>
                  <h2 className={styles.title}>{title}</h2>
                  <span className={styles.duration}>
                    {firstInfo}
                    {firstTooltipIcon && (
                      <span
                        className={cn(styles.arrow, {
                          [styles.up]: firstTooltipIcon === 'up',
                          [styles.down]: firstTooltipIcon === 'down',
                        })}
                      ></span>
                    )}
                  </span>
                  <span className={styles.cost}>
                    {secondInfo}
                    {secondTooltipIcon && (
                      <span
                        className={cn(styles.arrow, {
                          [styles.up]: secondTooltipIcon === 'up',
                          [styles.down]: secondTooltipIcon === 'down',
                        })}
                      ></span>
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.content}>
                <div
                  ref={contentRef}
                  dangerouslySetInnerHTML={{
                    __html: onlyPyramidInfo
                      ? selectedPyramid.attributes.description
                      : description,
                  }}
                />
                <p className={styles.psNote}>
                  {selectedPyramid.attributes.includePs &&
                    `*${selectedPyramid.attributes.psNote}`}
                </p>
                <ZoomBlock className={styles.zoomedImg} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default PyramidInfoSection;
