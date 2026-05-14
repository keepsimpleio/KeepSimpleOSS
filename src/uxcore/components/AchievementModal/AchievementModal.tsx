import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import uxcatData from '@data/uxcat';

import Modal from '@uxcore/components/Modal';

import styles from './AchievementModal.module.scss';

type AchievementModalProps = {
  icon: string;
  title: string;
  unlockedStatus: string;
  description: string;
  userStatistic: number;
  closeHandler: () => void;
  lockedAchievement?: boolean;
};

const AchievementModal: FC<AchievementModalProps> = ({
  icon,
  title,
  userStatistic,
  description,
  unlockedStatus,
  closeHandler,
  lockedAchievement,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { locked, unlockedTxt, usersHaveThis } = uxcatData[locale];
  const tempStatistics = userStatistic ? userStatistic : 17;

  return (
    <Modal
      onClick={closeHandler}
      removeHeader
      wrapperClassName={styles['wrapper']}
    >
      <div className={styles.content} onClick={closeHandler}>
        <div className={styles.btnWrapper}>
          <Image
            src={'/assets/biases/cross.svg'}
            width={16}
            height={16}
            alt="close"
          />
        </div>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI}${icon}`}
          alt={title}
          width={90}
          height={90}
          className={cn({
            [styles.locked]: lockedAchievement,
          })}
        />
        <h4 className={styles.title}> {title}</h4>
        <span className={styles.unlockedStatus}>
          {' '}
          ({unlockedStatus ? `${unlockedTxt}  ${unlockedStatus}` : locked})
        </span>
        <p className={styles.description}> {description}</p>
        <span className={styles.statistics}>
          {`${tempStatistics}${usersHaveThis}`}{' '}
        </span>
      </div>
    </Modal>
  );
};

export default AchievementModal;
