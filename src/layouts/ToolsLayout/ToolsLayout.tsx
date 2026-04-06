import cn from 'classnames';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { useEffectiveDarkTheme } from '@hooks/useEffectiveDarkTheme';
import useGlobals from '@hooks/useGlobals';

import ToolContainer from '@components/tools/ToolContainer';
import ToolHero from '@components/tools/ToolHero';

import { ToolsLayoutProps } from './ToolsLayout.types';

import styles from './ToolsLayout.module.scss';

const FIBONACCI_CODE = '1 1 2 3 5 8 13';
const FIBONACCI_CODE_NORMALIZED = FIBONACCI_CODE.replace(/\s+/g, '');
const EASTER_SUBSEQUENT_CODE_NORMALIZED = '21';

const ToolsLayout: FC<ToolsLayoutProps> = ({
  children,
  subtitle = 'on the sidelines',
  backgroundImage = '/keepsimple_/assets/tools/hero/default.png',
  darkBackgroundImage = '/keepsimple_/assets/tools/hero/default-dark.png',
  logoImage = '/keepsimple_/assets/tools/logo/default.svg',
  darkLogoImage = '/keepsimple_/assets/tools/logo/default-dark.svg',
  isDarkTheme,
}) => {
  const { isDarkTheme: globalDarkTheme } = useGlobals()[1];
  const effectiveDarkTheme = useEffectiveDarkTheme(
    isDarkTheme ?? globalDarkTheme,
  );
  const [easterThemeIndex, setEasterThemeIndex] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);
  const typedBufferRef = useRef('');
  const easterThemeIndexRef = useRef(0);
  const easterActivatedRef = useRef(false);

  useEffect(() => {
    easterThemeIndexRef.current = easterThemeIndex;
  }, [easterThemeIndex]);

  useEffect(() => {
    const easterImages = [
      '/keepsimple_/assets/tools/hero/green.png',
      '/keepsimple_/assets/tools/logo/green.svg',
      '/keepsimple_/assets/tools/hero/white.png',
      '/keepsimple_/assets/tools/logo/white.svg',
      '/keepsimple_/assets/tools/hero/black.png',
      '/keepsimple_/assets/tools/logo/black.svg',
    ];

    easterImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const handleSequence = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (isEditable) {
        return;
      }

      const key = event.key === 'Spacebar' ? ' ' : event.key;
      const isDigit = /^[0-9]$/.test(key);
      const isSpace = key === ' ';

      if (!isDigit && !isSpace) {
        return;
      }

      const nextBuffer = `${typedBufferRef.current}${key}`.slice(-64);

      typedBufferRef.current = nextBuffer;

      const normalizedBuffer = nextBuffer.replace(/\s+/g, '');
      const idx = easterThemeIndexRef.current;

      if (
        !easterActivatedRef.current &&
        normalizedBuffer.endsWith(FIBONACCI_CODE_NORMALIZED)
      ) {
        typedBufferRef.current = '';
        easterActivatedRef.current = true;
        easterThemeIndexRef.current = 1;
        setEasterThemeIndex(1);
        setTransitionKey(prev => prev + 1);
        return;
      }

      if (
        easterActivatedRef.current &&
        normalizedBuffer.endsWith(EASTER_SUBSEQUENT_CODE_NORMALIZED)
      ) {
        typedBufferRef.current = '';
        const next = (idx + 1) % 4;
        easterThemeIndexRef.current = next;
        setEasterThemeIndex(next);
        setTransitionKey(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleSequence);

    return () => {
      window.removeEventListener('keydown', handleSequence);
    };
  }, []);

  const visualAssets = useMemo(() => {
    const easterAssets = [
      {
        background: backgroundImage,
        logo: logoImage,
        darkBackground: darkBackgroundImage,
        darkLogo: darkLogoImage,
      },
      {
        background: '/keepsimple_/assets/tools/hero/green.png',
        logo: '/keepsimple_/assets/tools/logo/green.svg',
        darkBackground: '/keepsimple_/assets/tools/hero/green.png',
        darkLogo: '/keepsimple_/assets/tools/logo/green.svg',
      },
      {
        background: '/keepsimple_/assets/tools/hero/white.png',
        logo: '/keepsimple_/assets/tools/logo/white.svg',
        darkBackground: '/keepsimple_/assets/tools/hero/white.png',
        darkLogo: '/keepsimple_/assets/tools/logo/white.svg',
      },
      {
        background: '/keepsimple_/assets/tools/hero/black.png',
        logo: '/keepsimple_/assets/tools/logo/black.svg',
        darkBackground: '/keepsimple_/assets/tools/hero/black.png',
        darkLogo: '/keepsimple_/assets/tools/logo/black.svg',
      },
    ];

    return easterAssets[easterThemeIndex];
  }, [
    backgroundImage,
    logoImage,
    darkBackgroundImage,
    darkLogoImage,
    easterThemeIndex,
  ]);

  const easterSubtitle =
    easterThemeIndex === 1
      ? { text: 'RIGHT IN TWO', color: '#BAFFC5' as const }
      : easterThemeIndex === 2
        ? { text: '46 & 2', color: '#FFFFFF' as const }
        : easterThemeIndex === 3
          ? { text: 'Schism', color: '#FFBC81' as const }
          : null;

  const resolvedSubtitle = easterSubtitle?.text ?? subtitle;
  const subtitleColor = easterSubtitle?.color;

  return (
    <main
      className={cn(styles.layout, {
        [styles.dark]: effectiveDarkTheme,
      })}
    >
      <ToolHero
        subtitle={resolvedSubtitle}
        subtitleColor={subtitleColor}
        backgroundImage={visualAssets.background}
        darkBackgroundImage={visualAssets.darkBackground}
        logoImage={visualAssets.logo}
        darkLogoImage={visualAssets.darkLogo}
        isDarkTheme={effectiveDarkTheme}
        transitionKey={transitionKey}
      />
      <section className={styles.content}>
        <div className={styles.decorTexts} aria-hidden={true}>
          <span className={styles.decorText1}>learn to swim</span>
          <span className={styles.decorText2}>46 &amp; 2</span>
          <span className={styles.decorText3}>right in two</span>
          <span className={styles.decorText4}>I know the pieces fit</span>
        </div>
        <div className={styles.contentInner}>
          {children ?? <ToolContainer poweredBy="Claude" isBlank />}
        </div>
      </section>
    </main>
  );
};

export default ToolsLayout;
