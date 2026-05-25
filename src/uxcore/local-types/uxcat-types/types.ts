export type UserTypes = {
  achieves: any;
  id: number | string;
  nextTestTime?: number | null;
  username: string;
  usernameLong?: string;
  email?: string;
  points?: number;
  title: string;
  linkedin?: string;
  isTestUser?: boolean;
  rankingStatistics?: {
    rank: number;
    topOf: number;
    nextUpdateTime: number;
  };
  finalTestPermission?: boolean;
  level?: number;
  bgImageUrl?: string;
  coverImageUrl?: string;
  startTest?: boolean;
  response?: {
    status: number;
  };
  levels?: {
    level: number;
    unlockedAt: string;
  }[];
  ongoingTest?: { questions: []; isFinal: boolean };
  user: {
    id: number | string;
    username: string;
    email?: string;
    picture?: string;
    usernameLong?: string;
    isTestUser?: boolean;
    points?: number;
    nextTestTime?: number | null;
    topOf?: number;
    level?: number;
    finalTestPermission?: boolean;
    bgImageUrl?: string;
    coverImageUrl?: string;
    title: string;
    linkedin?: string;
    rankingStatistics?: {
      rank: number;
      topOf: number;
      nextUpdateTime: number;
    };
  };
};

export type LevelDetailsTypes = {
  data: {
    id: string;
    type: string;
    attributes: {
      lavelName: string;
      level: number;
      badge: {
        data: {
          id: string;
          type: string;
          attributes: {
            url: string;
          };
        };
      };
      bgImage: {
        data: {
          id: string;
          type: string;
          attributes: {
            url: string;
          };
        };
      };
    };
  };
};

export type BgAndCoverImagesTypes = {
  attributes: {
    bgImage: {
      data: {
        attributes: {
          formats: {
            thumbnail: {
              url: string;
            };
          };
          url: string;
        };
      };
    };
  };
};

export type BoardContentTypes = {
  id: number;
  pageName: string;
  pageIcon: JSX.Element;
  headerColor: string;
};

export type StatisticsTypes = {
  data: {
    attributes: {
      totalTests: number;
      totalPoints: number;
      totalCorrectAnswers: number;
      totalQuestions: number;
      totalWrongAnswers: number;
    };
  };
};

export type AchievementsTypes = {
  id: number;
  collection_type: string;
  createdAt: string;
  description: string;
  hidden: boolean;
  unlockedAt: string;
  slug: string;
  icon: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  locale: string;
  name: string;
  publishedAt: string;
  type: string;
  updatedAt: string;
};

export type uxCatLevels = {
  [key: number]: number;
};

export type userLevels = {
  level: number;
  unlockedAt: string;
};

export interface TestResultsTypes {
  testPoints: number;
  success: boolean;
  testSummary: {
    correctQuestions?: [];
    incorrectQuestions?: [];
    unlockedAchieves?: {
      name: string;
      unlockedAt: string;
    }[];
  };
  userPoints?: number;
  correctQuestions?: [];
  incorrectQuestions?: [];
  unlockedAchieves?: {
    name: string;
    unlockedAt: string;
  }[];
}

export type UXCatDataTypes = {
  seoDescription: string;
  testResultPageTitle: string;
  startTestPageTitle: string;
  ongoingPageTitle: string;
  pageDescription: string;
  keywords: string;
  updatedAt?: string;
};
