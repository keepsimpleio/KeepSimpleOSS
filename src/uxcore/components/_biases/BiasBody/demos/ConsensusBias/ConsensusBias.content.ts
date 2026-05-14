const content = {
  en: {
    title: 'Which onboarding flow ships?',
    before: {
      subhead: 'Internal team poll · 24 votes',
      options: [
        { label: 'Quick tour', percent: 71 },
        { label: 'Empty state + nudges', percent: 21 },
        { label: 'Demo video', percent: 8 },
      ],
      decisionLabel: 'Decision:',
      decision: 'We all picked Quick Tour. Users will obviously prefer it too.',
    },
    after: {
      teamLabel: 'Internal team (24)',
      team: [
        { label: 'Quick tour', percent: 71 },
        { label: 'Empty state', percent: 21 },
        { label: 'Demo video', percent: 8 },
      ],
      customerLabel: 'Customers (412 surveyed)',
      customers: [
        { label: 'Quick tour', percent: 12 },
        { label: 'Empty state', percent: 23 },
        { label: 'Demo video', percent: 65 },
      ],
      gapLabel: 'Gap:',
      gap: "Team picked the option only 12% of customers want. The room agreeing wasn't the room buying.",
    },
  },
  ru: {
    title: 'Какой онбординг релизим?',
    before: {
      subhead: 'Внутренний опрос команды · 24 голоса',
      options: [
        { label: 'Быстрый тур', percent: 71 },
        { label: 'Empty state + подсказки', percent: 21 },
        { label: 'Demo-видео', percent: 8 },
      ],
      decisionLabel: 'Решение:',
      decision:
        'Команда выбрала быстрый тур. Пользователям, очевидно, тоже зайдёт.',
    },
    after: {
      teamLabel: 'Команда (24)',
      team: [
        { label: 'Быстрый тур', percent: 71 },
        { label: 'Empty state', percent: 21 },
        { label: 'Demo-видео', percent: 8 },
      ],
      customerLabel: 'Клиенты (412 ответов)',
      customers: [
        { label: 'Быстрый тур', percent: 12 },
        { label: 'Empty state', percent: 23 },
        { label: 'Demo-видео', percent: 65 },
      ],
      gapLabel: 'Разрыв:',
      gap: 'Команда выбрала вариант, который нравится только 12% клиентов. Комната согласия — не комната покупки.',
    },
  },
  hy: {
    title: 'Ո՞ր onboarding-ն ենք թողարկում',
    before: {
      subhead: 'Թիմի ներքին հարցում · 24 ձայն',
      options: [
        { label: 'Արագ tour', percent: 71 },
        { label: 'Empty state + հուշում', percent: 21 },
        { label: 'Demo-տեսանյութ', percent: 8 },
      ],
      decisionLabel: 'Որոշում.',
      decision:
        'Թիմը ընտրեց արագ tour-ը։ Օգտատերերն էլ ակնհայտորեն կնախընտրեն այն։',
    },
    after: {
      teamLabel: 'Թիմ (24)',
      team: [
        { label: 'Արագ tour', percent: 71 },
        { label: 'Empty state', percent: 21 },
        { label: 'Demo-տեսանյութ', percent: 8 },
      ],
      customerLabel: 'Հաճախորդներ (412 հարցված)',
      customers: [
        { label: 'Արագ tour', percent: 12 },
        { label: 'Empty state', percent: 23 },
        { label: 'Demo-տեսանյութ', percent: 65 },
      ],
      gapLabel: 'Ճեղքվածք.',
      gap: 'Թիմն ընտրեց այն տարբերակը, որը ուզում է հաճախորդների միայն 12%-ը։ Համաձայնեցող սենյակը գնող սենյակ չէր։',
    },
  },
};

export default content;
