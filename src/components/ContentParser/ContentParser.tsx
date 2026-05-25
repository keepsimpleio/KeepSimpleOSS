import unescape from 'lodash.unescape';
import { FC, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';

import useContentType from '@hooks/useContentType';

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
    <>
      <ReactMarkdown
        className={styles.content}
        components={componentList}
        remarkPlugins={[[remarkBreaks]]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {modifiedData}
      </ReactMarkdown>
    </>
  );
};

export default ContentParser;
