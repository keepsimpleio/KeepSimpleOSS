import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';

import { socialMediaLinks } from '@constants/common';

import { TRouter } from '@local-types/global';

import { sanitizeHtml } from '@lib/sanitizeHtml';

import contributors from '@data/contributors';

import AudioPlayer from '@components/AudioPlayer';
import { GlobalContext } from '@components/Context/GlobalContext';

import styles from './Headline.module.scss';

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

  const [desktopVideoReady, setDesktopVideoReady] = useState(false);
  const [mobileVideoReady, setMobileVideoReady] = useState(false);
  const [desktopVideoDarkReady, setDesktopVideoDarkReady] = useState(false);
  const [mobileVideoDarkReady, setMobileVideoDarkReady] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoDarkRef = useRef<HTMLVideoElement>(null);
  const mobileVideoDarkRef = useRef<HTMLVideoElement>(null);

  // Each source is assigned to its <video> once per page life; the set keeps a
  // theme flip or a viewport change from restarting a download.
  const loadedVideos = useRef(new Set<string>());

  const loadVideo = useCallback(
    (
      ref: React.RefObject<HTMLVideoElement>,
      src: string,
      setReady: (v: boolean) => void,
      onReady?: () => void,
    ) => {
      const video = ref.current;
      if (!video || loadedVideos.current.has(src)) return;
      loadedVideos.current.add(src);
      video.src = src;
      video.load();
      const onCanPlay = () => {
        setReady(true);
        video.removeEventListener('canplay', onCanPlay);
        onReady?.();
      };
      video.addEventListener('canplay', onCanPlay);
    },
    [],
  );

  // Only the video the visitor can see downloads first: the one matching the
  // viewport (the 960px cut is the same one the stylesheet swaps containers
  // at) and the current theme. Once it can play, the other theme for the same
  // viewport follows in the background so a theme switch stays instant. The
  // other viewport's videos never load unless the window crosses the cut.
  // A visitor who prefers reduced motion gets no video at all: the still
  // posters underneath are the hero, and nothing downloads.
  // stability-passport: exempt the <video> elements are position: absolute
  // inside containers sized by the stylesheet (inset: 0 on desktop, 100vw by
  // 55vh on mobile) with the poster image holding the same box, so a video
  // arriving late cannot move anything.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const slots = {
      desktop: {
        light: {
          ref: desktopVideoRef,
          src: '/keepsimple_/assets/leaves-v2.mp4',
          setReady: setDesktopVideoReady,
        },
        dark: {
          ref: desktopVideoDarkRef,
          src: '/keepsimple_/assets/home-page/leaves-dark-v2.mp4',
          setReady: setDesktopVideoDarkReady,
        },
      },
      mobile: {
        light: {
          ref: mobileVideoRef,
          src: '/keepsimple_/assets/home-page/Mobile-Leaves-Compressed1.mp4',
          setReady: setMobileVideoReady,
        },
        dark: {
          ref: mobileVideoDarkRef,
          src: '/keepsimple_/assets/home-page/leaves-mobile-dark-v2.mp4',
          setReady: setMobileVideoDarkReady,
        },
      },
    };
    const mobileQuery = window.matchMedia('(max-width: 960px)');

    const loadForViewport = () => {
      const viewport = mobileQuery.matches ? 'mobile' : 'desktop';
      const visible = slots[viewport][darkTheme ? 'dark' : 'light'];
      const hidden = slots[viewport][darkTheme ? 'light' : 'dark'];
      const loadHidden = () =>
        loadVideo(hidden.ref, hidden.src, hidden.setReady);

      if (loadedVideos.current.has(visible.src)) {
        loadHidden();
      } else {
        loadVideo(visible.ref, visible.src, visible.setReady, loadHidden);
      }
    };

    let loadListenerOn = false;
    if (document.readyState === 'complete') {
      loadForViewport();
    } else {
      window.addEventListener('load', loadForViewport);
      loadListenerOn = true;
    }
    mobileQuery.addEventListener('change', loadForViewport);

    return () => {
      if (loadListenerOn) window.removeEventListener('load', loadForViewport);
      mobileQuery.removeEventListener('change', loadForViewport);
    };
  }, [darkTheme, loadVideo]);

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
          <Image
            src="/keepsimple_/assets/home-page/desktop-thumbnail-light.webp"
            alt="Hero background"
            fill
            priority
            className={cn(styles.poster, styles.posterLight)}
            sizes="(max-width: 1440px) 50vw, 684px"
          />
          <Image
            src="/keepsimple_/assets/home-page/desktop-thumbnail-dark.webp"
            alt="Hero background"
            fill
            priority
            className={cn(styles.poster, styles.posterDark)}
            sizes="(max-width: 1440px) 50vw, 684px"
          />
          <video
            ref={desktopVideoRef}
            controls={false}
            playsInline
            autoPlay
            muted
            loop
            className={cn(styles.video, {
              [styles.videoVisible]: desktopVideoReady && !darkTheme,
            })}
            height={600}
          />
          <video
            ref={desktopVideoDarkRef}
            controls={false}
            playsInline
            autoPlay
            muted
            loop
            className={cn(styles.video, {
              [styles.videoVisible]: desktopVideoDarkReady && darkTheme,
            })}
            height={600}
          />
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
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(highlightedText),
                }}
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
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(secondDescription),
                }}
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
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(lastDescription),
                }}
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
          <Image
            src="/keepsimple_/assets/home-page/mobile-thumbnail.png"
            alt="Hero background"
            fill
            priority
            className={cn(styles.poster, styles.posterLight)}
            sizes="(max-width: 786px) 100vw, 786px"
          />
          <Image
            src="/keepsimple_/assets/home-page/mobile-thumbnail-dark.webp"
            alt="Hero background"
            fill
            priority
            className={cn(styles.poster, styles.posterDark)}
            sizes="(max-width: 786px) 100vw, 786px"
          />
          <video
            ref={mobileVideoRef}
            controls={false}
            playsInline
            autoPlay
            muted
            loop
            className={cn(styles.video, {
              [styles.videoVisible]: mobileVideoReady && !darkTheme,
            })}
            height={600}
          />
          <video
            ref={mobileVideoDarkRef}
            controls={false}
            playsInline
            autoPlay
            muted
            loop
            className={cn(styles.video, {
              [styles.videoVisible]: mobileVideoDarkReady && darkTheme,
            })}
            height={600}
          />
        </div>
        <span onClick={handleClick} className={styles.contributors}>
          {contributorsTxt}
        </span>
      </div>
    </section>
  );
};

export default Headline;
