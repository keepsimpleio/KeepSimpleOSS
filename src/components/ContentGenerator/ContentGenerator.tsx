import { FC } from 'react';
import { P, List, Collection, Image, Span, Link } from './elements';

type ContentGeneratorProps = {
  data: any;
  styles?: any;
};

const ContentGenerator: FC<ContentGeneratorProps> = ({ data, styles = {} }) => {
  if (!data) return null;

  return (
    <>
      {data.map((item: any, index: number) => {
        switch (item.type) {
          case undefined:
            return (
              <P key={index} styles={styles}>
                {item}
              </P>
            );
          case 'title':
            return <h2 key={index}>{item.content}</h2>;
          case 'imageLink':
            return <Link key={index} styles={styles} data={item} />;
          case 'subtitle':
            return <h3 key={index}>{item.content}</h3>;
          case 'underline':
            return <u key={index}>{item.content}</u>;
          case 'quote':
            return (
              <Span key={index} styles={styles}>
                {item.content}
              </Span>
            );
          case 'list':
          case 'numlist':
            return (
              <List
                key={index}
                isNumList={item.type === 'numlist'}
                styles={styles}
                items={item.items}
              />
            );
          case 'break':
            return <br key={index} />;
          case 'hr':
            return <hr key={index} />;
          case 'collection':
            return (
              <Collection
                key={index}
                styles={styles}
                data={item.content}
                collectionType={item.collectionType}
              />
            );
          case 'image':
            return (
              <Image
                key={index}
                styles={styles}
                src={item.src}
                alt={item.alt}
              />
            );
          default:
            console.log('error', item);
            return null;
        }
      })}
    </>
  );
};

export default ContentGenerator;
