import { FC } from 'react';
import styles from './Hero.module.scss';
import Heading from '@components/Heading';

const Hero: FC = ({}) => {
  return (
    <section className={styles.hero}>
      <Heading text={'practical longevity protocol'} />
      <Heading
        text={'BY WOLF ALEXANYAN'}
        Tag={'h2'}
        showRightIcon={false}
        showLeftIcon={false}
      />
    </section>
  );
};

export default Hero;
