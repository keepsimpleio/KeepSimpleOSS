import { FC } from 'react';
import cn from 'classnames';

import styles from './SupporterContainer.module.scss';

type SupporterContainerProps = {
  quote: string;
  name: string;
  about: string;
  image: string;
  darkTheme?: boolean;
  inView?: boolean;
  animationDelay?: number;
};

const SupporterContainer: FC<SupporterContainerProps> = ({
  quote,
  name,
  about,
  image,
  darkTheme,
  inView,
  animationDelay,
}) => {
  return (
    <div
      className={cn(styles.gradientBg, {
        [styles.darkTheme]: darkTheme,
        [styles.inViewWrapper]: inView,
      })}
      style={{
        animationDelay: inView ? `${animationDelay}s` : '0s',
      }}
    >
      <div className={styles.wrapper}>
        <div className={styles.quoteWrapper}>
          <span className={styles.quoteMark}>“</span>
          <div
            className={styles.quote}
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        </div>
        <div className={styles.supporterInfo}>
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI}${image}`}
            alt={name}
            width={117}
            height={117}
            className={styles.image}
          />
          <h4 className={styles.name}>{name} </h4>
          <div
            className={styles.about}
            dangerouslySetInnerHTML={{ __html: about }}
          />
        </div>
      </div>
    </div>
  );
};

export default SupporterContainer;
