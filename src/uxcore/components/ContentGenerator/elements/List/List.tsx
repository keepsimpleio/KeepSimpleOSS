import { FC } from 'react';

import Collection from '../Collection';

type TList = {
  items: any;
  styles: any;
  isNumList?: boolean;
};

const UlWrapper: FC<{ className: string; children?: any }> = ({
  className,
  children,
}) => <ul className={className}>{children}</ul>;
const OlWrapper: FC<{ className: string; children?: any }> = ({
  className,
  children,
}) => <ol className={className}>{children}</ol>;

const List: FC<TList> = ({ items, styles, isNumList }) => {
  const Wrapper = isNumList ? OlWrapper : UlWrapper;

  return (
    <Wrapper className={styles.ul}>
      {items.map((item: any, index: number) => {
        let content;

        switch (item.type) {
          case undefined:
            content = <>{item}</>;
            break;
          case 'collection':
            content = (
              <Collection
                styles={styles}
                data={item.content}
                collectionType={item.collectionType}
              />
            );
            break;
          default:
            console.log('error', item);
            break;
        }

        return (
          <li className={styles.li} key={index}>
            {content}
          </li>
        );
      })}
    </Wrapper>
  );
};

export default List;
