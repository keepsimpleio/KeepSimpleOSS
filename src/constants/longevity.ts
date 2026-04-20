export const longevityDietPath = '/keepsimple_/assets/longevity/diet';
const heartsPath = '/keepsimple_/assets/longevity/diet/hearts/';
const dietResultsIconsPath =
  '/keepsimple_/assets/longevity/diet/diet-results-icons/';
const backgroundImgPath = '/keepsimple_/assets/longevity/diet/diet-results-bg/';
const domain = process.env.NEXT_PUBLIC_DOMAIN;
export const ogImage = `${domain}/keepsimple_/assets/longevity/og.png`;
export const images = [
  `${heartsPath}sugar.png`,
  `${heartsPath}seed-oil.png`,
  `${heartsPath}sugary-drinks.png`,
  `${heartsPath}ultra-porcessed-food.png`,
  `${heartsPath}white-flour.png`,
  `${heartsPath}deceptive-food.png`,
];

export const scaleLevels = [
  {
    id: 1,
    imagePath: dietResultsIconsPath + 'borderline-ok-foods.png',
    backgroundUrlMobile:
      backgroundImgPath + 'borderline-ok-foods-mobile-bg.webp',
    backgroundUrl: backgroundImgPath + 'borderline-ok-foods-bg.png',
    biologicalAge: '0',
    skinAge: '0',
    jointAge: '0',
    metabolicAge: '0',
  },
  {
    id: 2,
    imagePath: dietResultsIconsPath + 'supportive-foods.png',
    backgroundUrl: backgroundImgPath + 'supportive-foods-bg.png',
    backgroundUrlMobile: backgroundImgPath + 'supportive-foods-mobile-bg.webp',
    biologicalAge: '1',
    skinAge: '2',
    jointAge: '1.5',
    metabolicAge: '3',
  },
  {
    id: 3,
    imagePath: dietResultsIconsPath + 'protective-foods.png',
    backgroundUrl: backgroundImgPath + 'protective-foods-bg.png',
    backgroundUrlMobile: backgroundImgPath + 'protective-foods-mobile-bg.webp',
    biologicalAge: '2',
    skinAge: '3.5',
    jointAge: '3',
    metabolicAge: '5',
  },
  {
    id: 4,
    imagePath: dietResultsIconsPath + 'clean-nutrients.png',
    backgroundUrl: backgroundImgPath + 'clean-nutrients-bg.png',
    backgroundUrlMobile: backgroundImgPath + 'clean-nutrient-mobile-bg.webp',
    biologicalAge: '3.5',
    skinAge: '5.5',
    jointAge: '4.5',
    metabolicAge: '7.5',
  },
  {
    id: 5,
    imagePath: dietResultsIconsPath + 'metabolic-gold.png',
    backgroundUrl: backgroundImgPath + 'metabolic-gold-bg.png',
    backgroundUrlMobile: backgroundImgPath + 'metabolic-gold-mobile.bg.webp',
    biologicalAge: '5',
    skinAge: '7',
    jointAge: '6',
    metabolicAge: '10',
  },
];

type BrainAgeRow = {
  baseline: number;
  active: number;
  sedentary: number;
};

export const BRAIN_AGE_TABLE: BrainAgeRow[] = [
  { baseline: 20, active: 19, sedentary: 22 },
  { baseline: 32, active: 29, sedentary: 37 },
  { baseline: 45, active: 40, sedentary: 53 },
  { baseline: 55, active: 50, sedentary: 66 },
  { baseline: 67, active: 60, sedentary: 82 },
  { baseline: 78, active: 70, sedentary: 97 },
  { baseline: 90, active: 82, sedentary: 112 },
];

export const ACTIVITY_LEVELS = [
  {
    level: 'Novice',
    minutesPerSession: 65,
    totalMinutesPerWeek: 240,
  },
  {
    level: 'Base',
    minutesPerSession: 60,
    totalMinutesPerWeek: 180,
  },
  {
    level: 'Strong',
    minutesPerSession: 50,
    totalMinutesPerWeek: 150,
  },
  {
    level: 'Very Strong',
    minutesPerSession: 40,
    totalMinutesPerWeek: 120,
  },
  {
    level: 'Elite',
    minutesPerSession: 30,
    totalMinutesPerWeek: 90,
  },
] as const;

export const STOPS = [0, 75, 150, 225, 300];
