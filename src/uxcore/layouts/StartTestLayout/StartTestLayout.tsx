import cn from 'classnames';
import dynamic from 'next/dynamic';
import { FC } from 'react';

import UxCatLogo from '@uxcore/assets/icons/UxCatLogo';

import Button from '@uxcore/components/Button';

import styles from './StartTestLayout.module.scss';

const Modal = dynamic(() => import('@uxcore/components/Modal'), {
  ssr: false,
});

type StartTestLayoutProps = {
  testDuration: string;
  description1: string;
  goodLuckTxt: string;
  btnTxt: string;
  handleStartTest: () => void;
  disabled?: boolean;
  description2?: string;
};
const StartTestLayout: FC<StartTestLayoutProps> = ({
  testDuration,
  handleStartTest,
  description1,
  description2,
  goodLuckTxt,
  btnTxt,
  disabled,
}) => {
  return (
    <>
      <section className={styles.startTestWrapper}>
        <span className={styles.duration}>{testDuration}</span>
        <img
          src={'/assets/uxcat/img_1.png'}
          alt="background"
          className={styles.backgroundImg}
        />
        <Modal
          className={styles['modal']}
          onClick={handleStartTest}
          removeHeader
          wrapperClassName={styles['modalWrapper']}
          fullSizeMobile
          disableBackgroundClick
        >
          <div className={styles.catLogo}>
            <UxCatLogo />
          </div>

          <h1 className={styles.title}> uxCAT </h1>
          <p className={styles.description}> {description1} </p>
          <p className={styles.description}> {description2} </p>
          <p className={cn(styles.description, styles.goodLuckTxt)}>
            {goodLuckTxt}
          </p>
          <div className={styles.btnWrapper}>
            <Button
              label={btnTxt}
              onClick={handleStartTest}
              type={'orange'}
              isBig
              disabled={disabled}
            />
          </div>
        </Modal>
      </section>
    </>
  );
};

export default StartTestLayout;
