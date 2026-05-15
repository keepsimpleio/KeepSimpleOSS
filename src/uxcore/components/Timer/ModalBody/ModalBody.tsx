import Button from '@uxcore/components/Button';
import Image from 'next/image';
import { FC } from 'react';

import styles from './ModalBody.module.scss';

type ModalBodyProps = {
  timeIsUp: string;
  showResults: string;
  goToResultsPage: () => void;
};
const ModalBody: FC<ModalBodyProps> = ({
  timeIsUp,
  showResults,
  goToResultsPage,
}) => {
  return (
    <div className={styles.timeIsUp}>
      <div className={styles.modalBody}>
        <Image
          src="/assets/uxcat/time-is-up.jpg"
          width={96}
          height={96}
          alt={'Time is up'}
        />
        <h2 className={styles.title}> {timeIsUp}</h2>
        <Button
          label={showResults}
          onClick={goToResultsPage}
          className={styles['button']}
        />
      </div>
    </div>
  );
};

export default ModalBody;
