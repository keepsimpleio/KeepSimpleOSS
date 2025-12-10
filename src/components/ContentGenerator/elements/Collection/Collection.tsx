import { Fragment, FC } from 'react';

import P from '../P';
import Link from '../Link';
import Span from '../Span';
import List from '../List';
import Italic from '../Italic';
import Bold from '../Bold';
import H1 from '../H1';
import H4 from '../H4';
import Underline from '../Underline';

type CollectionProps = {
  styles: any;
  data: any[];
  collectionType?: any;
};

const Collection: FC<CollectionProps> = ({ styles, data, collectionType }) => {
  let Wrapper = P;
  let wrapperProps: any = {
    styles,
  };

  if (collectionType === 'quote') Wrapper = Span;
  if (collectionType === 'italic') Wrapper = Italic;
  if (collectionType === 'bold') Wrapper = Bold;
  if (collectionType === 'title') Wrapper = H1;
  if (collectionType === 'heading') Wrapper = H4;
  if (collectionType === 'underline') Wrapper = Underline;
  if (collectionType === 'pure') Wrapper = Fragment;

  if (['heading', 'pure', 'underline'].includes(collectionType)) {
    wrapperProps = {};
  }

  return (
    <Wrapper {...wrapperProps}>
      {data.map((colEl: any, elIndex: number) => {
        switch (colEl.type) {
          case undefined:
            return <Fragment key={elIndex}>{colEl}</Fragment>;
          case 'link':
            return <Link key={elIndex} styles={styles} data={colEl} />;
          case 'p':
            return (
              <P key={elIndex} styles={styles}>
                {colEl.content}
              </P>
            );
          case 'list':
            return <List key={elIndex} styles={styles} items={colEl.items} />;
          case 'bold':
            return <b key={elIndex}>{colEl.content}</b>;
          case 'italic':
            return <Italic key={elIndex}>{colEl.content}</Italic>;
          case 'underline':
            return <Underline key={elIndex}>{colEl.content}</Underline>;
          case 'break':
            return <br key={elIndex} />;
          case 'collection':
            return (
              <Collection
                key={elIndex}
                styles={styles}
                data={colEl.content}
                collectionType={colEl.collectionType}
              />
            );
          default:
            console.log('error', colEl);
            break;
        }
      })}
    </Wrapper>
  );
};

export default Collection;
