import cn from 'classnames';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { StrapiBiasType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import biasesCategoriesIntl from '@uxcore/data/biasesCategories';
import biasesFolderViewIntl from '@uxcore/data/biasesFolderView';

import FolderItem from '@uxcore/components/_biases/FolderItem';
import ContentGenerator from '@uxcore/components/ContentGenerator';

import Search from './Search';

import styles from './FolderViewLayout.module.scss';

const categoryColorClassNames = [
  '',
  styles.Blue,
  styles.Green,
  styles.Red,
  styles.Purple,
];

const getCategory = (number: number) => {
  if (number >= 1 && number <= 33) return 0;
  if (number > 33 && number <= 68) return 1;
  if (number > 68 && number <= 97) return 2;
  return 3;
};

const getItemData = ({
  title,
  description,
  usageHr,
  number,
  usage,
}: StrapiBiasType) => {
  const category = getCategory(number);

  return { id: number, title, description, usageHr, category, usage };
};

type FolderViewLayoutProps = {
  biases: StrapiBiasType[];
  onBiasSelect?: (biasId: number) => void;
  isOpen?: boolean;
};

const FolderViewLayout = ({
  biases,
  onBiasSelect,
  isOpen,
}: FolderViewLayoutProps) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const [margins, setMargins] = useState([]);
  const [maskIndex, setMaskIndex] = useState(0);
  const [lastItem, setLastItem] = useState(0);
  const [offset, setOffset] = useState(-42);
  const [biasesList, setBiasesList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolledSavedPosition, setScrolledSavedPosition] = useState(0);
  const listContainerRef = useRef(null);
  const lineRef = useRef(null);
  const biasesCategoriesData = biasesCategoriesIntl[locale];
  const { intro } = biasesFolderViewIntl[locale];

  const hoverEffect = useCallback(
    (index: number, type: string) => {
      if (type === 'over') {
        setMargins(prevMargins => {
          const updatedMargins = [...prevMargins];
          for (let i = 0; i <= index; i++) {
            updatedMargins[index - i] -= 90;
          }
          return updatedMargins;
        });
      } else {
        setMargins(biases.map((_, i) => 36 * i));
      }
    },
    [biases, maskIndex],
  );

  const getLastItem = () => {
    const scrollDistance = listContainerRef?.current?.scrollTop - 1;
    const biasCardHeight = 320;
    const divider = 36;
    const num =
      scrollDistance / divider -
      Math.ceil(listContainerRef?.current?.scrollTop / divider);

    return Math.trunc(
      (scrollDistance + divider * num) / divider +
        Math.trunc(
          (listContainerRef?.current?.clientHeight - biasCardHeight) / divider,
        ),
    );
  };

  const handleScrollStop = useCallback(() => {
    setOffset(
      listContainerRef.current.scrollTop !== 0
        ? listContainerRef.current.scrollTop
        : -42,
    );

    const num =
      listContainerRef.current.scrollTop / 36 -
      Math.floor(listContainerRef.current.scrollTop / 36);

    setLastItem(prevState => {
      return getLastItem() > 0 && getLastItem() <= biasesList?.length - 1
        ? getLastItem()
        : prevState;
    });

    setMaskIndex((listContainerRef.current.scrollTop + 36 * num) / 36); // TODO:: check and remove this state. I think it's unnecessary
  }, [biasesList]);

  useEffect(() => {
    if (biases?.length > 0) {
      setMargins(biases.map((_, i) => 36 * i));
    }
  }, [biases]);

  useEffect(() => {
    if (biasesList?.length < 10 && biasesList?.length > 0) {
      setLastItem(biasesList.length - 1);
    } else {
      setLastItem(prevState => {
        return getLastItem() > 0 && getLastItem() <= biasesList?.length - 1
          ? getLastItem()
          : prevState;
      });
    }
  }, [biasesList]);

  useEffect(() => {
    setLastItem(prevState => {
      return getLastItem() > 0 && getLastItem() <= biasesList?.length - 1
        ? getLastItem()
        : prevState;
    });
  }, []);

  useEffect(() => {
    for (let i = 0; i < biases?.length; i++) {
      setMargins(prev => [...prev, 36 * i]);
    }

    listContainerRef.current.addEventListener(
      'scroll',
      debounce(() => {
        handleScrollStop();
      }),
    );
    listContainerRef.current.addEventListener('scroll', () => {
      setMaskIndex(105);
    });

    return () => {
      if (listContainerRef.current) {
        listContainerRef.current.removeEventListener(
          'scroll',
          handleScrollStop,
        );
        listContainerRef.current.removeEventListener('scroll', () => {
          setMaskIndex(105);
        });
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (biasesList?.length > 0 && listContainerRef.current) {
        listContainerRef.current.scrollTop = scrolledSavedPosition;

        setLastItem(() => {
          const val = getLastItem();
          return val > 0 && val <= biasesList?.length - 1 ? val : 0;
        });
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [scrolledSavedPosition, biasesList, router.route]);

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition && listContainerRef.current) {
      const parsedScrollPosition = Number(savedScrollPosition);
      setScrolledSavedPosition(parsedScrollPosition);
      listContainerRef.current.scrollTop = parsedScrollPosition;
    }

    if (listContainerRef.current) {
      listContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (listContainerRef.current) {
        listContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    if (listContainerRef.current) {
      const scrollPosition = listContainerRef.current.scrollTop;
      setScrolledSavedPosition(scrollPosition);
      localStorage.setItem('scrollPosition', String(scrollPosition));
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (biasesList?.length > 0 && !!listContainerRef.current) {
      timer = setTimeout(() => {
        listContainerRef.current.scrollTop = scrolledSavedPosition;
      }, 300);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    listContainerRef.current,
    scrolledSavedPosition,
    listContainerRef,
    router.route,
    biasesList,
  ]);

  const lastItemProps = useMemo(() => {
    if (!biasesList?.[lastItem]) return {};
    return getItemData(biasesList?.[lastItem]?.attributes);
  }, [biasesList, lastItem, locale]);

  const frontCard = [lastItemProps];

  return (
    <div className={styles.FolderViewLayout}>
      <div
        className={cn(styles.Left, {
          [styles.LeftRu]: locale === 'ru',
          [styles.LeftHy]: locale === 'hy',
        })}
      >
        <div className={styles.ContentWrapper}>
          <div className={styles.HeadlineContainer}>
            <h1>UX CORE</h1>
            <span>(UXC)</span>
          </div>
          <div>
            <ContentGenerator data={intro} />
          </div>
        </div>
        <Search
          biases={biases}
          setBiasesList={setBiasesList}
          setIsSearching={setIsSearching}
        />
      </div>
      <div className={styles.Centralizer}>
        <div className={styles.Right}>
          <div
            ref={lineRef}
            className={styles.LineContainer}
            style={{
              top: -offset,
              visibility: isSearching ? 'hidden' : 'visible',
            }}
          >
            {biasesCategoriesData?.map(({ id, label }) => (
              <div key={id} className={categoryColorClassNames[id]}>
                <span className={styles.Line} />
                <span className={styles.Label} data-cy={'sticky-label'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div
            ref={listContainerRef}
            className={styles.ListContainer}
            data-cy={'list-container'}
          >
            {biasesList?.map((item, index) => {
              const itemProps = getItemData(item?.attributes);
              return (
                // @ts-ignore
                <FolderItem
                  key={index}
                  biases={biases}
                  hideBottom={biasesList.length < 10}
                  index={index}
                  margin={margins[index]}
                  zIndex={0}
                  hover={lastItem == index ? null : hoverEffect}
                  {...itemProps}
                />
              );
            })}
            {biasesList?.length >= 10 &&
              Object.keys(lastItemProps).length > 0 &&
              frontCard?.map(el => {
                return (
                  <div
                    key={biasesList[lastItem].number}
                    className={styles.FrontItem}
                  >
                    {
                      // @ts-ignore
                      <FolderItem
                        biases={biases}
                        hideBottom
                        index={biasesList[lastItem]?.number - 1}
                        margin={-273}
                        zIndex={1}
                        {...el}
                      />
                    }
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FolderViewLayout);
