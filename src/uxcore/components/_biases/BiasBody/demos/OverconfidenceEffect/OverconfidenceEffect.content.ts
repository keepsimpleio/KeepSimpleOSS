const content = {
  en: {
    question: 'How many active users will we have at end of Q4?',
    before: {
      label: 'Your forecast',
      value: '420,000',
      confidenceLabel: 'How confident are you?',
      confidenceValue: '95%',
      calibration:
        'Last 8 quarters: forecasters said "95% confident" — actuals were inside the range only 41% of the time.',
    },
    after: {
      intervalLabel:
        "Give a 90% range — wide enough that you'd be shocked if reality lands outside it.",
      lowLabel: 'Low end',
      lowValue: '290,000',
      highLabel: 'High end',
      highValue: '610,000',
      rules: [
        "No \"I'm sure it'll be exactly X\" — you're predicting the future.",
        "If the range feels embarrassingly wide, it's probably honest.",
        'Track each forecast vs. actual to calibrate your future ranges.',
      ],
      calibration:
        'Forecasters using ranges hit their 90% target 87% of the time. Better decisions, fewer surprises.',
    },
  },
  ru: {
    question: 'Сколько активных пользователей у нас будет в конце Q4?',
    before: {
      label: 'Ваш прогноз',
      value: '420 000',
      confidenceLabel: 'Насколько уверены?',
      confidenceValue: '95%',
      calibration:
        'Последние 8 кварталов: говорили «уверен на 95%» — попадали в диапазон только в 41% случаев.',
    },
    after: {
      intervalLabel:
        'Дайте 90%-ный интервал — настолько широкий, что вы удивитесь, если реальность окажется вне него.',
      lowLabel: 'Нижняя граница',
      lowValue: '290 000',
      highLabel: 'Верхняя граница',
      highValue: '610 000',
      rules: [
        'Без «уверен, будет ровно X» — вы предсказываете будущее.',
        'Если диапазон кажется неприлично широким — скорее всего, это честно.',
        'Сверяйте каждый прогноз с фактом и калибруйте следующие.',
      ],
      calibration:
        'Прогнозисты с диапазонами попадают в свои 90% цели в 87% случаев. Лучше решения, меньше сюрпризов.',
    },
  },
  hy: {
    question: 'Քանի՞ ակտիվ օգտատեր կունենանք Q4-ի վերջում։',
    before: {
      label: 'Ձեր կանխատեսումը',
      value: '420,000',
      confidenceLabel: 'Որքանո՞վ եք վստահ',
      confidenceValue: '95%',
      calibration:
        'Վերջին 8 եռամսյակը. ասում էին «95% վստահ եմ», փաստացիորեն տիրույթի մեջ էին միայն 41% դեպքում։',
    },
    after: {
      intervalLabel:
        'Տվեք 90%-անոց միջակայք — այնքան լայն, որ կզարմանայիք, եթե իրականությունը դուրս գա այնտեղից։',
      lowLabel: 'Ստորին սահման',
      lowValue: '290,000',
      highLabel: 'Վերին սահման',
      highValue: '610,000',
      rules: [
        'Ոչ թե «վստահ եմ, որ կլինի հենց X» — դուք ապագան եք գուշակում։',
        'Եթե տիրույթը թվում է «անհարմար լայն»՝ հավանաբար անկեղծ է։',
        'Հետևեք յուրաքանչյուր կանխատեսմանն ու փաստին՝ հաջորդը կալիբրացնելու համար։',
      ],
      calibration:
        'Միջակայքերով աշխատող կանխատեսողները հասնում են իրենց 90% թիրախին 87% դեպքերում։ Ավելի լավ որոշումներ, ավելի քիչ անակնկալներ։',
    },
  },
};

export default content;
