import { FC } from 'react';
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
}) => {
  return (
    <section
      className={styles.mainInfoSection}
      style={{
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : `url('/keepsimple_/assets/longevity/what-is-this-bg.png')`,
      }}
    >
      <div>
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
          <BasicStats data={basicStats} locale={locale} />
        ) : null}
      </div>
      {japaneseText && (
        <span className={styles.japaneseText}>{japaneseText}</span>
      )}
    </section>
  );
};
export default MainInfoSection;
