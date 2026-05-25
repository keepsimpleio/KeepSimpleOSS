const content = {
  en: {
    sectionLabel: 'Code Review — auth.ts',
    aiAuthor: 'AI Assistant',
    aiSuggestion: 'Suggestion: Refactor this function to reduce nesting depth.',
    comments: [
      {
        author: 'Marcus R.',
        line: 'line 42',
        body: 'This function is hard to follow — consider early returns.',
      },
      {
        author: 'Priya K.',
        line: 'line 55',
        body: 'Missing null check before accessing user.profile.',
      },
    ],
    beforeAiLine: 'line 42',
    after: {
      aiLabel: 'AI Verified',
      confidence: '98.7% confidence',
      aiFooter: 'Analyzed 1,204 similar patterns · Auto-apply available',
    },
  },
  ru: {
    sectionLabel: 'Код-ревью — auth.ts',
    aiAuthor: 'AI-ассистент',
    aiSuggestion:
      'Предложение: отрефакторьте эту функцию, чтобы уменьшить глубину вложенности.',
    comments: [
      {
        author: 'Маркус Р.',
        line: 'строка 42',
        body: 'Эту функцию сложно читать — рассмотрите ранние возвраты.',
      },
      {
        author: 'Прия К.',
        line: 'строка 55',
        body: 'Нет проверки на null перед доступом к user.profile.',
      },
    ],
    beforeAiLine: 'строка 42',
    after: {
      aiLabel: 'Проверено AI',
      confidence: 'уверенность 98,7%',
      aiFooter:
        'Проанализировано 1 204 похожих паттерна · Доступно автоприменение',
    },
  },
  hy: {
    sectionLabel: 'Կոդի վերանայում — auth.ts',
    aiAuthor: 'AI-օգնական',
    aiSuggestion:
      'Առաջարկ՝ վերակառուցեք այս ֆունկցիան՝ ներդրման խորությունը նվազեցնելու համար:',
    comments: [
      {
        author: 'Մարկուս Ռ.',
        line: 'տող 42',
        body: 'Այս ֆունկցիային դժվար է հետևել — դիտարկեք վաղ վերադարձները:',
      },
      {
        author: 'Պրիյա Կ.',
        line: 'տող 55',
        body: 'Բացակայում է null-ի ստուգումը user.profile-ին դիմելուց առաջ:',
      },
    ],
    beforeAiLine: 'տող 42',
    after: {
      aiLabel: 'AI-ով ստուգված',
      confidence: 'վստահություն 98,7%',
      aiFooter: 'Վերլուծված է 1 204 նմանատիպ օրինակ · Հասանելի է ավտոկիրառումը',
    },
  },
};

export default content;
