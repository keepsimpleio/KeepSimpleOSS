import cn from 'classnames';
import Image from 'next/image';
import { FC, useContext, useEffect, useState } from 'react';

import { sanitizeHtml } from '@lib/sanitizeHtml';

import { GlobalContext } from '@components/Context/GlobalContext';
import Heading from '@components/Heading';
import BasicStats from '@components/longevity/BasicStats';

import { MainInfoSectionProps } from './MainInfoSection.types';

import styles from './MainInfoSection.module.scss';

const MainInfoSection: FC<MainInfoSectionProps> = ({
  title,
  description,
  basicStats,
  locale,
  hasBasicStats = false,
  backgroundImageUrl,
  hasRedUnderline = false,
  japaneseText,
  basicStatsTitle,
  isIntroPage,
}) => {
  const { setHeroReady, overlayOn } = useContext(GlobalContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (imageLoaded && !overlayOn) {
      setIsVisible(true);
    }
  }, [imageLoaded, overlayOn]);

  return (
    <section
      className={cn(styles.mainInfoSection, {
        [styles.introPage]: isIntroPage,
        [styles.mainInfoSectionRu]: locale === 'ru',
        [styles.visible]: isVisible,
      })}
    >
      <Image
        src={
          backgroundImageUrl
            ? backgroundImageUrl
            : '/keepsimple_/assets/longevity/what-is-this-bg.png'
        }
        alt="Background"
        layout="fill"
        objectFit="cover"
        priority
        onLoadingComplete={() => {
          setImageLoaded(true);
          setHeroReady(true);
        }}
      />
      <div className={styles.wrapper}>
        <Heading
          isBold
          text={title}
          Tag="h2"
          hasRedUnderline={hasRedUnderline}
          showLeftIcon={false}
          showRightIcon={false}
          className={styles.heading}
        />
        <div
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
          className={styles.description}
        />
        {hasBasicStats ? (
          <BasicStats
            data={basicStats}
            title={basicStatsTitle}
            locale={locale}
          />
        ) : null}
      </div>
      {japaneseText && (
        <span className={styles.japaneseText} data-cy="japanese-text">
          {japaneseText}
        </span>
      )}
    </section>
  );
};
export default MainInfoSection;
