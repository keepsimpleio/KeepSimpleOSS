import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { TRouter } from '@uxcore/local-types/global';

import Button from '@uxcore/components/Button';
import UXCatPageTitle from '@uxcore/components/UXCatPageTitle';

import styles from './AchievementContainer.module.scss';

const Achievement = dynamic(() => import('@uxcore/components/Achievement'), {
  ssr: false,
});

type AchievementContainerProps = {
  openLoginModal?: () => void;
  isLoggedIn?: boolean;
  username?: string;
  achievementTxt?: string;
  achievements?: any;
  showAchievementsTxt?: string;
  loading?: boolean;
  codeIsActivated?: boolean;
  activatedDuration?: number;
};

const AchievementContainer: FC<AchievementContainerProps> = ({
  openLoginModal,
  isLoggedIn,
  username,
  achievementTxt,
  showAchievementsTxt,
  achievements,
  loading,
  codeIsActivated,
  activatedDuration,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const title = currentLocale ? 'Достижения' : 'Achievements';
  const skeletonQuantity = isLoggedIn ? 5 : 10;
  const [randomDelays, setRandomDelays] = useState([]);

  const showAllAchievements = () => {
    if (isLoggedIn) {
      router.push(`/user/${username}`);
      localStorage.setItem('showAllAchievements', 'true');
    } else {
      openLoginModal();
    }
  };

  const generateRandomDelays = () => {
    return achievements.map(() => Math.random() * (6 - 1) + 1);
  };

  useEffect(() => {
    if (achievements) {
      setRandomDelays(generateRandomDelays());

      const intervalId = setInterval(() => {
        setRandomDelays(generateRandomDelays());
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [achievements]);

  return (
    <>
      <UXCatPageTitle title={achievementTxt ? achievementTxt : title} />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {loading
            ? Array.from({ length: skeletonQuantity }).map((_, index) => (
                <div className={styles.skeletonWrapper} key={index}>
                  <Skeleton width={100} height={100} circle />
                  <Skeleton width={100} height={20} />
                </div>
              ))
            : achievements &&
              achievements.map((achievement, index) => (
                <div className={styles.achievementWrapper} key={index}>
                  <Achievement
                    slug={achievement.slug}
                    activatedDuration={activatedDuration}
                    title={achievement.name}
                    description={achievement.description}
                    statistics={achievement.percentage}
                    showTitle
                    tooltipId={`achievement-${index}`}
                    locked={!achievement?.unlockedAt}
                    unlockedStatus={achievement?.unlockedAt}
                    icon={achievement?.icon.url}
                    unlocked={!!achievement?.unlockedAt}
                    codeIsActivated={codeIsActivated}
                    flipDelay={index === 0 ? index - 0.4 : index - 0.6}
                    randomDelay={randomDelays[index * 500]}
                    animated
                    delay={codeIsActivated && index - 0.6}
                  />
                </div>
              ))}
        </div>
        <div className={styles.btnWrapper}>
          <Button
            label={
              showAchievementsTxt
                ? showAchievementsTxt
                : 'Show all achievements'
            }
            onClick={showAllAchievements}
            type={'orange_outline'}
            dataCy={'show-all-achievements-btn'}
          />
        </div>
      </div>
    </>
  );
};

export default AchievementContainer;
