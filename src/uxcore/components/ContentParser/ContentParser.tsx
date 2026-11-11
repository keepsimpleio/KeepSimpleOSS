import useContentType from '@uxcore/hooks/useContentType';
import unescape from 'lodash.unescape';
import { FC, Fragment, memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';

// Persona text is saved by visitors and shown on public pages, so raw HTML is
// filtered to the tags our content uses. Custom tags are the ones
// useContentType renders.
const SAFE_STYLE = /^(?!.*(position|url\s*\(|expression|@import)).*$/i;
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'u',
    'span',
    'accordion',
    'download',
    'trello',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] ?? []),
      'className',
      ['style', SAFE_STYLE],
    ],
    accordion: ['title', 'file', 'open'],
    download: ['url'],
    trello: ['url'],
  },
  protocols: {
    ...defaultSchema.protocols,
    url: ['http', 'https'],
  },
};

type ContentParserProps = {
  data: any;
  styles?: any;
  usePTag?: boolean;
};

const ContentParser: FC<ContentParserProps> = ({
  data,
  styles = {},
  usePTag = true,
}) => {
  const { componentList } = useContentType(styles, usePTag);
  const modifiedData = useMemo(
    () => unescape(data).replaceAll('</accordion><br>', '</accordion>'),
    [data],
  );

  if (!data) return null;

  return (
    <Fragment>
      <ReactMarkdown
        className={styles.content}
        components={componentList}
        remarkPlugins={[[remarkBreaks]]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
      >
        {modifiedData}
      </ReactMarkdown>
    </Fragment>
  );
};

export default memo(ContentParser);
