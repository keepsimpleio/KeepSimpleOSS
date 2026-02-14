import { FC, useContext } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import Heading from '@components/Heading';
import BasicStats from '@components/longevity/BasicStats';
import { GlobalContext } from '@components/Context/GlobalContext';

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
  const { setHeroReady } = useContext(GlobalContext);

  return (
    <section
      className={cn(styles.mainInfoSection, {
        [styles.introPage]: isIntroPage,
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
        onLoadingComplete={() => setHeroReady(true)}
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
          dangerouslySetInnerHTML={{ __html: description }}
          className={styles.description}
        />
        {hasBasicStats ? (
          <BasicStats data={basicStats} title={basicStatsTitle} />
        ) : null}
      </div>
      {japaneseText && (
        <span className={styles.japaneseText}>{japaneseText}</span>
      )}
    </section>
  );
};
export default MainInfoSection;
