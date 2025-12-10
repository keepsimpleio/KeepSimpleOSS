import { FC } from 'react';
import cn from 'classnames';
import type { TRouter } from '@local-types/global';
import { useInView } from 'react-intersection-observer';

import SupporterContainer from '@components/SupporterContainer';

import { useRouter } from 'next/router';

import styles from './Supporters.module.scss';
import { useIsWidthLessThan } from '@hooks/useScreenSize';

type Supporter = {
  id: number;
  name: string;
  quote: string;
  about: string;

  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
};

type SupportersProps = {
  supporters: Supporter[];
  darkTheme?: boolean;
  title?: string;
};

const Supporters: FC<SupportersProps> = ({ supporters, darkTheme, title }) => {
  const router = useRouter();
  const isSmallScreen = useIsWidthLessThan(768);
  const { locale } = router as TRouter;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: isSmallScreen ? 0.1 : 0.2,
  });

  return (
    <section
      ref={ref}
      className={cn(styles.supporters, {
        [styles.darkTheme]: darkTheme,
        [styles.russianView]: locale === 'ru',
      })}
    >
      <h2
        className={cn(styles.title, {
          [styles.inViewTitle]: inView,
        })}
      >
        {title}
      </h2>
      <div className={styles.wrapper}>
        {supporters.map((supporter: any, index: number) => (
          <SupporterContainer
            darkTheme={darkTheme}
            key={index}
            quote={supporter.quote}
            about={supporter?.about}
            name={supporter.name}
            image={supporter.image.data.attributes.url}
            inView={inView}
            animationDelay={index * 0.1 + 0.4}
          />
        ))}
      </div>
    </section>
  );
};

export default Supporters;
