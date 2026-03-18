import cn from 'classnames';
import { FC } from 'react';

import { TableProps } from './Table.types';

import styles from './Table.module.scss';

const Table: FC<TableProps> = ({
  headerRows,
  rows,
  isSupplementTable,
  locale,
}) => {
  // TODO: Check naming here, they should be matchable for 2 different tables
  return (
    <table
      className={cn(styles.table, {
        [styles.supplementTable]: isSupplementTable,
        [styles.tableRu]: locale === 'ru',
      })}
    >
      <thead className={styles.header}>
        <tr className={styles.headerRow}>
          {headerRows.map((headline, key) => (
            <th key={key} className={styles.headline}>
              {headline}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows?.map(row => (
          <tr key={row.id} className={styles.tr}>
            <td className={styles.factor}>{row.factor || row.area}</td>
            <td className={styles.secondTd}>
              {row['no structure'] || row['no supplements']}
            </td>
            <td className={styles.thirdTd}>
              {row['my structure'] || row['with supplements (generic)']}
            </td>
            <td className={styles.fourthTd}>
              {row['fully optimized'] ||
                row['tailored optimized (bloodwork-driven)']}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
