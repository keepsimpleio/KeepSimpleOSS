import Link from '@uxcore/components/NextLink';
import { FC, Fragment } from 'react';

// @ts-ignore
const P = ({ children }) => <p>{children}</p>;
// @ts-ignore
const ContentLink = ({ href, title }) => (
  <Link href={href}>
    <a target="_blank">{title}</a>
  </Link>
);
// @ts-ignore
const I = ({ text }) => <i>{text}</i>;
// @ts-ignore
const U = ({ text }) => <u>{text}</u>;
// @ts-ignore
const Ol = ({ items }) => (
  <ol>
    {items.map((item: string, index: number) => (
      <li key={index}>{item}</li>
    ))}
  </ol>
);
// @ts-ignore
const Ul = ({ items }) => (
  <ul>
    {items.map((item: string, index: number) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

interface UXCoreContentGeneratorProps {
  data: any;
}

const UXCoreContentGenerator: FC<UXCoreContentGeneratorProps> = ({ data }) => {
  return (
    <Fragment>
      {data.map((dataItem: any, index: number) => {
        if (dataItem.type) {
          const { type, ...listProps } = dataItem;

          switch (type) {
            case 'list':
              return <Ul key={index} {...listProps} />;
            case 'numlist':
              return <Ol key={index} {...listProps} />;
          }
        }

        if (Array.isArray(dataItem)) {
          return (
            <P key={index}>
              {dataItem.map((el, elIndex) => {
                if (typeof el === 'object') {
                  const { type, ...restProps } = el;

                  switch (type) {
                    case 'link':
                      return <ContentLink key={elIndex} {...restProps} />;
                    case 'italic':
                      return <I key={elIndex} {...restProps} />;
                    case 'underline':
                      return <U key={elIndex} {...restProps} />;
                    default:
                      console.log('error', el);
                      return null;
                  }
                }
                return <Fragment key={elIndex}>{el}</Fragment>;
              })}
            </P>
          );
        }

        return <P key={index}>{dataItem}</P>;
      })}
    </Fragment>
  );
};

export default UXCoreContentGenerator;
