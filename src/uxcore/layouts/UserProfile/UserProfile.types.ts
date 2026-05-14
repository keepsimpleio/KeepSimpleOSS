import {
  AchievementsTypes,
  BgAndCoverImagesTypes,
  BoardContentTypes,
  LevelDetailsTypes,
  StatisticsTypes,
  UserTypes,
  uxCatLevels,
} from '@uxcore/local-types/uxcat-types/types';

export interface UserProfileProps {
  userInfo?: UserTypes;
  dummyBoardContent?: BoardContentTypes[];
  coverImages?: BgAndCoverImagesTypes[];
  backgroundImages?: BgAndCoverImagesTypes[];
  ongoingTest?: boolean;
  privateMode: boolean;
  statistics?: StatisticsTypes[];
  level?: number;
  matchingLevelDetails?: any; // TODO Mary - Add type
  levelsDetails?: LevelDetailsTypes[];
  specialAchievements?: AchievementsTypes[];
  generalAchievements?: AchievementsTypes[];
  setIsAllSelected?: (isAllSelected: boolean) => void;
  levelName?: string;
  receivedAchievementPercentage?: {
    uxCore: number;
    keepSimple: number;
  };
  isLoading?: boolean;
  publicStartTestRef: string;
  finalTestPermission: boolean;
  isLevelMilestone: (level: number, milestone: number) => boolean;
  keepsimpleAchievements?: AchievementsTypes[];
  isFinalTestInProgress?: boolean;
  userLevels: any;
  shortInfo?: string;
  uxcatLevels?: uxCatLevels[];
  notifiedAchievements?: any;
  accessToken?: string;
  isTestResultsAvailable?: boolean;
  hasSpecialAchievements?: boolean;
  disableStartTest?: boolean;
  nextTestTime?: number;
  headerUserInfo?: UserTypes;
  setHeaderUserInfo?: (userInfo: UserTypes) => void;
}
