import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import tableData from '@data/table';

import styles from './TableSearch.module.scss';

type TTableSearch = {
  focusOnInit: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
};

const TableSearch: FC<TTableSearch> = ({
  focusOnInit,
  onChange,
  onClear,
}: TTableSearch) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const inputRef = useRef(null);
  const initialSearchValue = router.query.search as string;
  const [value, setValue] = useState(initialSearchValue || '');
  const { searchPlaceholder } = tableData[locale];

  const handleChange = useCallback(
    e => {
      const { value: newValue } = e.target;
      setValue(newValue);

      if (onChange) onChange(newValue);
    },
    [onChange, setValue],
  );

  const handleClear = useCallback(() => {
    setValue('');

    if (onClear && onChange) {
      onChange('');
      onClear();
    }
  }, [onClear, onChange]);

  useEffect(() => {
    if (focusOnInit) {
      inputRef.current.focus();
    }
  }, [focusOnInit]);

  useEffect(() => {
    if (initialSearchValue) {
      setValue(initialSearchValue);
    }
  }, [initialSearchValue]);

  return (
    <div className={styles.TableSearchBox}>
      <input
        ref={inputRef}
        value={value}
        type="text"
        placeholder={searchPlaceholder}
        onChange={handleChange}
        data-cy={'Search Input'}
        aria-label={'Search Input'}
      />
      <div
        className={cn(styles.TableSearchBoxButton, {
          [styles.Clickable]: !!value.trim(),
        })}
        onClick={handleClear}
      >
        {!!value.trim() ? (
          <Image
            src="/assets/icons/crossRounded.svg"
            alt="clear icon"
            width={14}
            height={14}
          />
        ) : (
          <Image
            src="/assets/icons/search.svg"
            alt="search icon"
            width={14}
            height={14}
          />
        )}
      </div>
    </div>
  );
};

TableSearch.defaultProps = {
  onChange: () => {},
};

export default TableSearch;
