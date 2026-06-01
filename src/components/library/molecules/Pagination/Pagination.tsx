import classNames from 'classnames';
import React, { JSX, useState } from 'react';

import { ArrowIcon } from '@icons/library/svg';

import { Button, ButtonType } from '../Button';
import type { PaginationProps } from './Pagination.types';

import styles from './Pagination.module.scss';

export function Pagination(props: PaginationProps): JSX.Element {
  const { count, onChange } = props;

  const [page, setPage] = useState(1);

  const handleChange = (newPage: number) => {
    if (newPage < 1 || newPage > count || newPage === page) return;
    setPage(newPage);
    onChange(newPage);
  };

  const getPageItems = () => {
    const pages = [];

    if (count <= 5) {
      return Array.from({ length: count }, (_, i) => i + 1);
    }

    if (page <= 3) {
      pages.push(1, 2, 3, '...', count);
    } else if (page >= count - 2) {
      pages.push(1, '...', count - 2, count - 1, count);
    } else {
      pages.push(1, '...', page, '...', count);
    }

    return pages;
  };

  const renderPages = () => {
    const items = getPageItems();

    return items.map((item, idx) => {
      if (item === '...') {
        return (
          <Button
            key={`ellipsis-${idx}`}
            className={classNames(styles.page, styles.ellipsis)}
            type={ButtonType.Secondary}
            label="..."
            ariaLabel="ellipsis"
            onClick={() => {}}
          />
        );
      }

      return (
        <Button
          key={item}
          className={classNames(styles.page, {
            [styles.active]: page === item,
          })}
          onClick={() => handleChange(Number(item))}
          type={ButtonType.Secondary}
          ariaLabel={`Go to page ${item}`}
          label={`${item}`}
        />
      );
    });
  };

  return (
    <div className={styles.pagination} aria-label="Pagination">
      <Button
        className={classNames(styles.page, styles.arrow)}
        disabled={page === 1}
        onClick={() => handleChange(page - 1)}
        type={ButtonType.Secondary}
        Icon={<ArrowIcon />}
        ariaLabel="Previous page"
      />
      {renderPages()}
      <Button
        className={classNames(styles.page, styles.arrow)}
        disabled={page === count}
        onClick={() => handleChange(page + 1)}
        type={ButtonType.Secondary}
        Icon={<ArrowIcon />}
        ariaLabel="Next page"
      />
    </div>
  );
}
