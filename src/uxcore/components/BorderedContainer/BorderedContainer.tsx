import cn from 'classnames';
import { FC } from 'react';

import styles from './BorderedContainer.module.scss';

interface contentItems {
  title: string;
  description: string;
  details: string[];
  exampleCode?: string;
}

interface BorderedContainerProps {
  content: contentItems[];
  className?: string;
}

const BorderedContainer: FC<BorderedContainerProps> = ({
  ...BorderedContainerProps
}) => {
  const { content, className } = BorderedContainerProps;

  return (
    <div>
      {content?.map((el, key) => {
        return (
          <div className={cn(styles.container, className)} key={key}>
            <h5 className={styles.title}> {el.title} </h5>
            <p className={styles.description}> {el.description}</p>
            <ul className={styles.details}>
              {el?.details?.map((detail, id) => {
                return <li key={id}>{detail} </li>;
              })}
            </ul>
            {el.exampleCode && (
              <p className={styles.exampleCode}> Example: {el.exampleCode} </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default BorderedContainer;
