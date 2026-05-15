const content = {
  en: {
    title: 'Audience: Free-tier users',
    messageHead: 'Their upgrade email',
    before: {
      label: 'Free users',
      count: '48,000',
      message: 'Upgrade to Pro for unlimited everything!',
      metricLabel: 'Upgrade rate',
      metricValue: '0.4%',
    },
    after: {
      segments: [
        {
          label: 'Power users (12k)',
          count: '12,000',
          color: '#28587b',
          message:
            'You hit the project limit 4 times this month. Pro removes it.',
        },
        {
          label: 'Casual users (28k)',
          count: '28,000',
          color: '#a36aa4',
          message: 'You only need 2 features. Try our $4/mo Lite plan instead.',
        },
        {
          label: 'Trial-stuck (8k)',
          count: '8,000',
          color: '#cd7232',
          message:
            'Looks like you never finished setup — want a 5-minute walkthrough?',
        },
      ],
      metricLabel: 'Upgrade rate',
      metricValue: '3.1%',
    },
  },
  ru: {
    title: 'Аудитория: Free-пользователи',
    messageHead: 'Письмо с предложением апгрейда',
    before: {
      label: 'Free-пользователи',
      count: '48 000',
      message: 'Перейдите на Pro и получите всё без ограничений!',
      metricLabel: 'Конверсия в апгрейд',
      metricValue: '0,4%',
    },
    after: {
      segments: [
        {
          label: 'Активные (12k)',
          count: '12 000',
          color: '#28587b',
          message:
            'Вы 4 раза за месяц упёрлись в лимит проектов. Pro его убирает.',
        },
        {
          label: 'Эпизодические (28k)',
          count: '28 000',
          color: '#a36aa4',
          message: 'Вам нужны только 2 функции. Попробуйте Lite за $4/мес.',
        },
        {
          label: 'Застряли в старте (8k)',
          count: '8 000',
          color: '#cd7232',
          message: 'Похоже, вы не закончили настройку — нужен 5-минутный гайд?',
        },
      ],
      metricLabel: 'Конверсия в апгрейд',
      metricValue: '3,1%',
    },
  },
  hy: {
    title: 'Լսարան՝ Free-tier օգտատերեր',
    messageHead: 'Բարելավման նամակը',
    before: {
      label: 'Free օգտատերեր',
      count: '48,000',
      message: 'Անցեք Pro-ին և ստացեք ամեն ինչ առանց սահմանափակումների։',
      metricLabel: 'Բարելավման տոկոս',
      metricValue: '0.4%',
    },
    after: {
      segments: [
        {
          label: 'Ակտիվ (12k)',
          count: '12,000',
          color: '#28587b',
          message:
            'Այս ամիս 4 անգամ հասել եք պրոյեկտների սահմանին։ Pro-ն հանում է այն։',
        },
        {
          label: 'Պատահական (28k)',
          count: '28,000',
          color: '#a36aa4',
          message: 'Ձեզ պետք են ընդամենը 2 ֆիչա։ Փորձեք Lite՝ $4/ամս։',
        },
        {
          label: 'Մեկնարկում խրված (8k)',
          count: '8,000',
          color: '#cd7232',
          message:
            'Կարծես կարգավորումը չավարտեցիք — 5 րոպեանոց ուղեցո՞ւյց եք ուզում։',
        },
      ],
      metricLabel: 'Բարելավման տոկոս',
      metricValue: '3.1%',
    },
  },
};

export default content;
