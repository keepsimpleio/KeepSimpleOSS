import cn from 'classnames';
import { useRouter } from 'next/router';
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { QuestionType, TagType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import useSpinner from '@uxcore/hooks/useSpinner';

import uxcgDescriptionData from '@data/uxcgDescriptionData';

import Table from '@uxcore/components/Table';
import ToolFooter from '@uxcore/components/ToolFooter';
import PanelHeader from '@uxcore/components/uxcg/PanelHeader';
import TagContainer from '@uxcore/components/uxcg/TagContainer';

import styles from './UXCGLayout.module.scss';

interface UXCGLayoutProps {
  questions: any;
  tags: TagType[];
  changedHeadingOrder?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  allQuestions: any;
}

const UXCGLayout: FC<UXCGLayoutProps> = ({
  questions,
  tags,
  changedHeadingOrder = false,
  searchValue,
  setSearchValue,
  allQuestions,
}) => {
  const { setIsVisible } = useSpinner()[0];
  const searchDebounce: any = useRef();
  const router = useRouter();
  const { locale } = router as TRouter;
  const { description, defaultStage, selectStageTxt, relevantQuestionsTxt } =
    uxcgDescriptionData[locale];

  const SESSION_STORAGE_KEY = 'uxcgLayoutState:v1';
  const SESSION_SCROLL_KEY = 'uxcgLayoutScrollY:v1';
  const getSessionState = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as {
        activeFilter?: string;
        stageName?: any;
        isAciveSearch?: boolean;
        searchValue?: string;
      };
    } catch {
      return null;
    }
  }, []);

  const [isSessionHydrated, setIsSessionHydrated] = useState(false);

  const [isAciveSearch, setIsActiveSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<QuestionType[]>([]);
  const [stageName, setStageName] = useState<any>('');
  const [activeFilter, setActiveFilter] = useState<string>('1');
  const stageText = stageName[locale] || defaultStage;

  const relevantQuestionsWithStage = {
    en: `Relevant questions for your project's ${stageText} stage`,
    ru: `Актуальные вопросы для этапа "${stageText}" вашего проекта`,
    hy: `Համապատասխան հարցեր ձեր նախագծի ${stageText} փուլում`,
  };
  const prevFilterRef = useRef(activeFilter);

  const initialSearchValue = router.query.search as string;

  const filterQuestionsBySearchTerm = (
    searchTerm: string,
    allQuestions: {
      en: QuestionType[];
      ru: QuestionType[];
      hy: QuestionType[];
    },
    currentLocale: 'en' | 'ru' | 'hy',
  ): QuestionType[] => {
    const foundNumbers = new Set<number>();
    const normalizedTerm = searchTerm.toLowerCase();

    for (const locale of ['en', 'ru', 'hy'] as const) {
      for (const question of allQuestions[locale]) {
        const raw = question.attributes?.aliases;
        const aliases = Array.isArray(raw) ? raw : [raw];

        const matched = aliases.some(alias =>
          alias?.toLowerCase().includes(normalizedTerm),
        );

        if (matched) {
          foundNumbers.add(question.attributes.number);
        }
      }
    }

    return allQuestions[currentLocale].filter(q =>
      foundNumbers.has(q.attributes.number),
    );
  };

  useLayoutEffect(() => {
    // Hydrate session after the first client render to avoid SSR/client markup mismatches.
    const sessionState = getSessionState();
    if (!sessionState) {
      setIsSessionHydrated(true);
      return;
    }

    if (typeof sessionState.activeFilter === 'string') {
      setActiveFilter(sessionState.activeFilter);
    }

    if (typeof sessionState.stageName !== 'undefined') {
      setStageName(sessionState.stageName || '');
    }

    if (sessionState.isAciveSearch && sessionState.searchValue) {
      const newSearchResults: QuestionType[] = filterQuestionsBySearchTerm(
        sessionState.searchValue,
        allQuestions,
        locale,
      );
      setIsActiveSearch(true);
      setSearchResults(newSearchResults);
      setSearchValue?.(sessionState.searchValue);
    } else {
      setIsActiveSearch(false);
      setSearchResults([]);
    }

    setIsSessionHydrated(true);
  }, [getSessionState, allQuestions, locale, setSearchValue]);

  useLayoutEffect(() => {
    // When opening /uxcg/[slug], keep the background at the position
    // where the user clicked from the table.
    if (typeof window === 'undefined') return;
    if (!router.asPath.includes('/uxcg')) return;
    try {
      const savedY = window.sessionStorage.getItem(SESSION_SCROLL_KEY);
      if (!savedY) return;
      const y = Number(savedY);
      if (Number.isNaN(y)) return;

      // Double-rAF waits for route content + modal mount before restoring.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      });
    } catch {
      // Ignore storage read issues.
    }
  }, [router.asPath]);

  useEffect(() => {
    // Persist background selection until the tab/window is closed.
    if (typeof window === 'undefined') return;
    if (!isSessionHydrated) return;
    try {
      window.sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          activeFilter,
          stageName,
          isAciveSearch,
          searchValue: typeof searchValue === 'string' ? searchValue : '',
        }),
      );
    } catch {
      // Ignore storage quota/disabled scenarios.
    }
  }, [activeFilter, stageName, isAciveSearch, searchValue, isSessionHydrated]);

  const handleSearch = useCallback(
    (value: string) => {
      clearTimeout(searchDebounce.current);

      if (!!value.trim()) {
        searchDebounce.current = setTimeout(() => {
          try {
            setIsVisible(true);
            setIsActiveSearch(true);
            const newSearchResults: QuestionType[] =
              filterQuestionsBySearchTerm(value, allQuestions, locale);
            setSearchResults(newSearchResults);
            setIsVisible(false);
            router.push(`/uxcg?search=${value}`, undefined, {
              scroll: false,
              shallow: true,
            });
          } catch {
            setIsVisible(false);
            setIsActiveSearch(false);
            setSearchResults([]);
          }
        }, 250);
      } else {
        setIsVisible(false);
        setIsActiveSearch(false);
        setSearchResults([]);
      }
      if (value.length === 0) {
        router.push(`/uxcg`, undefined, {
          scroll: true,
          shallow: true,
        });
      }
    },
    [setIsVisible, allQuestions, locale, router],
  );

  const searchResultTags = searchResults.map(
    question => question.attributes.tags,
  );
  const resultTags = searchResultTags.flatMap(item =>
    JSON.parse(item).map(String),
  );

  useEffect(() => {
    // Do not wipe session UI when modal routes are opened (they don't carry `?search=`).
    if (!initialSearchValue) return;
    setSearchValue?.(initialSearchValue);
    if (initialSearchValue) {
      const newSearchResults = filterQuestionsBySearchTerm(
        initialSearchValue,
        allQuestions,
        locale,
      );
      setIsActiveSearch(true);
      setSearchResults(newSearchResults);
    }
    return () => {
      clearTimeout(searchDebounce.current);
    };
  }, [initialSearchValue, router.asPath, locale, allQuestions, setSearchValue]);

  const prevIsActiveSearchRef = useRef<boolean>(isAciveSearch);

  // Maintain tag highlight:
  // - when search becomes active: clear highlight (we show results instead)
  // - when search becomes inactive (true -> false): restore last selected tag
  useEffect(() => {
    const prev = prevIsActiveSearchRef.current;

    if (isAciveSearch && !prev) {
      prevFilterRef.current = activeFilter;
      setActiveFilter('');
    }

    if (!isAciveSearch && prev) {
      setActiveFilter(prevFilterRef.current);
    }

    prevIsActiveSearchRef.current = isAciveSearch;
  }, [isAciveSearch, activeFilter]);

  return (
    <div className={styles.body}>
      <div
        className={cn(styles.Content, {
          [styles.hyLayout]: locale === 'hy',
        })}
      >
        {changedHeadingOrder ? (
          <h3 className={styles.Title}>UX CORE GUIDE</h3>
        ) : (
          <h1 className={styles.Title}>UX CORE GUIDE</h1>
        )}
        <p className={styles.description}> {description}</p>
        <section
          className={cn(styles.ShiftedContent, {
            [styles.hyLayout]: locale === 'hy',
          })}
        >
          <PanelHeader
            icon={'/assets/uxcg/roadmap.png'}
            text={selectStageTxt}
          />
          <div className={styles.tagContainerWrapper}>
            {tags.map((tag, index) => (
              <TagContainer
                // @ts-ignore
                setStageName={setStageName}
                resultTags={resultTags}
                id={tag.id}
                iconUrl={tag.iconUrl}
                key={index}
                {...tag}
                backgroundUrl={tag.backgroundUrl}
                iconName={tag.iconName}
                activeFilter={activeFilter}
                isSelected={
                  activeFilter === String(tag.id) || activeFilter === 'all'
                }
                title={tag.title}
                locale={locale}
                onClick={setActiveFilter}
              />
            ))}
          </div>
          <PanelHeader
            className={styles.relevantQuestionsHeader}
            icon={'/assets/uxcg/question.png'}
            text={
              stageName !== 'all'
                ? relevantQuestionsWithStage[locale]
                : relevantQuestionsTxt
            }
          />
          <Table
            showMoreButton={false}
            data={
              initialSearchValue || isAciveSearch ? searchResults : questions
            }
            tags={tags}
            activeFilter={isAciveSearch ? 'all' : activeFilter}
            onSearch={handleSearch}
            noResults={isAciveSearch && !searchResults.length}
            onFilterClick={setActiveFilter}
            withSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setStageName={setStageName}
          />
        </section>
        <div className={styles.Motto}>Be Kind. Do Good.</div>
      </div>
      <ToolFooter page="uxcg" />
    </div>
  );
};

export default UXCGLayout;
