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

import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import useBiasSearch from '@uxcore/hooks/useBiasSearch';
import useMobile from '@uxcore/hooks/useMobile';

import { getSearchResults } from '@uxcore/lib/helpers';

import biasesSearchData from '@data/biasesSearch';

import styles from './Search.module.scss';

type SearchProps = {
  focusOnInit?: boolean;
  biases: StrapiBiasType[];
  setBiasesList: (props: any) => void;
  setIsSearching: (props: any) => void;
};

const Search: FC<SearchProps> = ({
  focusOnInit,
  biases,
  setBiasesList,
  setIsSearching,
}) => {
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

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value.toLocaleLowerCase();

      setValue(e.target.value);

      clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(() => {
        const { results, searchLabels } = getSearchResults(
          biases,
          searchValue,
          locale,
        );

        const filteredBiasesList = biases.filter(bias =>
          results.includes(bias.attributes.number),
        );

        setBiasesList(e.target.value ? filteredBiasesList : biases);
        setIsSearching(!!e.target.value);

        setSearchResults(results);
        setSearchResultsData({
          prefix: searchLabels?.[0],
          resultCount: results.length,
          postfix: searchLabels?.[1],
        });
      }, 300);
    },
    [locale],
  );

  const handleClear = useCallback(() => {
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([]);
      setBiasesList(biases);
    }, 0);

    setSearchResultsData({
      prefix: '',
      resultCount: 0,
      postfix: '',
    });
    setValue('');
  }, [biases]);

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
    <div className={styles.SearchBoxWrapper}>
      <div className={styles.Search}>
        <input
          data-cy={'uxcore-search-input'}
          ref={inputRef}
          placeholder={data.placeholderFull}
          onChange={handleSearch}
          value={value}
        />
        <div
          className={cn(styles.SearchResults, {
            [styles.Visible]: resultCount > 0 || !!value,
          })}
        >
          {data.found}
          <span>{prefix}</span>{' '}
          <b>
            <span>{resultCount}</span>
          </b>{' '}
          {data.item}
          <span>{postfix}</span>
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
            width={20}
            height={20}
          />
        </div>
        <div
          className={cn(styles.SearchIcon, {
            [styles.Visible]: !value.trim(),
          })}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 8.5C15 12.0899 12.0899 15 8.5 15C4.91015 15 2 12.0899 2 8.5C2 4.91015 4.91015 2 8.5 2C12.0899 2 15 4.91015 15 8.5ZM13.7618 15.176C12.3145 16.3183 10.4869 17 8.5 17C3.80558 17 0 13.1944 0 8.5C0 3.80558 3.80558 0 8.5 0C13.1944 0 17 3.80558 17 8.5C17 10.4869 16.3183 12.3145 15.176 13.7618L19.2071 17.7929C19.5976 18.1834 19.5976 18.8166 19.2071 19.2071C18.8166 19.5976 18.1834 19.5976 17.7929 19.2071L13.7618 15.176Z"
              fill="#CBCBCB"
            />
          </svg>
        </div>
        <div className={styles.SearchTooltip}>
          <Image
            className={styles.QuestionMarkIcon}
            src="/assets/biases/q-mark.svg"
            alt="question-mark-icon"
            width={15}
            height={15}
          />
          <div className={styles.Popup}>{data.popup}</div>
        </div>
      </div>
    </div>
  );
};

export default Search;
