const strapiUrl = process.env.NEXT_PUBLIC_STRAPI;

const toFullUrl = (url?: string): string | null =>
  url ? `${strapiUrl}${url}` : null;

const extractUrl = (field: any): string | null =>
  toFullUrl(field?.data?.attributes?.url);

export const getDietImageUrls = (data: any) => {
  return [extractUrl(data?.['background image'])].filter(Boolean) as string[];
};

export const getWorkoutImageUrls = (data: any) => {
  return [extractUrl(data?.['image'])].filter(Boolean) as string[];
};

export const getEnvironmentImageUrls = (data: any) => {
  const backgroundUrl = extractUrl(data?.['image']);

  const iconUrls = [
    ...(data?.['home'] || []),
    ...(data?.['principles'] || []),
    ...(data?.['data tracking'] || []),
  ]
    .map((item: any) => extractUrl(item?.icon))
    .filter(Boolean);

  return [backgroundUrl, ...iconUrls].filter(Boolean) as string[];
};

export const getLifestyleImageUrls = (data: any) => {
  return [extractUrl(data?.['background image'])].filter(Boolean) as string[];
};

export const getResultsImageUrls = (data: any) => {
  return [extractUrl(data?.['background image'])].filter(Boolean) as string[];
};

export const getStudyImageUrls = (data: any) => {
  const backgroundUrl = extractUrl(data?.['background image']);
  const chartUrls = [
    'books flipped card image',
    'books notes flipped card image',
    'daily work flipped card image',
    'research tasks flipped card image',
    'data flipped card image',
    'hacks flipped card image',
  ]
    .map(key => extractUrl(data?.[key]))
    .filter(Boolean);

  return [backgroundUrl, ...chartUrls].filter(Boolean) as string[];
};

export const getSupplementsImageUrls = (data: any) => {
  return [extractUrl(data?.['image'])].filter(Boolean) as string[];
};

const sleepImgPath = '/keepsimple_/assets/longevity/sleep/';

export const getSleepImageUrls = () => {
  return [
    `${sleepImgPath}supplements-header.png`,
    `${sleepImgPath}key-brain-rules-header.png`,
    `${sleepImgPath}used-devices-header.png`,
    `${sleepImgPath}sleep-hacks.png`,
    '/keepsimple_/assets/longevity/shared-assets/small-table.svg',
    '/keepsimple_/assets/longevity/shared-assets/right-arrow.svg',
  ];
};

const basicStatsImgPath = '/keepsimple_/assets/longevity/basic-stats/';

export const getAboutProjectImageUrls = () => {
  return [
    `${basicStatsImgPath}gender.svg`,
    `${basicStatsImgPath}age.svg`,
    `${basicStatsImgPath}height.svg`,
    `${basicStatsImgPath}weight.svg`,
    `${basicStatsImgPath}occupation.svg`,
  ];
};
