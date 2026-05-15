import ContentParser from '@uxcore/components/ContentParser';
import useGlobals from '@uxcore/hooks/useGlobals';
import cn from 'classnames';
import type { FC } from 'react';
import { Fragment } from 'react';

import styles from './ContentHandler.module.scss';

type TContentHandler = {
  data: any;
  locale?: string;
};

const ContentHandler: FC<TContentHandler> = ({ data, locale }) => {
  const { isDarkTheme } = useGlobals()[1];

  return (
    <Fragment>
      <div
        className={cn(styles.contentHandlerContainer, {
          [styles.darkTheme]: isDarkTheme,
          [styles.ruVersion]: locale === 'ru',
        })}
      >
        <ContentParser data={data.content} styles={styles} usePTag={false} />
      </div>
    </Fragment>
  );
};

export default ContentHandler;
