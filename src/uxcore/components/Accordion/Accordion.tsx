import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import useMobile from '@uxcore/hooks/useMobile';

import ccordionIntl from '@data/accordion';

import styles from './Accordion.module.scss';

type AccordionProps = {
  dataId?: string | number;
  title: string;
  isOpen: boolean;
  file?: string;
  onToggleClick?: (e?: any) => void;
  isDarkTheme?: boolean;
  children?: any;
  isArticle?: boolean;
  className?: string;
};

const Accordion: FC<AccordionProps> = ({
  dataId,
  title,
  onToggleClick,
  isOpen,
  file,
  children,
  isDarkTheme,
  isArticle,
  className,
}) => {
  const router = useRouter();
  const { isMobile } = useMobile()[1];
  const { locale } = router as TRouter;
  const { downloadButtonLabel } = ccordionIntl[locale];

  const darkThemeIcon = isDarkTheme ? '-dark' : '';
  const downloadIcon = !!isMobile ? 'white' : 'blue';

  return (
    <div
      className={cn(styles.Accordion, className, {
        [styles.Opened]: isOpen,
        [styles.darkTheme]: isDarkTheme,
      })}
      data-cy="accordion"
    >
      <div
        data-id={dataId}
        className={styles.Title}
        onClick={isMobile ? null : onToggleClick}
        data-cy={'open-close-accordion-button'}
      >
        <Image
          src={`/assets/icons/caret${darkThemeIcon}.svg`}
          onClick={isMobile ? onToggleClick : null}
          alt="arrow down"
          width="7"
          height="12"
        />
        <span
          data-id={dataId}
          onClick={isMobile ? onToggleClick : null}
          className={cn(styles.Span, {
            [styles.articleTitle]: isArticle,
          })}
        >
          {title}
        </span>
        {file && (
          <Link
            href={file}
            className={styles.DownloadButton}
            download
            onClick={e => e.stopPropagation()}
            target="_blank"
          >
            <Image
              src={`/assets/icons/download-${downloadIcon}.svg`}
              alt="download icon"
              width={13}
              height={12}
            />
            <span>{downloadButtonLabel}</span>
          </Link>
        )}
      </div>
      <div className={styles.Content} data-cy={'accordion-content'}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
