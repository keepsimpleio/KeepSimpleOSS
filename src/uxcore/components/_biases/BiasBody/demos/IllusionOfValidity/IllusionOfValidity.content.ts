const content = {
  en: {
    title: 'Predicted activation rate, next quarter',
    before: {
      value: '87',
      label: 'Users will activate within 7 days.',
      confidence: 'High confidence',
      sample: '12',
      cta: 'Lock in roadmap',
    },
    after: {
      low: '34',
      high: '91',
      label: 'Plausible activation range, next quarter.',
      confidence: '95% interval',
      sample: '12',
      warningTitle: 'Sample is too small to be sure.',
      warningBody:
        'A confident-looking number from 12 users hides a 57-point spread. Get to n=200 before locking the roadmap.',
    },
  },
  ru: {
    title: 'Прогноз активации на следующий квартал',
    before: {
      value: '87',
      label: 'Пользователей активируются за 7 дней.',
      confidence: 'Высокая уверенность',
      sample: '12',
      cta: 'Зафиксировать в роадмапе',
    },
    after: {
      low: '34',
      high: '91',
      label: 'Реалистичный диапазон активации на квартал.',
      confidence: '95% интервал',
      sample: '12',
      warningTitle: 'Выборка слишком мала, чтобы быть уверенными.',
      warningBody:
        'Уверенная цифра из 12 пользователей прячет разброс в 57 пунктов. Доберитесь до n=200, прежде чем фиксировать роадмап.',
    },
  },
  hy: {
    title: 'Ակտիվացիայի կանխատեսում հաջորդ եռամսյակին',
    before: {
      value: '87',
      label: 'Օգտատերերը կակտիվանան 7 օրվա ընթացքում։',
      confidence: 'Բարձր վստահություն',
      sample: '12',
      cta: 'Ֆիքսել roadmap-ում',
    },
    after: {
      low: '34',
      high: '91',
      label: 'Ակտիվացիայի հավանական միջակայք եռամսյակի համար։',
      confidence: '95% միջակայք',
      sample: '12',
      warningTitle: 'Ընտրանքը շատ փոքր է վստահ լինելու համար։',
      warningBody:
        '12 օգտատերերից ստացված վստահ թիվը թաքցնում է 57 կետանոց տարածում։ Հասցրեք n=200-ի՝ նախքան roadmap-ը ֆիքսելը։',
    },
  },
};

export default content;
