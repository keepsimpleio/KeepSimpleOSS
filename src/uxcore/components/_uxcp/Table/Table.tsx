import React, { Fragment, ReactNode } from 'react';

import Tooltip from '@uxcore/components/Tooltip';

import styles from './Table.module.scss';

type TableProps = {
  children?: ReactNode;
  button?: ReactNode;
  titles?: {
    title: string;
    toolTipContent: string;
  }[];
  id?: string;
  bias?: string;
  method?: string;
  reason?: string;
  instruction?: string;
  tableContent: {
    id: number;
    name: string;
    reason: string;
    method: string;
    title: string;
    instruction: string;
    descriptionOfBias: string;
  }[];
  createDecisionTable?: boolean;
  setShow?: (show: boolean) => void;
  setSelectedId?: (id: string) => void;
};

const Table = ({ titles, tableContent }: TableProps) => {
  return (
    <div className="table-responsive">
      <table className={styles.table}>
        <thead>
          <tr>
            {titles.map((el, key) => {
              return (
                <th key={key}>
                  <Tooltip content={el.toolTipContent}>{el.title}</Tooltip>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableContent.map((val, key) => {
            return (
              <Fragment key={key}>
                <tr>
                  <td>
                    <p className={styles.tableText}>{val.instruction}</p>
                  </td>
                  <td>
                    <p className={styles.tableText}>{val.title}</p>
                  </td>
                  <td>
                    <p className={styles.tableText}>{val.reason}</p>
                  </td>
                  <td>
                    <p className={styles.tableText}>{val.method}</p>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
