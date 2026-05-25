import type { MutableRefObject } from 'react';

import type { BiasType, QuestionType, StrapiBiasType } from '@uxcore/local-types/data';

import { downloadLinksEn, downloadLinksRu } from '@uxcore/api/questions';

import biasesCategories from '@uxcore/data/biasesCategories';

export function scrollToImage(src: string) {
  function getOffset(el: HTMLImageElement) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  const image: HTMLImageElement = document.querySelector(`img[src='${src}']`);
  const offset = getOffset(image);
  window.scrollTo(0, offset.top - 50);
}

const globalNavigator = typeof navigator !== 'undefined' && navigator;
const globalWindow = typeof window !== 'undefined' && window;

const isBrowser = () =>
  typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  typeof document !== 'undefined';

const isAndroid = () =>
  isBrowser() && /(android)/i.test(globalNavigator.userAgent);

const isIOS = () =>
  isBrowser() &&
  !!globalNavigator.userAgent.match(/iPad|iPhone|iPod/i) &&
  // @ts-ignore
  !globalWindow.MSStream;
export const isMobileDevice = () => isIOS() || isAndroid();

const getSectionID = (currentBiasData: StrapiBiasType, id: number) => {
  if (!currentBiasData) return null;

  if (id < 34) {
    return 1;
  } else if (id >= 34 && id < 69) {
    return 2;
  } else if (id >= 69 && id < 98) {
    return 3;
  } else {
    return 4;
  }
};

export const generateLabelsData = (
  biases: StrapiBiasType[],
  biasNumber: number,
  position: 'left' | 'right',
) => {
  let topBiasNumber: number;
  let bottomBiasNumber: number;

  if (position === 'left') {
    topBiasNumber = biasNumber === 105 ? 999 : biasNumber + 1;
    bottomBiasNumber = biasNumber === 53 ? 999 : biasNumber - 1;
  } else {
    topBiasNumber = biasNumber === 1 ? 999 : biasNumber - 1;
    bottomBiasNumber = biasNumber === 52 ? 999 : biasNumber + 1;
  }

  // HYTranslation TODO
  const topBias = biases?.find(
    ({ attributes }) => attributes?.number === topBiasNumber,
  );
  const currentBias = biases?.find(
    ({ attributes }) => attributes?.number === biasNumber,
  );
  const bottomBias = biases?.find(
    ({ attributes }) => attributes?.number === bottomBiasNumber,
  );

  return [
    {
      id: topBiasNumber,
      sectionId: getSectionID(topBias, topBiasNumber),
      data: topBias,
    },
    {
      id: biasNumber,
      sectionId: getSectionID(currentBias, biasNumber),
      data: currentBias,
    },
    {
      id: bottomBiasNumber,
      sectionId: getSectionID(bottomBias, bottomBiasNumber),
      data: bottomBias,
    },
  ];
};

const searchPostfixes = {
  en: [
    ['', 's'],
    ['', ''],
    ['', 's'],
  ],
  ru: [
    ['о', 'ов'],
    ['', ''],
    ['о', 'а'],
  ],
};

const getSearchLabels = (length: number) => {
  const mainNumber = length % 100;
  const lastNumber = mainNumber % 10;

  if (mainNumber >= 10 && mainNumber < 20) {
    return searchPostfixes[0];
  } else {
    if (lastNumber == 1) return searchPostfixes[1];
    else if (lastNumber > 1 && lastNumber < 5) return searchPostfixes[2];
    else return searchPostfixes[0];
  }
};

export const getSearchResults = (
  biases: any[],
  searchValue: string,
  locale: string,
) => {
  let results: any[] = [];
  if (searchValue.trim()) {
    results =
      !!biases &&
      biases?.reduce((acc, { attributes }) => {
        const title = attributes.title;
        const usage = attributes.usage;
        const description = attributes.description;

        if (
          title?.toLocaleLowerCase(locale).includes(searchValue) ||
          usage?.toLocaleLowerCase(locale).includes(searchValue) ||
          description?.toLocaleLowerCase(locale).includes(searchValue)
        ) {
          acc.push(attributes.number);
        }

        return acc;
      }, []);
  }

  const searchLabels = getSearchLabels(results?.length);
  return { results, searchLabels };
};

export const getSearchResultsUxcp = (
  biases: any[],
  searchValue: string,
  locale: string,
) => {
  let results: any[] = [];

  if (searchValue.trim()) {
    results = biases.reduce((acc, { title, usage, number, description }) => {
      if (
        title?.includes(searchValue) ||
        usage?.includes(searchValue) ||
        description?.includes(searchValue)
      ) {
        acc.push(number);
      }

      return acc;
    }, []);
  }

  const searchLabels = getSearchLabels(results.length);
  return { results, searchLabels };
};

export function groupFilteredData(
  biases: StrapiBiasType[],
  searchResults: any[],
  locale: 'en' | 'ru' | 'hy',
) {
  const groups: any = [];
  let filters = searchResults;

  if (!searchResults.length) {
    filters = biases && biases?.map(bias => bias.attributes.number);
  }

  biasesCategories[locale].reduce((acc, cat, index) => {
    filters?.forEach(biasNumber => {
      if (biasNumber >= cat.from && biasNumber <= cat.to) {
        if (!acc[index]) acc[index] = [];
        acc[index].push(biasNumber);
      }
    });

    return acc;
  }, groups);

  return groups;
}

export const generateSocialLinks = (url: string, title: string) => ({
  linkedIn: `https://www.linkedin.com/shareArticle?url=${url}&title=${title}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?title=${title}&u=${url}`,
  tweeter: `https://twitter.com/share?url=${url}&text=${title}`,
});

export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

// TODO: make this passive functionality to use VH in another components
export const updateVH = () => {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

export const getRatedItems = (type: 'bias' | 'question') => {
  const key = type === 'bias' ? 'ratedBiases' : 'ratedQuestions';
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const saveInLocalStorage = (id: number, type: 'bias' | 'question') => {
  const key = type === 'bias' ? 'ratedBiases' : 'ratedQuestions';
  const ratedItems = getRatedItems(type);

  if (!ratedItems.includes(id)) {
    ratedItems.push(id);
    localStorage.setItem(key, JSON.stringify(ratedItems));
  }
};

export function validateEmail(email: string) {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return re.test(email.toLowerCase());
}

export const sortByNumber = (
  a: QuestionType | BiasType,
  b: QuestionType | BiasType,
) => {
  if (a.number === null || b.number === null) return 0;
  if (a.number > b.number) return 1;
  if (a.number < b.number) return -1;
  return 0;
};

export const calculateTooltipPostion = (
  left: number,
  top: number,
  bottom: number,
  blockWidth: number,
  tooltipRef: MutableRefObject<any>,
  isOnBottom: boolean,
) => {
  const { width: tooltipWidth, height: tooltipheight } =
    // @ts-ignore
    tooltipRef.current.getBoundingClientRect();
  // const linkHeight = 17;
  const arrowGap = 6;
  const calculatedTop = isOnBottom
    ? bottom + arrowGap
    : top - tooltipheight - arrowGap;
  /**
   * Left Calculation Formula:
   * half of outside part = (tooltip width - block width) / 2
   * left = block left - half of outside part
   */

  const outsideHalfPart = (tooltipWidth - blockWidth) / 2;
  const calculatedLeft = left - outsideHalfPart;

  return { left: calculatedLeft, top: calculatedTop };
};

export const generateQuestionsSeo = (
  questionsData: QuestionType[],
  locale: 'en' | 'ru' | 'hy',
) => {
  return questionsData.reduce(
    (acc, question): any => {
      const slugs = {
        en: question.slugEn,
        ru: question.slugRu,
        hy: question.slugHy,
      };

      const path = `/uxcg/${slugs[locale]}`;
      acc.en[path] = {
        title: question.seoTitleEn,
        description: question.seoDescriptionEn,
        keywords: question.keywordsEn,
        pageTitle: question.pageTitleEn,
      };

      acc.ru[path] = {
        title: question.seoTitleRu,
        description: question.seoDescriptionRu,
        keywords: question.keywordsRu,
        pageTitle: question.pageTitleRu,
      };

      return acc;
    },
    { en: {} as any, ru: {} as any },
  );
};

export const mergeBiasesLocalization = (en: any[], ru: any[], hy?: any[]) => {
  const result: StrapiBiasType[] = [];

  if (Array.isArray(en)) {
    en?.forEach((item: any, index: number) => {
      result.push({
        seoTitleEn: item?.attributes?.seoTitle || null,
        seoTitleRu: ru?.[index]?.attributes?.seoTitle || null,
        seoTitleHy: hy?.[index]?.attributes?.seoTitle || null,

        pageTitleEn: item?.attributes?.pageTitle || null,
        pageTitleRu: ru?.[index]?.attributes?.pageTitle || null,
        pageTitleHy: hy?.[index]?.attributes?.pageTitle || null,

        keywordsEn: item?.attributes?.keywords || null,
        keywordsRu: ru?.[index]?.attributes?.keywords || null,
        keywordsHy: hy?.[index]?.attributes?.keywords || null,

        seoDescriptionEn: item?.attributes?.seoDescription || null,
        seoDescriptionRu: ru?.[index]?.attributes?.seoDescription || null,
        seoDescriptionHy: hy?.[index]?.attributes?.seoDescription || null,

        descrEn: item?.attributes?.description || null,
        descrRu: ru?.[index]?.attributes?.description || null,
        descrHy: hy?.[index]?.attributes?.description || null,

        number: +item?.attributes?.number || null,

        titleEn: item?.attributes?.title || null,
        titleRu: ru?.[index]?.attributes?.title || null,
        titleHy: hy?.[index]?.attributes?.title || null,

        usageEn: item?.attributes?.usage || null,
        usageRu: ru?.[index]?.attributes?.usage || null,
        usageHy: hy?.[index]?.attributes?.usage || null,

        usageHrEn: item?.attributes?.usageHr || null,
        usageHrRu: ru?.[index]?.attributes?.usageHr || null,
        usageHrHy: hy?.[index]?.attributes?.usageHr || null,

        usageUiUxEn: item?.attributes?.usageUiUx || null,
        usageUiUxRu: ru?.[index]?.attributes?.usageUiUx || null,
        usageUiUxHy: hy?.[index]?.attributes?.usageUiUx || null,

        slugEn: item?.attributes?.slug || null,
        slugRu: ru?.[index]?.attributes?.slug || null,
        slugHy: hy?.[index]?.attributes?.slug || null,

        mentionedQuestionsIds: item?.attributes?.mentionedQuestionsIds || null,
        _id: item?.id || null,

        wikiLinkEn: item?.attributes?.wikiLink || null,
        wikiLinkRu: ru?.[index]?.attributes?.wikiLink || null,
        wikiLinkHy: hy?.[index]?.attributes?.wikiLink || null,

        m: item?.attributes?.m || false,
        p: item?.attributes?.p || false,

        OGTagsEn: item?.attributes?.OGTags || null,
        OGTagsRu: ru?.[index]?.attributes?.OGTags || null,
        OGTagsHy: item?.attributes?.OGTags || null,

        updatedAt: item?.attributes?.updatedAt || null,
      });
    });
  }

  return result;
};

export const mergeQuestionsLocalization = (
  en: any[],
  ru: any[],
  hy?: any[],
) => {
  const result: any[] = [];
  en?.forEach((item: any, index: number) => {
    result.push({
      number: +item?.attributes?.number || null,

      titleEn: item?.attributes?.title || null,
      titleRu: ru[index]?.attributes?.title || null,
      titleHy: hy?.[index]?.attributes?.title || null,

      answersEn: item?.attributes?.answers || [],
      answersRu: ru[index]?.attributes?.answers || [],
      answersHy: hy?.[index]?.attributes?.answers || [],

      tags: JSON.parse(item?.attributes?.tags) || [],

      slugEn: item?.attributes?.slug || null,
      slugRu: ru[index]?.attributes?.slug || null,
      slugHy: hy?.[index]?.attributes?.slug || null,

      downloadLinks: {
        en: downloadLinksEn[+item?.attributes?.number - 1],
        ru: downloadLinksRu[+item?.attributes?.number - 1],
        hy: downloadLinksEn[+item?.attributes?.number - 1],
      },

      aliases:
        [item?.attributes?.aliases, ru[index]?.attributes?.aliases] || null,

      relatedQuestions: JSON.parse(item?.attributes?.relatedQuestions) || [],

      seoTitleEn: item?.attributes?.seoTitle,
      seoTitleRu: ru[index]?.attributes?.seoTitle,
      seoTitleHy: item?.attributes?.seoTitle || null,

      keywordsEn: item?.attributes?.keywords,
      keywordsRu: ru[index]?.attributes?.keywords,
      keywordsHy: item?.attributes?.keywords,

      seoDescriptionEn: item?.attributes?.seoDescription,
      seoDescriptionRu: ru[index]?.attributes?.seoDescription,
      seoDescriptionHy: item?.attributes?.seoDescription,

      pageTitleEn: item?.attributes?.pageTitle,
      pageTitleRu: ru[index]?.attributes?.pageTitle,
      pageTitleHy: item?.attributes?.pageTitle,

      OGTagsEn: item?.attributes?.OGTags || null,
      OGTagsRu: ru[index]?.attributes?.OGTags || null,
      OGTagsHy: item?.attributes?.OGTags || null,

      updatedAt: item?.attributes?.updatedAt || null,
    });
  });

  return result;
};

export const getAdjacentBiasTitles = (locale, biases, activeBiasNumber) => {
  if (!biases[locale]?.length) return { next: null, prev: null };

  const biasList = biases?.[locale].map(({ attributes }) => attributes);
  biasList.sort((a, b) => a.number - b.number);

  const currentIndex = biasList.findIndex(
    ({ number }) => Number(number) === Number(activeBiasNumber),
  );

  if (currentIndex === -1) return { next: null, prev: null };

  const prevBias =
    currentIndex === 0
      ? biasList[biasList.length - 1]
      : biasList[currentIndex - 1];
  const nextBias =
    currentIndex === biasList.length - 1
      ? biasList[0]
      : biasList[currentIndex + 1];

  return {
    prev: prevBias ? `${prevBias.slug}` : null,
    next: nextBias ? `${nextBias.slug}` : null,
  };
};

export const getAdjacentUXCGTitles = (locale, uxcgDats, activeQuestion) => {
  if (!uxcgDats[locale]?.length) return { next: null, prev: null };

  const questionsList = uxcgDats[locale].map(({ attributes }) => attributes);
  questionsList.sort((a, b) => a.number - b.number);

  const currentIndex = questionsList.findIndex(
    ({ number }) => Number(number) === Number(activeQuestion),
  );

  if (currentIndex === -1) return { next: null, prev: null };

  const prevQuestion =
    currentIndex === 0
      ? questionsList[questionsList.length - 1]
      : questionsList[currentIndex - 1];
  const nextQuestion =
    currentIndex === questionsList.length - 1
      ? questionsList[0]
      : questionsList[currentIndex + 1];

  return {
    prev: prevQuestion ? `${prevQuestion.slug}` : null,
    next: nextQuestion ? `${nextQuestion.slug}` : null,
  };
};
