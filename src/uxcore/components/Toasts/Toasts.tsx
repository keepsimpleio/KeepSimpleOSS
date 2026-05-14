import { useRouter } from 'next/router';
import { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Slide, toast, ToastContainer } from 'react-toastify';

import { TRouter } from '@uxcore/local-types/global';

import { SendNotification } from '@uxcore/api/uxcat/notification';

import testResult from '@uxcore/data/uxcat/testResult';

import BadgeBox from '@uxcore/components/BadgeBox';

import 'react-toastify/dist/ReactToastify.css';

type ToastsProps = {
  accessToken: string;
  notificationsData: any;
  isKonamiCodeActive?: boolean;
};

const Toasts: FC<ToastsProps> = ({
  accessToken,
  notificationsData,
  isKonamiCodeActive,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const [closedBadgeIds, setClosedBadgeIds] = useState([]);
  const [displayedToasts, setDisplayedToasts] = useState([]);

  const { achievementUnlocked } = testResult[locale];

  const closeAchievementBadge = (slug, id) => {
    SendNotification(accessToken, id, slug, true).then(r => r);
    setClosedBadgeIds(prevIds => [...prevIds, id]);
  };

  const showToast = (achievement, index) => {
    setTimeout(
      () => {
        const toastId = toast(
          <BadgeBox
            key={achievement.slug}
            title={achievementUnlocked}
            badgeName={achievement.name}
            imgSrc={achievement.icon?.url}
          />,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: false,
            autoClose: index === 0 ? 4500 : 5000 + index * 2000,
            pauseOnHover: true,
            closeButton: false,
            transition: Slide,
            onClick: () =>
              !isKonamiCodeActive
                ? closeAchievementBadge(achievement.slug, achievement.newId)
                : null,
            onClose: () => {
              if (toast.isActive(toastId)) {
                return;
              }
              !isKonamiCodeActive
                ? closeAchievementBadge(achievement.slug, achievement.newId)
                : null;
            },
          },
        );
      },
      index === 0 ? 1000 : index * 2000,
    );
  };

  useEffect(() => {
    if (notificationsData) {
      notificationsData
        .filter(
          achievement =>
            !closedBadgeIds.includes(achievement.id) &&
            !displayedToasts.includes(achievement.id),
        )
        .forEach((achievement, index) => {
          showToast(achievement, index);
          setDisplayedToasts(prev => [...prev, achievement.id]);
        });
    }
  }, [notificationsData, closedBadgeIds, displayedToasts]);

  return <ToastContainer />;
};

export default Toasts;
