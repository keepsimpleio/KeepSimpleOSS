import DiamondIcon from '@uxcore/assets/icons/DiamondIcon';
import { HRIconBlue } from '@uxcore/assets/icons/HRIconBlue';
import { HRIconGrey } from '@uxcore/assets/icons/HRIconGrey';
import { PMIcon } from '@uxcore/assets/icons/PMIcon';
import { PMIconGrey } from '@uxcore/assets/icons/PMIconGrey';
import MobileHeader from '@uxcore/components/_biases/MobileHeader';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import Logos from '@uxcore/components/Logos';
import OurProjectsModal from '@uxcore/components/OurProjectsModal';
import PageSwitcher from '@uxcore/components/PageSwitcher';
import biasesMetadata from '@uxcore/data/biases';
import biasesCategories from '@uxcore/data/biasesCategories';
import toolHeaderData from '@uxcore/data/toolHeader';
import useBiasSearch from '@uxcore/hooks/useBiasSearch';
import { groupFilteredData } from '@uxcore/lib/helpers';
import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import { UserTypes } from '@uxcore/local-types/uxcat-types/types';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, {
  FC,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import Search from '../Search';

import styles from './MobileView.module.scss';

const ViewSwitcher = dynamic(
  () => import('@uxcore/components/_biases/ViewSwitcher'),
  {
    ssr: false,
  },
);

type MobileViewProps = {
  containerClassName: string;
  strapiBiases: StrapiBiasType[];
  isSecondView?: boolean;
  toggleIsCoreView?: () => void;
  defaultViewLabel?: string;
  secondViewLabel?: string;
  setIsSwitched?: (isSwitched: boolean) => void;
  isSwitched?: boolean;
  isOpen?: boolean;
  biasSelected?: boolean;
  headerPodcastOpen?: (updater: (prev: boolean) => boolean) => void;
  isPodcastOpen?: boolean;
  handleSnackbarOpening?: () => void;
  description?: string;
  userInfo?: UserTypes;
  setUserInfo?: (data: UserTypes) => void;
  hrText?: string;
  blockLanguageSwitcher?: boolean;
};

const MobileView: FC<MobileViewProps> = ({
  strapiBiases,
  containerClassName,
  isSecondView,
  toggleIsCoreView,
  defaultViewLabel,
  setIsSwitched,
  isSwitched,
  headerPodcastOpen,
  isPodcastOpen,
  handleSnackbarOpening,
  description,
  userInfo,
  setUserInfo,
  blockLanguageSwitcher,
  hrText,
}) => {
  const { searchResults } = useBiasSearch()[1];
  const containerRef = useRef(null);
  const offsetsRef = useRef([]);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stickyItemsRef = useRef([]);
  const activeStickyElementIndexRef = useRef(0);
  const stickyElementHeight = 45;
  const [content, setContent] = useState([]);
  const [openOurProjects, setOpenOurProjects] = useState(false);
  const router = useRouter();
  const { locale } = router as TRouter;
  const { explanationLink } = biasesMetadata[locale];
  const { ourProjects, done } = toolHeaderData[locale];
  const { ourProjectsModalData } = useContext(GlobalContext);
  const [mobileScrollPosition, setMobileScrollPosition] = useState(0);

  function getStickyElements() {
    return offsetsRef.current.reduce((acc, offset, index) => {
      if (containerRef.current.scrollTop) {
        if (offset <= containerRef.current.scrollTop + stickyElementHeight) {
          let top = 0;

          if (offset > containerRef.current.scrollTop) {
            top = offset - containerRef.current.scrollTop;
          }

          acc.push({
            index,
            top,
          });
        }
      }
      return acc;
    }, []);
  }

  function handleMobileScroll() {
    const activeStickyElements = getStickyElements();
    activeStickyElementIndexRef.current =
      activeStickyElements[activeStickyElements.length - 1]?.index;
    stickyItemsRef.current.forEach((el, i) => {
      const stickyElement = el.children[0];
      const indexOfFixedClassName = stickyElement.className.lastIndexOf(
        styles.Fixed,
      );
      if (activeStickyElements.find((sEl: any) => sEl.index === i)) {
        if (indexOfFixedClassName === -1) {
          stickyElement.className =
            stickyElement.className + ' ' + styles.Fixed;
        }
      } else {
        if (indexOfFixedClassName !== -1) {
          const baseClassName = stickyElement.className.slice(
            0,
            indexOfFixedClassName - 1,
          );
          stickyElement.className = baseClassName;
        }
      }
    });
  }

  function updateOffsets() {
    // @ts-ignore
    stickyItemsRef.current = document.querySelectorAll(
      `.${styles.StickyElement}`,
    );

    stickyItemsRef.current.forEach((el, i) => {
      offsetsRef.current[i] = el.offsetTop;
    });

    return offsetsRef.current;
  }

  useEffect(() => {
    containerRef.current = document.querySelector(`.${containerClassName}`);
    updateOffsets();
    containerRef.current.addEventListener('scroll', handleMobileScroll);
    return () => {
      containerRef.current.removeEventListener('scroll', handleMobileScroll);
    };
  }, [searchResults, locale, containerClassName, router]);

  useEffect(() => {
    if (!!strapiBiases) {
      const groupedData = groupFilteredData(
        strapiBiases,
        searchResults,
        locale,
      );
      setContent(groupedData);
    }
  }, [searchResults, locale, strapiBiases, containerClassName, router]);

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('mobileScrolledPosition');
    if (savedScrollPosition && containerRef.current) {
      const parsedScrollPosition = Number(savedScrollPosition);
      setMobileScrollPosition(parsedScrollPosition);
      containerRef.current.scrollTop = parsedScrollPosition;
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const mobileScrolledPosition = containerRef.current.scrollTop;
      setMobileScrollPosition(mobileScrolledPosition);
      localStorage.setItem(
        'mobileScrolledPosition',
        String(mobileScrolledPosition),
      );
    }
  };

  const openBisPage = useCallback(
    id => {
      if (containerRef.current) {
        const currentScroll = containerRef.current.scrollTop;
        localStorage.setItem(
          'scrollSnapshotBeforeModal',
          String(currentScroll),
        );
      }

      const matchedBias = strapiBiases.find(
        bias => String(bias.attributes.number) === String(id),
      );

      router.push(`/uxcore/${matchedBias.attributes.slug}`, undefined, {
        scroll: false,
      });
    },
    [router, strapiBiases],
  );

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!containerRef.current.scrollTop) {
      timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo(0, mobileScrollPosition);
        }
      }, 10);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router, router.pathname, containerRef.current, mobileScrollPosition]);

  useEffect(() => {
    const scrolledArea = localStorage.getItem('scrollSnapshotBeforeModal');
    const scrolledPosition = localStorage.getItem('mobileScrolledPosition');
    if (scrolledArea) {
      containerRef.current.scrollTo(0, Number(scrolledArea));
    }
    if (scrolledPosition === '0') {
      localStorage.removeItem('scrollSnapshotBeforeModal');
    }
  }, [containerRef.current, router.pathname]);

  return (
    <Fragment>
      <div className={cn(styles.StickyElement, {})}>
        <MobileHeader
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setHeaderPodcastOpen={headerPodcastOpen}
          isPodcastOpen={isPodcastOpen}
          blockLanguageSwitcher={blockLanguageSwitcher}
        />
      </div>
      <div className={styles.MobileContent}>
        <PageSwitcher page="uxcore" />
        <div
          className={styles.OurProjectsLabel}
          onClick={() => setOpenOurProjects(true)}
        >
          <DiamondIcon />
          <span> {ourProjects}</span>
        </div>
        <h1 className={styles.Title}>UX CORE</h1>
        <span className={styles.Subtitle}>uxcore.io</span>
        <p className={styles.uxcoreDescription}>{description}</p>
        <a href={explanationLink.link} className={styles.link}>
          {explanationLink.title}
        </a>
        <Logos />
        <ViewSwitcher
          isSecondView={isSecondView}
          toggleIsCoreView={toggleIsCoreView}
          defaultViewLabel={defaultViewLabel}
          secondViewLabel={'hr'}
          secondText={hrText}
          setIsSwitched={setIsSwitched}
          isSwitched={isSwitched}
          defaultVieWIcon={isSecondView ? <PMIcon /> : <PMIconGrey />}
          secondViewIcon={isSecondView ? <HRIconGrey /> : <HRIconBlue />}
          handleSnackbarOpening={handleSnackbarOpening}
        />
        <Search biases={strapiBiases} />
      </div>
      {!!content &&
        content.map((cat, catIndex) => {
          const categoryData = biasesCategories[locale][catIndex];
          return (
            <Fragment key={catIndex}>
              <div className={styles.StickyElement} ref={stickyRef}>
                <div
                  className={cn(
                    styles.BiasCategory,
                    styles[`Section${categoryData.id}`],
                    {
                      [styles[`Section${catIndex + 1}Hy`]]: locale === 'hy',
                    },
                  )}
                >
                  <div>{categoryData.label}</div>
                </div>
              </div>
              {!!cat &&
                cat.map((biasNumber: number) => {
                  const currentBias = strapiBiases?.find(
                    ({ attributes, id }) => attributes?.number === biasNumber,
                  );
                  if (!currentBias) return null;
                  const { attributes } = currentBias;

                  return (
                    <div
                      onClick={() => openBisPage(biasNumber)}
                      key={biasNumber}
                      className={cn(
                        styles.BiasTitle,
                        styles[`Section${catIndex + 1}`],
                      )}
                      data-cy={'uxcore-mobile-bias'}
                    >
                      <h3 className={styles.BiasName}>
                        <span
                          className={styles.BiasNumber}
                        >{`#${attributes.number} `}</span>
                        {attributes.title}
                      </h3>
                      <div className={styles.BiasМobileLabels}>
                        {attributes.p && (
                          <Image
                            src="/assets/biases/p-rounded.svg"
                            alt="product-value"
                            width={12}
                            height={12}
                          />
                        )}
                        {attributes.m && (
                          <Image
                            src="/assets/biases/m-rounded.svg"
                            alt="management-value"
                            width={12}
                            height={12}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
            </Fragment>
          );
        })}
      {openOurProjects && (
        <OurProjectsModal
          projects={
            !!ourProjectsModalData && ourProjectsModalData?.aboutProject
          }
          title={!!ourProjectsModalData && ourProjectsModalData?.title}
          onClose={() => setOpenOurProjects(false)}
          github={!!ourProjectsModalData && ourProjectsModalData.github}
          api={!!ourProjectsModalData && ourProjectsModalData.api}
          doneTxt={done}
        />
      )}
    </Fragment>
  );
};

export default memo(MobileView);
