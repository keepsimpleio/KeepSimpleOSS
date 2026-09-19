import SearchIcon from '@uxcore/assets/icons/SearchIcon';
import biasesSearchData from '@uxcore/data/biasesSearch';
import useBiasSearch from '@uxcore/hooks/useBiasSearch';
import useMobile from '@uxcore/hooks/useMobile';
import useUXCoreGlobals from '@uxcore/hooks/useUXCoreGlobals';
import { getSearchResults } from '@uxcore/lib/helpers';
import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './Search.module.scss';

type SearchProps = {
  focusOnInit?: boolean;
  biases: StrapiBiasType[];
};

const Search: FC<SearchProps> = ({ focusOnInit, biases }) => {
  const router = useRouter();
  const { isMobile } = useMobile()[1];
  const { locale } = router as TRouter;
  const data = biasesSearchData[locale];
  const searchTimeout = useRef(null);
  const [value, setValue] = useState('');
  const [searchResultsData, setSearchResultsData] = useState({
    prefix: '',
    resultCount: 0,
    postfix: '',
  });
  const inputRef = useRef(null);

  const { setSearchResults } = useBiasSearch()[0];
  const { isOffsecView } = useUXCoreGlobals()[1];

  const runSearch = useCallback(
    (searchValue: string) => {
      const { results, searchLabels } = getSearchResults(
        biases,
        searchValue,
        locale,
        isOffsecView,
      );
      setSearchResults(results, !!searchValue.trim());
      setSearchResultsData({
        prefix: searchLabels?.[0],
        resultCount: results.length,
        postfix: searchLabels?.[1],
      });
    },
    [locale, biases, isOffsecView],
  );

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value.toLocaleLowerCase();
      setValue(e.target.value);

      clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(() => {
        runSearch(searchValue);
      }, 300);
    },
    [runSearch],
  );

  // Switching the use case changes what the active query should match
  // (PM/HR usage vs OffSec case text): recompute in place, no debounce,
  // so the result count never describes the previous mode.
  useEffect(() => {
    if (!value.trim()) return;
    clearTimeout(searchTimeout.current);
    runSearch(value.toLocaleLowerCase());
  }, [isOffsecView]);

  const handleClear = useCallback(() => {
    // Cancel any in-flight debounce so a pending search can't repopulate
    // results over the just-cleared input.
    clearTimeout(searchTimeout.current);
    setTimeout(() => {
      setSearchResults([], false);
    }, 0);

    setSearchResultsData({
      prefix: '',
      resultCount: 0,
      postfix: '',
    });
    setValue('');
  }, []);

  useEffect(() => {
    handleClear();
  }, [locale, isMobile, handleClear]);

  useEffect(() => {
    if (focusOnInit) {
      inputRef.current.focus();
    }
  }, [focusOnInit]);

  const { prefix, resultCount, postfix } = searchResultsData;
  return (
    <>
      <div className={styles.SearchBoxWrapper}>
        <div className={styles.Search}>
          <input
            ref={inputRef}
            placeholder={data?.placeholder}
            onChange={handleSearch}
            value={value}
            data-cy={'uxcore-search-input'}
          />
          <div
            className={cn(styles.SearchResults, {
              [styles.Visible]: resultCount > 0 || !!value,
            })}
          >
            <span>
              {data?.found}
              {prefix} <b> {resultCount}</b> {data?.item}
              {postfix}
            </span>
          </div>
          <div
            className={cn(styles.ClearIcon, {
              [styles.Visible]: !!value.trim(),
            })}
            onClick={handleClear}
          >
            <Image
              src="/assets/icons/crossRounded.svg"
              alt="clear icon"
              width="20"
              height="20"
            />
          </div>
          <div
            className={cn(styles.SearchIcon, {
              [styles.Visible]: !value.trim(),
            })}
          >
            <SearchIcon />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
