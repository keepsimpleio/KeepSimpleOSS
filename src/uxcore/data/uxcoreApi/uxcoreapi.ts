const uxcoreApi = [
  {
    mainTitle: 'Base URL to get the list of all UX Core biases',
    link: 'https://api.keepsimple.io/uxcore',
    parametersTxt: 'Parameters',
    parametersInfo:
      'The following parameters can be used to filter and customize the response.',
    parameters: [
      {
        title: 'lang',
        description: 'Specify the language of the returned content.',
        details: ['Versions: ru, en', 'Default: en'],
        exampleCode: 'https://api.keepsimple.io/uxcore/?lang=en',
      },
      {
        title: 'field',
        description: 'Specify the fields to be included with bias names.',
        details: [
          'Versions: usage, desc, link, questions',
          'Default: []',
          'usage: Add usage field',
          'desc: Add bias description field',
          'link: Add bias wiki URL field',
          'questions: Add Bias questions field',
        ],
      },
    ],
    usageTitle: 'Usage example',
    usageTxt:
      'Retrieve the list of UX Core biases including all their properties ',
    code: 'GET https://api.keepsimple.io/uxcore/?field=[usage, desc]',
  },
  {
    mainTitle: 'Base URL to get one UX Core bias',
    link: 'https://api.keepsimple.io/uxcore/:ID',
    parametersTxt: 'Parameters',
    parametersInfo:
      'The following parameters can be used to filter and customize the response.',
    parameters: [
      {
        title: 'lang',
        description: 'Specify the language of the returned content.',
        details: ['Versions: ru, en', 'Default: en'],
        exampleCode: 'https://api.keepsimple.io/uxcore/:ID?lang=ru',
      },
      {
        title: 'field',
        description: 'Specify the fields to be included with bias names.',
        details: [
          'Versions: usage, desc, link, questions',
          'Default: []',
          'usage: Add usage field',
          'desc: Add bias description field',
          'link: Add bias wiki URL field',
          'questions: Add Bias questions field',
        ],
      },
    ],
    usageTitle: 'Usage example',
    usageTxt: 'Retrieve 6th bias with its wiki URL',
    code: 'GET https://api.keepsimple.io/uxcore/6?field=[link]',
  },
  {
    mainTitle: 'Base URL to get the list of all UX Core Guide (UXCG) Questions',
    link: 'https://api.keepsimple.io/uxcg',
    parametersTxt: 'Parameters',
    parametersInfo:
      'The following parameters can be used to filter and customize the response.',
    parameters: [
      {
        title: 'lang',
        description: 'Specify the language of the returned content.',
        details: ['Versions: ru, en', 'Default: en'],
        exampleCode: 'https://api.keepsimple.io/uxcg/?lang=ru',
      },
      {
        title: 'answers',
        description:
          'Specify the number of answers for each returned question.',
        details: ['default: 0 (all)'],
        exampleCode: 'https://api.keepsimple.io/uxcg?answers=7',
      },
      {
        title: 'related_questions',
        description:
          'Specify the number of related questions for each returned question',
        details: ['default: 0 (all)'],
        exampleCode: 'https://api.keepsimple.io/uxcg?related_questions=10',
      },
    ],
    usageTitle: 'Usage example',
    usageTxt:
      'Retrieve all UXCG questions in Russian, with 3 answers for each. Also include 2 related questions for each',
    code: 'GET https://api.keepsimple.io/uxcg?lang=ru&answers=3&related_questions=2',
  },
  {
    mainTitle: 'Base URL to get the list of one UX Core Guide (UXCG) Question',
    link: 'https://api.keepsimple.io/uxcg/:ID',
    parametersTxt: 'Parameters',
    parametersInfo:
      'The following parameters can be used to filter and customize the response.',
    parameters: [
      {
        title: 'lang',
        description: 'Specify the language of the returned content.',
        details: ['Versions: ru, en', 'Default: en'],
        exampleCode: 'https://api.keepsimple.io/uxcg/:ID?lang=ru',
      },
      {
        title: 'answers',
        description:
          'Specify the number of answers for each returned question.',
        details: ['default: 0 (all)'],
        exampleCode: 'https://api.keepsimple.io/uxcg/:ID?answers=7',
      },
      {
        title: 'related_questions',
        description:
          'Specify the number of related questions for each returned question',
        details: ['default: 0 (all)'],
        exampleCode: 'https://api.keepsimple.io/uxcg?related_questions=10',
      },
    ],
    usageTitle: 'Usage example',
    usageTxt:
      'Retrieve UXCG question #15 in English, with all available answers and 2 related questions',
    code: 'GET https://api.keepsimple.io/uxcg/15?lang=en&answers=0&related_questions=2',
  },
];
export default uxcoreApi;
