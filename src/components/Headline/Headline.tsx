import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { flushSync } from 'react-dom';

import { TRouter } from '@local-types/global';

import { socialMediaLinks } from '@constants/common';

import AudioPlayer from '@components/AudioPlayer';
import { GlobalContext } from '@components/Context/GlobalContext';

import styles from './Headline.module.scss';

import contributors from '@data/contributors';

type HeadlineProps = {
  headline: string;
  darkTheme?: boolean;
  russianView?: boolean;
};
const Headline: FC<HeadlineProps> = ({ headline, darkTheme, russianView }) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const { setShowLoader, videoRef } = useContext(GlobalContext);
  const { contributorsTxt } = contributors[locale];

  const [title, setTitle] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [secondDescription, setSecondDescription] = useState('');
  const [lastDescription, setLastDescription] = useState('');
  const [fadeOutIndexes, setFadeOutIndexes] = useState([]);
  const [serenityModeStatus, setSereintyModeStatus] = useState(false);
  const [defaultState, setDefaultState] = useState(1);
  const [fadeInIndexes, setFadeInIndexes] = useState([]);

  const serenityText = locale === 'ru' ? 'покой' : 'serenity mode';
  const exitSerenityText =
    locale === 'ru' ? 'покинуть режим покоя' : 'exit serenity';

  const handleClick = e => {
    e.preventDefault();
    flushSync(() => {
      setShowLoader(true);
    });
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });

    setTimeout(() => {
      router.push(`/contributors`);
    }, 300);

    setTimeout(() => {
      videoRef.current?.pause();
      setShowLoader(false);
    }, 800);
  };

  const handleFadeOut = () => {
    setFadeInIndexes([]);
    setDefaultState(2);

    setSereintyModeStatus(true);
    [0, 1, 2, 3, 4].forEach(index => {
      setTimeout(() => {
        setFadeOutIndexes(prev => [...prev, index]);
      }, index * 350);
    });
  };

  const handleFadeIn = () => {
    setFadeOutIndexes([]);
    setDefaultState(3);

    setSereintyModeStatus(false);
    [0, 1, 2, 3, 4].forEach(index => {
      setTimeout(() => {
        setFadeInIndexes(prev => [...prev, index]);
      }, index * 350);
    });
  };

  useEffect(() => {
    const container = document.createElement('div');
    container.innerHTML = headline;
    const h1 = container.querySelector('h1');
    setTitle(h1.textContent);
    if (locale === 'en' || locale === 'hy') {
      const pElement = container.querySelector('p');
      if (!pElement) return;

      const html = pElement.innerHTML;
      const sections = html.split(/<br\s*\/?>\s*<br\s*\/?>/);

      const firstDescription = sections[0]?.trim() || '';
      const secondDescription = sections[1]?.trim() || '';
      const lastDescription = sections.slice(2).join('<br><br>').trim();

      setHighlightedText(firstDescription);
      setSecondDescription(secondDescription);
      setLastDescription(lastDescription);
    } else if (locale === 'ru') {
      const pTags = Array.from(container.querySelectorAll('p'));

      const firstDescription = pTags[0]?.innerHTML.trim() || '';
      let secondDescription = '';
      let lastDescription = '';

      if (pTags[1]) {
        const secondHtml = pTags[1].innerHTML;
        const splitParts = secondHtml.split(/<br\s*\/?>\s*<br\s*\/?>/);

        secondDescription = splitParts[0]?.trim() || '';
        lastDescription = splitParts.slice(1).join('<br><br>').trim();
      }
      setHighlightedText(firstDescription);
      setSecondDescription(secondDescription);
      setLastDescription(lastDescription);
    }
  }, [headline, locale]);

  return (
    <section
      className={cn(styles.headline, {
        [styles.darkTheme]: darkTheme,
        [styles.russianView]: russianView,
      })}
    >
      <div className={styles.headlineInfo}>
        <div
          onClick={!serenityModeStatus ? handleFadeOut : null}
          className={styles.serenity}
          data-test-id="start-serenity"
        >
          {serenityModeStatus ? (
            <AudioPlayer
              loop
              isSerenity
              className={styles.leaf}
              audioSrc={'/keepsimple_/assets/serenity.mp3'}
              playIcon={'/keepsimple_/assets/leaf.svg'}
              pauseIcon={'/keepsimple_/assets/leaf.svg'}
              startSerenityMode={serenityModeStatus}
              data-test-id="audio-player"
            />
          ) : (
            <Image
              src={'/keepsimple_/assets/leaf.svg'}
              width={12}
              height={18}
              className={styles.leaf}
              alt="leaf"
            />
          )}
          <span
            className={styles.serenityBtn}
            onClick={serenityModeStatus ? handleFadeIn : null}
            data-test-id="exit-serenity"
          >
            {serenityModeStatus ? exitSerenityText : serenityText}{' '}
          </span>
        </div>
        <div className={styles.videoContainer}>
          <video
            controls={false}
            playsInline
            autoPlay
            muted
            loop
            className={styles.video}
            height={600}
          >
            <source src="/keepsimple_/assets/leaves.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={cn(styles.contentWrapper, {})}>
          <div className={styles.headlineContent}>
            {title && (
              <h1
                className={cn(styles.section, {
                  [styles.defaultFadeIn]: !!headline && defaultState === 1,
                  [styles.startingPoint]: defaultState === 2,
                  [styles.defaultState]: defaultState === 3,
                  [styles.fadeOut]:
                    fadeOutIndexes.includes(0) && !fadeInIndexes.includes(0),
                  [styles.fadeIn]:
                    fadeInIndexes.includes(0) && !fadeOutIndexes.includes(0),
                })}
              >
                {title}
              </h1>
            )}
            {title && highlightedText && (
              <p
                className={cn(styles.section, {
                  [styles.defaultFadeIn2]: !!headline && defaultState === 1,
                  [styles.startingPoint]: defaultState === 2,
                  [styles.defaultState]: defaultState === 3,
                  [styles.fadeOut]: fadeOutIndexes.includes(1),
                  [styles.fadeIn]: fadeInIndexes.includes(1),
                })}
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              ></p>
            )}
            {title && secondDescription && (
              <p
                className={cn(styles.section, {
                  [styles.defaultFadeIn3]: !!headline && defaultState === 1,
                  [styles.startingPoint]: defaultState === 2,
                  [styles.defaultState]: defaultState === 3,
                  [styles.fadeOut]: fadeOutIndexes.includes(2),
                  [styles.fadeIn]:
                    fadeInIndexes.includes(2) && !fadeOutIndexes.includes(2),
                })}
                dangerouslySetInnerHTML={{ __html: secondDescription }}
              ></p>
            )}
            {title && lastDescription && (
              <p
                className={cn(styles.section, {
                  [styles.defaultFadeIn4]: !!headline && defaultState === 1,
                  [styles.defaultState]: defaultState === 3,
                  [styles.startingPoint]: defaultState === 2,
                  [styles.fadeOut]:
                    fadeOutIndexes.includes(3) && !fadeInIndexes.includes(3),
                  [styles.fadeIn]: fadeInIndexes.includes(3),
                })}
                dangerouslySetInnerHTML={{ __html: lastDescription }}
              ></p>
            )}
          </div>
          <div className={cn(styles.socialMedia, {})}>
            {title &&
              socialMediaLinks.map(link => (
                <a
                  key={link.alt}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={link.handleClick ? link.handleClick : null}
                  className={cn(styles.section, {
                    [styles.defaultFadeIn5]: !!headline && defaultState === 1,
                    [styles.defaultState]: defaultState === 3,
                    [styles.startingPoint]: defaultState === 2,
                    [styles.fadeOut]:
                      fadeOutIndexes.includes(link.id) &&
                      !fadeInIndexes.includes(link.id),
                    [styles.fadeIn]: fadeInIndexes.includes(link.id),
                  })}
                >
                  <Image
                    src={link.imgLink}
                    alt={link.alt}
                    width={link.width}
                    height={link.height}
                  />
                </a>
              ))}
          </div>
        </div>
        <div className={styles.videoContainerMobile}>
          <video
            controls={false}
            playsInline
            autoPlay
            muted
            loop
            className={styles.video}
            height={600}
          >
            <source
              src="/keepsimple_/assets/mobile-leaves-compressed.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <span onClick={handleClick} className={styles.contributors}>
          {contributorsTxt}
        </span>
      </div>
    </section>
  );
};

export default Headline;
