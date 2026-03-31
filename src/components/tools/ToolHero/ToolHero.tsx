import cn from 'classnames';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import Heading from '@components/Heading';

import { ToolHeroProps } from './ToolHero.types';

import styles from './ToolHero.module.scss';

const ToolHero: FC<ToolHeroProps> = ({
  backgroundImage,
  darkBackgroundImage,
  logoImage,
  darkLogoImage,
  subtitle,
  subtitleColor,
  isDarkTheme,
  transitionKey = 0,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (transitionKey === 0) {
      return;
    }

    setIsTransitioning(true);
    const timeout = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 950);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [transitionKey, backgroundImage, logoImage]);

  return (
    <section
      className={cn(styles.hero, {
        [styles.isDarkTheme]: isDarkTheme,
        [styles.isTransitioning]: isTransitioning,
      })}
    >
      <div
        className={cn(
          styles.backgroundLayer,
          styles.lightBackground,
          isTransitioning && styles.lightBackgroundAnimated,
        )}
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div
        className={cn(styles.backgroundLayer, styles.darkBackground)}
        style={{ backgroundImage: `url('${darkBackgroundImage}')` }}
      />
      <div className={styles.content}>
        <div className={styles.logoRow}>
          <span className={styles.diamond} />
          <div className={styles.logoBox}>
            <div
              key={`light-logo-layer-${transitionKey}-${logoImage}`}
              className={cn(
                styles.logoLayer,
                styles.lightLogo,
                styles.lightLogoReveal,
              )}
            >
              <Image
                src={logoImage}
                alt={'tools logo'}
                fill
                sizes="(max-width: 956px) 304px, 662px"
                priority
              />
            </div>
            <div
              key={`dark-logo-layer-${transitionKey}-${darkLogoImage}`}
              className={cn(
                styles.logoLayer,
                styles.darkLogo,
                styles.darkLogoReveal,
              )}
            >
              <Image
                src={darkLogoImage}
                alt={'tools logo dark'}
                fill
                sizes="(max-width: 956px) 304px, 662px"
                priority
              />
            </div>
          </div>
          <span className={styles.diamond} />
        </div>
        <div className={styles.subtitle}>
          <Heading
            text={subtitle}
            Tag="h2"
            textAlign="center"
            showLeftIcon={false}
            showRightIcon={false}
            isDarkTheme={isDarkTheme}
            textColor={subtitleColor}
          />
        </div>
      </div>
    </section>
  );
};

export default ToolHero;
