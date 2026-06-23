import { uxCatLevels } from '@uxcore/local-types/uxcat-types/types';

export const findLevelDetail = (
  userLevel: number,
  allLevels: any[],
): any | undefined => {
  return allLevels?.find(detail => {
    if (detail && detail.attributes) {
      return detail.attributes.level === userLevel;
    }
  });
};

export function normalizeUserData(data) {
  if (data && data.user) {
    return data.user;
  }
  return data;
}

export const isLevelMilestone = (level, mileStoneLevel) => {
  const milestoneLevels = [11, 12, 13, 14, 15];

  if (!milestoneLevels.includes(level)) {
    return false;
  }

  const levelIndex = milestoneLevels.indexOf(level);
  const m2Index = milestoneLevels.indexOf(mileStoneLevel);

  return levelIndex >= m2Index;
};

export const formatDate = isoString => {
  const date = new Date(isoString);
  if (date.toString() === 'Invalid Date') {
    return undefined;
  }
  return date.toLocaleDateString('en-GB').replace(/\//g, '.');
};

export const getPassedLevels = (
  previousPoints: number,
  currentPoints: number,
  uxCatLevels: uxCatLevels[],
): number[] => {
  const levels = Object.keys(uxCatLevels).map(Number);

  return levels.filter(level => {
    const pointsForLevel = uxCatLevels[level.toString()];
    return pointsForLevel > previousPoints && pointsForLevel <= currentPoints;
  });
};

export const cleanTitle = (title: string): string => {
  return title.replace(/#\d+\s*/, '');
};

export const getPointsToNextLevel = (
  uxCatLevels: uxCatLevels[],
  currentLevel: number,
  currentPoints: number,
  level: number,
): string => {
  const nextLevelPoints = uxCatLevels?.[level + 1];
  if (currentLevel === level) {
    return `${currentPoints}/${nextLevelPoints || 0}`;
  }
  return `0/${nextLevelPoints || 0}`;
};

export const getNotifiedAchievements = (achievementList, notificationsData) =>
  !!achievementList &&
  achievementList
    ?.filter(achievement => {
      return !!notificationsData
        ? notificationsData?.some(
            notification => notification.achievementName === achievement?.slug,
          )
        : null;
    })
    ?.map(achievement => {
      const matchingNotificationId = notificationsData?.find(
        notification => notification.achievementName === achievement?.slug,
      )?.id;
      return { newId: matchingNotificationId, ...achievement };
    });

export const getBiasNumber = (input: string): string | null => {
  const match = input.match(/#(\d+)/);
  return match ? match[1] : null;
};

export const sortAchievements = achievements => {
  return achievements.sort((a, b) => {
    // If 'a' has 'unlockedAt' and 'b' doesn't, 'a' comes first
    if (a?.unlockedAt && !b?.unlockedAt) return -1;
    // If 'b' has 'unlockedAt' and 'a' doesn't, 'b' comes first
    if (!a?.unlockedAt && b?.unlockedAt) return 1;
    // If both or neither have 'unlockedAt', maintain their order
    return 0;
  });
};

export const findAchievementListByType = (achievementsList, type: string) => {
  const list = achievementsList.filter(
    achievement => achievement.collection_type === type,
  );
  return list;
};
export const findAchievementListBySubType = (
  achievementsList,
  type: string,
) => {
  const list = achievementsList.filter(
    achievement => achievement.type === type,
  );
  return list;
};

export const enhanceAchievementsWithGroups = (
  achievements,
  userAchievements,
) => {
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const match = achievement.slug.match(/(_BRONZE|_SILVER|_GOLD)/);
    if (match) {
      const baseName = achievement.slug.replace(/(_BRONZE|_SILVER|_GOLD)/, '');

      if (!acc[baseName])
        acc[baseName] = { BRONZE: null, SILVER: null, GOLD: null };

      if (achievement.slug.includes('BRONZE'))
        acc[baseName].BRONZE = achievement;
      if (achievement.slug.includes('SILVER'))
        acc[baseName].SILVER = achievement;
      if (achievement.slug.includes('GOLD')) acc[baseName].GOLD = achievement;
    } else {
      acc[achievement.slug] = achievement;
    }

    return acc;
  }, {});

  return Object.values(groupedAchievements).map(achievementGroup => {
    if (
      // @ts-ignore
      achievementGroup.BRONZE ||
      // @ts-ignore
      achievementGroup.SILVER ||
      // @ts-ignore
      achievementGroup.GOLD
    ) {
      // @ts-ignore
      const { BRONZE, SILVER, GOLD } = achievementGroup;

      const achievedUserAchievements =
        userAchievements?.filter(userAch =>
          [BRONZE?.slug, SILVER?.slug, GOLD?.slug].includes(userAch.name),
        ) || [];

      if (achievedUserAchievements.length > 0) {
        if (
          GOLD &&
          achievedUserAchievements.some(userAch => userAch.name === GOLD.slug)
        ) {
          return {
            ...GOLD,
            unlockedAt: formatDate(
              achievedUserAchievements.find(
                userAch => userAch.name === GOLD.slug,
              ).unlockedAt,
            ),
          };
        } else if (
          SILVER &&
          achievedUserAchievements.some(userAch => userAch.name === SILVER.slug)
        ) {
          return {
            ...SILVER,
            unlockedAt: formatDate(
              achievedUserAchievements.find(
                userAch => userAch.name === SILVER.slug,
              ).unlockedAt,
            ),
          };
        } else if (
          BRONZE &&
          achievedUserAchievements.some(userAch => userAch.name === BRONZE.slug)
        ) {
          return {
            ...BRONZE,
            unlockedAt: formatDate(
              achievedUserAchievements.find(
                userAch => userAch.name === BRONZE.slug,
              ).unlockedAt,
            ),
          };
        }
      }

      return BRONZE || SILVER || GOLD;
    } else {
      // Handling non-grouped achievements
      const userAchievement = userAchievements?.find(
        // @ts-ignore
        userAch => userAch.name === achievementGroup.slug,
      );
      return userAchievement
        ? {
            // @ts-ignore
            ...achievementGroup,
            unlockedAt: formatDate(userAchievement.unlockedAt),
          }
        : achievementGroup;
    }
  });
};

export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const linkedInRegex =
  /^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/|lnkd\.in\/)[a-zA-Z0-9-]{3,30}\/?$/;

export const usernameRegex = /^(?!.*[&%:;*|></\\#?"=])[^\s]{3,30}$/;
