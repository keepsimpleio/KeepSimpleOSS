import type {
  QuestionType,
  RelevantQuestionType,
  StrapiBiasType,
  SuggestedQuestionType,
} from '@uxcore/local-types/data';

import { map } from '@uxcore/lib/codeMap';

type QuestionCalculationResultsType = {
  relevantQuestions: RelevantQuestionType[];
  tagRelevancy: { [key: string]: number };
  suggestedQuestionsList: SuggestedQuestionType[];
};

const calculateRelevancyIndex = (percent: number) => {
  if (percent > 66) return 3;
  if (percent < 34) return 1;

  return 2;
};

const relevancyBasedOnIndex: { [key: string]: 'low' | 'medium' | 'high' } = {
  '1': 'low',
  '2': 'medium',
  '3': 'high',
};

const tagRelevancyDefaultState = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
type TQuestionId = string | number;
export const calculateData: (
  questions: QuestionType[],
  selectedBiases: StrapiBiasType[],
) => QuestionCalculationResultsType = (questions, selectedBiases) => {
  const onePercentOfAppearing = selectedBiases.length / 100;

  const { questionIds, relatedBiases } = selectedBiases.reduce<{
    questionIds: TQuestionId[];
    relatedBiases: {
      [key: string]: StrapiBiasType[];
    };
  }>(
    (acc, bias) => {
      const { mentionedQuestionsIds } = bias;
      acc.questionIds = acc.questionIds.concat(
        JSON.parse(mentionedQuestionsIds || '[]'),
      );

      JSON.parse(mentionedQuestionsIds || '[]').forEach((id: string) => {
        if (!acc.relatedBiases[id]) acc.relatedBiases[id] = [];

        if (!acc.relatedBiases[id].includes(bias)) {
          acc.relatedBiases[id].push(bias);
        }
      });

      return acc;
    },
    { questionIds: [], relatedBiases: {} },
  );
  const selectedQuestions = questions.filter(({ number }) =>
    questionIds.includes(number),
  );

  const results = selectedQuestions.reduce<QuestionCalculationResultsType>(
    (acc, question) => {
      const { number, tags } = question;
      const relevancy = questionIds.filter(id => +id === +number).length;

      const relevantFor = relatedBiases[number];

      const percentOfAppearing = Math.ceil(
        relevantFor.length / onePercentOfAppearing,
      );

      acc.relevantQuestions.push({
        ...question,
        relevantFor,
        relevancy,
        percentOfAppearing,
        relevancyIndex: 0,
        relevancyTitle: 'low',
      });

      for (let i = 0; i < tags.length; i++) {
        const tagId = tags[i];
        acc.tagRelevancy[tagId] = acc.tagRelevancy[tagId] + 1;
      }

      return acc;
    },
    {
      relevantQuestions: [],
      tagRelevancy: { ...tagRelevancyDefaultState },
      suggestedQuestionsList: [],
    },
  );

  results.relevantQuestions = results.relevantQuestions.sort(
    (a, b) => a.number - b.number,
  );

  // calculating selected question relevancy
  const maxRelevancyNumber = Math.max(
    ...results.relevantQuestions.map(({ relevancy }) => relevancy),
  );

  const relevancyOnePercent = maxRelevancyNumber / 100;

  results.relevantQuestions = results.relevantQuestions.map(
    relevantQuestion => {
      const relevancyPercent = Math.ceil(
        relevantQuestion.relevancy / relevancyOnePercent,
      );
      const relevancyIndex = calculateRelevancyIndex(relevancyPercent);

      return {
        ...relevantQuestion,
        relevancyIndex,
        relevancyTitle: relevancyBasedOnIndex[relevancyIndex],
      };
    },
  );

  results.relevantQuestions.sort((a, b) => b.relevancyIndex - a.relevancyIndex);

  // calculating suggested question relevancy
  const allRelatedQuestionIds = results.relevantQuestions.reduce(
    (acc, { relatedQuestions }) => acc.concat(relatedQuestions),
    [],
  );

  const relatedQuestionIds = allRelatedQuestionIds.filter(
    relatedQuestionId => !questionIds.includes(relatedQuestionId),
  );

  results.suggestedQuestionsList = questions
    .filter(({ number }) => relatedQuestionIds.includes(number))
    .reduce((acc, question) => {
      const relevancy = allRelatedQuestionIds.filter(
        id => id === question.number,
      ).length;

      acc.push({
        ...question,
        relevancy,
        relevancyIndex: 0,
        relevancyTitle: 'low',
        relevancyPercent: 0,
      });

      return acc;
    }, []);

  const maxSuggestionRelevancyNumber = Math.max(
    ...results.suggestedQuestionsList.map(({ relevancy }) => relevancy),
  );

  const onePercentOfSuggestedQuestionsAppearing =
    results.relevantQuestions.length / 100;
  const sudggestionRelevancyOnePercent = maxSuggestionRelevancyNumber / 100;

  results.suggestedQuestionsList = results.suggestedQuestionsList.map(
    suggestedQuestion => {
      const relevancyPercent = Math.ceil(
        suggestedQuestion.relevancy / sudggestionRelevancyOnePercent,
      );
      const relevancyIndex = calculateRelevancyIndex(relevancyPercent);

      const percentOfAppearing = Math.ceil(
        suggestedQuestion.relevancy / onePercentOfSuggestedQuestionsAppearing,
      );

      return {
        ...suggestedQuestion,
        relevancyIndex,
        relevancyTitle: relevancyBasedOnIndex[relevancyIndex],
        percentOfAppearing,
      };
    },
  );

  results.suggestedQuestionsList.sort(
    (a, b) => b.relevancyIndex - a.relevancyIndex,
  );

  return results;
};

export const calculatePercentage: (tagRelevancy: {
  [key: string]: number;
}) => any = (tagRelevancy: { [key: string]: number }) => {
  const total = Object.values(tagRelevancy).reduce(
    (acc, item) => acc + item,
    0,
  );

  if (total === 0) return null;

  const onePercent = total / 100;

  return Object.values(tagRelevancy).map(item => Math.round(item / onePercent));
};

export const generateUXCPLink = (
  personaName: string,
  selectedBiases: StrapiBiasType[],
  isTeamMember: boolean,
) => {
  function sliceArrayIntoGroups(string: string, size: number) {
    let step = 0;
    const sliceArr = [];
    const len = string.length;

    while (step < len) {
      sliceArr.push(string.slice(step, (step += size)));
    }

    return sliceArr;
  }

  const biasesAvailabilityArray = new Array(105).fill(0);

  selectedBiases.forEach(({ number }) => {
    biasesAvailabilityArray[number - 1] = 1;
  });

  const binaryArray = sliceArrayIntoGroups(biasesAvailabilityArray.join(''), 5);
  const biasesHash = binaryArray.map(octet => map[parseInt(octet, 2)]).join('');

  return `${window.location.origin}/uxcp/${
    encodeURIComponent(personaName.trim()) || 'Untitled'
  }/${biasesHash}/${Number(isTeamMember)}`;
};

export const parseUXCPLink = (hash: string) => {
  // @ts-ignore
  const biasesString = hash.split('').reduce((acc: string, item: number) => {
    const index = Number(map.indexOf(String(item)));
    let bin = (index >>> 0).toString(2);

    if (bin.length < 5) {
      bin = '0'.repeat(5 - bin.length) + bin;
    }

    return (acc += bin);
  }, '');

  const biases = biasesString.split('').reduce((acc, biasValue, index) => {
    const availability = Boolean(Number(biasValue));
    const biasNumber = index + 1;

    if (availability) {
      if (!!acc) acc += ',';
      acc += biasNumber;
    }

    return acc;
  }, '');

  return biases;
};
