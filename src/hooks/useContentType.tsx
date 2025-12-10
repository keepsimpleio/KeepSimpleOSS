import Accordion from '@components/Accordion';
import ContentParser from '@components/ContentParser';
import { useState, useCallback, useMemo } from 'react';
import ReactDomServer from 'react-dom/server';
import {
  Div,
  Link,
  Span,
  Image,
  H1,
  P,
} from '@components/ContentGenerator/elements';
import useGlobals from './useGlobals';
import cn from 'classnames';

const useContentType = (styles: any, usePTag: boolean) => {
  const { isDarkTheme } = useGlobals()[1];
  const componentList = {
    h1: (props: any) => <H1 styles={styles}>{props.children}</H1>,
    p: usePTag
      ? (props: any) => <P styles={styles}>{props.children}</P>
      : (props: any) => <Div styles={styles}>{props.children}</Div>,
    a: (props: any) => {
      return (
        <Link
          styles={styles}
          data={{ target: '_blank', title: props.children, href: props.href }}
        />
      );
    },

    blockquote: (props: any) => <Span styles={styles}>{props.children}</Span>,
    /* eslint-disable react-hooks/rules-of-hooks */
    accordion: ({ title, file, open, children }: any) => {
      const [isOpen, setIsOpen] = useState(open === 'true' || false);
      const onToggleClick = useCallback(() => setIsOpen(prev => !prev), []);
      return (
        <Accordion
          title={title}
          isArticle
          isOpen={isOpen}
          onToggleClick={onToggleClick}
          file={file && `${process.env.NEXT_PUBLIC_STRAPI}${file}`}
        >
          <ContentParser
            usePTag={false}
            data={children
              .map((child: any) => {
                if (typeof child === 'string') return child;
                else if (typeof child === 'object' && child.type === 'br')
                  return '\n';
                else if (
                  typeof child === 'object' &&
                  child.key.includes('trello')
                ) {
                  const { url, children: innerText } = child.props;
                  return `<trello url="${url}">${innerText[0]}</trello>`;
                } else if (
                  typeof child === 'object' &&
                  child.key.includes('download')
                ) {
                  const { url, children: innerText } = child.props;
                  return `<download url="${url}">${innerText[0]}</download>`;
                } else if (
                  typeof child === 'object' &&
                  child.key.includes('a')
                ) {
                  const { props } = child;
                  const element = ReactDomServer.renderToStaticMarkup(
                    <a {...props} />,
                  );
                  return element;
                } else if (
                  typeof child === 'object' &&
                  child.key.includes('img')
                ) {
                  const { props } = child;
                  const element = ReactDomServer.renderToStaticMarkup(
                    <img {...props} />,
                  );
                  return element;
                } else if (typeof child === 'object')
                  return ReactDomServer.renderToStaticMarkup(child);
                return '';
              })
              .join('')}
            styles={styles}
          />
        </Accordion>
      );
    },
    li: (props: any) => <li className={styles.li}>{props.children}</li>,
    ul: (props: any) => <ul className={styles.ul}>{props.children}</ul>,
    img: (props: any) => {
      return (
        <Image
          styles={styles}
          src={
            props.src.includes(process.env.NEXT_PUBLIC_STRAPI)
              ? props.src
              : `${process.env.NEXT_PUBLIC_STRAPI}${props.src}`
          }
          alt={props.alt}
        />
      );
    },
    download: ({ url, children }: any) => {
      const src = useMemo(
        () =>
          `/keepsimple_/assets/icons/download-${isDarkTheme ? 'white' : 'blue'}.svg`,
        [isDarkTheme],
      );

      return (
        <a
          href={url || ''}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={cn(styles.DownloadButton, {
            [styles.darkTheme]: isDarkTheme,
          })}
        >
          <img src={src} alt="theme" />
          <span>{children}</span>
        </a>
      );
    },
    trello: ({ url, children }: any) => {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(styles.TrelloButton, {
            [styles.darkTheme]: isDarkTheme,
          })}
        >
          <img src="/keepsimple_/assets/icons/trello.svg" alt="trello icon" />
          <span>{children}</span>
        </a>
      );
    },
  };
  return {
    componentList,
  };
};

export default useContentType;
