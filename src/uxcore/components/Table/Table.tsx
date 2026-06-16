import Button from '@uxcore/components/Button';
import RouteLoadingOverlay, {
  useRouteLoading,
} from '@uxcore/components/RouteLoadingOverlay';
import Tag, { TTag } from '@uxcore/components/Tag';
import tableIntl from '@uxcore/data/table';
import type { QuestionType, TagType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import Search from './TableSearch';

import styles from './Table.module.scss';

type TableProps = {
  data: QuestionType[];
  setStageName?: (value: string) => void;
  tags: TagType[];
  activeFilter: string;
  withSearch?: boolean;
  disableTooltips?: boolean;
  maxHeight?: string | number;
  noResults?: boolean;
  focusSearchOnInit?: boolean;
  biasNumber?: number;
  onFilterClick?: (id: string) => void;
  onSearch?: (value: string) => void;
  onSearchClear?: () => void;
  showMoreButton?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  setIsQuestionHovered?: (value: boolean) => void;
  isUXCoreModal?: boolean;
};

const Table: FC<TableProps> = ({
  data: incomingData,
  tags,
  activeFilter,
  withSearch,
  maxHeight,
  disableTooltips = true,
  noResults,
  focusSearchOnInit,
  onFilterClick,
  onSearch,
  onSearchClear,
  biasNumber,
  showMoreButton,
  searchValue,
  isUXCoreModal,
  setSearchValue,
  setIsQuestionHovered,
  setStageName,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const tableBodyRef = useRef<HTMLDivElement | null>(null);
  const UXCG_WINDOW_SCROLL_KEY = 'uxcgLayoutScrollY:v1';
  const UXCG_TABLE_SCROLL_KEY = 'uxcgTableScrollTop:v1';

  const [data, setData] = useState(incomingData);
  const [displayedItems, setDisplayedItems] = useState(data.length);
  const [isActive, setIsActive] = useState(false);
  const [isNavigating, startNavigation] = useRouteLoading();

  const {
    allQuestionsButtonLabel,
    showMoreText,
    showLessText,
    noResultsText,
    labelText,
  } = tableIntl[locale];

  const formatName = (number, title) => {
    return `#${number}. ${title}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(true);

      setTimeout(() => {
        setIsActive(false);
      }, 1600);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sortData = useCallback(dataToSort => {
    const newData = [...dataToSort];
    newData.sort((a: any, b: any) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    return newData;
  }, []);

  const persistUXCGScrollPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(
        UXCG_WINDOW_SCROLL_KEY,
        String(window.scrollY || 0),
      );
      window.sessionStorage.setItem(
        UXCG_TABLE_SCROLL_KEY,
        String(tableBodyRef.current?.scrollTop || 0),
      );
    } catch {
      // Ignore storage errors.
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!tableBodyRef.current) return;
    try {
      const savedScrollTop = window.sessionStorage.getItem(
        UXCG_TABLE_SCROLL_KEY,
      );
      if (!savedScrollTop) return;
      const scrollTop = Number(savedScrollTop);
      if (!Number.isNaN(scrollTop)) {
        tableBodyRef.current.scrollTop = scrollTop;
      }
    } catch {
      // Ignore storage errors.
    }
  }, [incomingData]);

  const handleChange = useCallback(
    (value: string) => {
      onSearch && onSearch(value);
      setSearchValue(value);
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    onSearchClear && onSearchClear();
  }, [onSearchClear]);

  const handleTagFilterClick = useCallback(
    e => {
      const { id } = e.target.dataset;
      onFilterClick(id);
    },
    [onFilterClick],
  );

  const findAnswerIndexByBiasNumber = useCallback(
    (biasNumber: number, questionIndex: number) => {
      const answers = data[questionIndex]?.attributes?.answers.split('\n');
      return answers.findIndex((item: string) => {
        return item.includes(`{{${biasNumber}}}`);
      });
    },
    [locale, data],
  );

  const openQuestion = useCallback(
    (number: number, biasNumber: number, answerIndex: number) => {
      persistUXCGScrollPosition();
      startNavigation();
      const basePath =
        router.locale === 'ru'
          ? '/ru/uxcg'
          : router.locale === 'hy'
            ? '/hy/uxcg'
            : '/uxcg';
      router.push(
        `${basePath}/${number}${biasNumber ? `#${answerIndex}` : ''}`,
        undefined,
        { scroll: false },
      );
    },
    [biasNumber, router, persistUXCGScrollPosition, startNavigation],
  );

  useEffect(() => {
    const newData = sortData(incomingData);
    setData(newData);
  }, [incomingData, sortData]);

  useEffect(() => {
    if (data.length) {
      setDisplayedItems(data.length);
    }
    if (showMoreButton) {
      setDisplayedItems(3);
    }
  }, [showMoreButton, data.length]);

  return (
    <>
      {withSearch && (
        <div className={styles.TableSearchWrapper}>
          <Search
            onChange={handleChange}
            onClear={handleClear}
            focusOnInit={!!focusSearchOnInit}
          />
        </div>
      )}
      <div
        className={cn(styles.Table, {
          [styles.SearchLess]: !withSearch,
          [styles.UXCoreModal]: isUXCoreModal,
        })}
      >
        {withSearch && (
          <div
            className={cn(styles.TableFilterWrapper, {
              [styles.Collapsed]: !!searchValue,
            })}
          >
            <div
              className={cn(styles.LabelWrapper, {
                [styles.LabelWrapperAnimation]: isActive,
              })}
            >
              <span className={styles.SelectionTxt}> {labelText} </span>
            </div>
            <Tag
              dataId="all"
              styles={{ backgroundColor: '#282828' }}
              isActive={activeFilter === 'all'}
              title={allQuestionsButtonLabel}
              type="button"
              onClick={handleTagFilterClick}
              large
              setStageName={setStageName}
              className={styles.AllQuestionsButton}
            />
            {tags.map((tag, index) => (
              <Tag
                setStageName={setStageName}
                dataId={String(tag.id)}
                key={index}
                {...tag}
                large
                onClick={handleTagFilterClick}
                type="button"
                isActive={activeFilter === String(tag.id)}
                className={styles.TableFilter}
              />
            ))}
          </div>
        )}
        <div
          className={styles.TableBody}
          ref={tableBodyRef}
          onScroll={persistUXCGScrollPosition}
          style={{ maxHeight }}
        >
          {noResults && (
            <div className={styles.NoResults} data-cy={'No Results Found'}>
              {noResultsText}
            </div>
          )}
          {data.slice(0, displayedItems).map(({ attributes }, index) => {
            const { slug } = attributes;
            const itemTags = JSON.parse(attributes?.tags || '[]');
            const answerIndex = findAnswerIndexByBiasNumber(biasNumber, index);
            const name = formatName(attributes.number, attributes.title);

            // GET BACK TO IT LATER: fix damn loop issue
            const isHidden =
              activeFilter !== 'all' &&
              !itemTags.includes(Number(activeFilter));

            return (
              <div
                data-cy="open-question"
                key={index}
                className={cn(styles.TableRow, {
                  [styles.Hidden]: isHidden,
                })}
                onClick={() => {
                  openQuestion(slug, biasNumber, answerIndex);
                }}
                onMouseEnter={() => {
                  setIsQuestionHovered && setIsQuestionHovered(true);
                }}
                onMouseLeave={() => {
                  setIsQuestionHovered && setIsQuestionHovered(false);
                }}
              >
                <div className={styles.TableRowTags}>
                  {itemTags.map((tagId, tagIndex) => {
                    if (
                      activeFilter !== 'all' &&
                      tagId !== Number(activeFilter)
                    )
                      return null;
                    const tagData = tags.find((tag: TTag) => tag.id === tagId);

                    if (tagData) {
                      return (
                        <Tag
                          key={tagIndex}
                          {...tagData}
                          tooltip={disableTooltips ? null : tagData.tooltip}
                          className={styles.TableRowTag}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
                <div className={styles.TableRowData}>
                  <Link
                    href={`/uxcg/${slug}`}
                    key={index}
                    scroll={false}
                    onClick={persistUXCGScrollPosition}
                    className={styles.questionTitle}
                  >
                    {name}
                  </Link>
                </div>
              </div>
            );
          })}

          {showMoreButton && (
            <div className={styles.showMoreLessBtns}>
              {data.length > displayedItems && (
                <Button
                  label={showMoreText}
                  type={'primary'}
                  onClick={() =>
                    setDisplayedItems(displayedItems + data.length)
                  }
                  className={cn({
                    [styles.showMoreBtn]: isUXCoreModal,
                  })}
                  dataCy="show-more-button"
                />
              )}
              {displayedItems > 3 && (
                <Button
                  label={showLessText}
                  onClick={() => setDisplayedItems(3)}
                  className={cn({
                    [styles.showLessBtn]: isUXCoreModal,
                  })}
                  dataCy="show-less-button"
                />
              )}
            </div>
          )}
        </div>
      </div>
      <RouteLoadingOverlay active={isNavigating} />
    </>
  );
};

export default memo(Table);
