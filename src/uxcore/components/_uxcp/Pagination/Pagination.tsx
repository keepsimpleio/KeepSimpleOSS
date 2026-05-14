import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import uxcpLocalization from '@data/uxcp';

import styles from './Pagination.module.scss';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { pageTitle } = uxcpLocalization[locale];

  const handleClick = useCallback(
    e => {
      const { id } = e.currentTarget.dataset;
      const page = Number(id);

      if (page !== currentPage) {
        onChange(page);
      }
    },
    [onChange, currentPage],
  );

  return (
    <div className={styles.Pagination}>
      <div className={styles.Title}>{pageTitle}</div>
      <div className={styles.Pages}>
        {Array(totalPages)
          .fill(true)
          .map((_, index) => {
            const page = index + 1;

            return (
              <div
                key={page}
                data-id={page}
                className={cn(styles.Page, {
                  [styles.Active]: currentPage === page,
                })}
                onClick={handleClick}
              >
                {page}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Pagination;
