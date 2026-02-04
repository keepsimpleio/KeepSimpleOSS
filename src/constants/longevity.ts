export const longevityDietPath = '/keepsimple_/assets/longevity/diet';
const heartsPath = '/keepsimple_/assets/longevity/diet/hearts/';
const scaleImgPath = '/keepsimple_/assets/longevity/diet/diet-results-icons/';
const backgroundImgPath = '/keepsimple_/assets/longevity/diet/diet-results-bg/';

export const images = [
  `${heartsPath}sugar.svg`,
  `${heartsPath}seed-oil.svg`,
  `${heartsPath}sugary-drinks.svg`,
  `${heartsPath}ultra-porcessed-food.svg`,
  `${heartsPath}white-flour.svg`,
  `${heartsPath}deceptive-food.svg`,
];

export const scaleLevels = [
  {
    id: 1,
    imagePath: scaleImgPath + 'borderline-ok-foods.png',
    backGroundUrl: backgroundImgPath + 'borderline-ok-foods-bg.png',
    biologicalAge: '0',
    skinAge: '0',
    jointAge: '0',
    metabolicAge: '0',
  },
  {
    id: 2,
    imagePath: scaleImgPath + 'supportive-foods.png',
    backGroundUrl: backgroundImgPath + 'supportive-foods-bg.png',
    biologicalAge: '1',
    skinAge: '2',
    jointAge: '1.5',
    metabolicAge: '3',
  },
  {
    id: 3,
    imagePath: scaleImgPath + 'protective-foods.png',
    backGroundUrl: backgroundImgPath + 'protective-foods-bg.png',
    biologicalAge: '2',
    skinAge: '3.5',
    jointAge: '3',
    metabolicAge: '5',
  },
  {
    id: 4,
    imagePath: scaleImgPath + 'clean-nutrients.png',
    backGroundUrl: backgroundImgPath + 'clean-nutrients-bg.png',
    biologicalAge: '3.5',
    skinAge: '5.5',
    jointAge: '4.5',
    metabolicAge: '7.5',
  },
  {
    id: 5,
    imagePath: scaleImgPath + 'metabolic-gold.png',
    backGroundUrl: backgroundImgPath + 'metabolic-gold-bg.png',
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
export const ACTIVITY_LEVEL_SUMMARY = [
  {
    minutes: 0,
    riskOfDyingEarly: 'Highest Risk (100% baseline)',
    cognitiveDecline: 'Baseline (0%)',
    brainAgingActive: 'No fitness protection',
    brainAgingSedentary: 'Accelerated aging trajectory',
  },
  {
    minutes: 75,
    riskOfDyingEarly: '90% of early-death risk',
    cognitiveDecline: '~5–10% lower',
    brainAgingActive: 'Slightly younger',
    brainAgingSedentary: 'Slightly older',
  },
  {
    minutes: 150,
    riskOfDyingEarly: '80% of early-death risk',
    cognitiveDecline: '~15–20% lower',
    brainAgingActive: 'Noticeably younger trajectory',
    brainAgingSedentary: 'Noticeably older',
  },
  {
    minutes: 225,
    riskOfDyingEarly: '72% of early-death risk',
    cognitiveDecline: '~20–30% lower',
    brainAgingActive: 'Younger, more stable trajectory',
    brainAgingSedentary: 'Older, faster decline',
  },
  {
    minutes: 300,
    riskOfDyingEarly: '65% of early-death risk',
    cognitiveDecline: '~25–35% lower',
    brainAgingActive: 'Optimized (use brain-age model)',
    brainAgingSedentary: 'Worst-case brain-age path',
  },
];
