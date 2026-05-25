const content = {
  en: {
    before: {
      title: 'Upcoming Features',
      features: [
        { name: 'Dark Mode', eta: 'Q3' },
        { name: 'API Webhooks', eta: 'Q3' },
        { name: 'Bulk Export', eta: 'Q3' },
        { name: 'Mobile App', eta: 'Q4' },
      ],
      comingPrefix: 'Coming',
      note: 'Roadmap subject to change.',
    },
    after: {
      bannerText: 'Your vote shapes what ships next!',
      title: 'Vote on Upcoming Features',
      features: [
        { name: 'Dark Mode', votes: 1204 },
        { name: 'API Webhooks', votes: 873 },
        { name: 'Bulk Export', votes: 641 },
        { name: 'Mobile App', votes: 2091 },
      ],
      voteBtn: '▲ Vote',
      votesSuffix: 'votes',
      note: 'Top-voted features move to the next sprint.',
    },
  },
  ru: {
    before: {
      title: 'Ближайшие фичи',
      features: [
        { name: 'Тёмная тема', eta: 'Q3' },
        { name: 'API Webhooks', eta: 'Q3' },
        { name: 'Массовый экспорт', eta: 'Q3' },
        { name: 'Мобильное приложение', eta: 'Q4' },
      ],
      comingPrefix: 'Скоро',
      note: 'Роудмап может измениться.',
    },
    after: {
      bannerText: 'Ваш голос решает, что выйдет следующим!',
      title: 'Голосуйте за новые фичи',
      features: [
        { name: 'Тёмная тема', votes: 1204 },
        { name: 'API Webhooks', votes: 873 },
        { name: 'Массовый экспорт', votes: 641 },
        { name: 'Мобильное приложение', votes: 2091 },
      ],
      voteBtn: '▲ Голос',
      votesSuffix: 'голосов',
      note: 'Фичи с наибольшим числом голосов попадают в следующий спринт.',
    },
  },
  hy: {
    before: {
      title: 'Առաջիկա ֆունկցիաներ',
      features: [
        { name: 'Մութ ռեժիմ', eta: 'Q3' },
        { name: 'API Webhook-ներ', eta: 'Q3' },
        { name: 'Զանգվածային արտահանում', eta: 'Q3' },
        { name: 'Բջջային հավելված', eta: 'Q4' },
      ],
      comingPrefix: 'Շուտով',
      note: 'Ծրագիրը կարող է փոխվել։',
    },
    after: {
      bannerText: 'Ձեր ձայնը որոշում է, թե ինչն է հաջորդը։',
      title: 'Քվեարկեք առաջիկա ֆունկցիաների համար',
      features: [
        { name: 'Մութ ռեժիմ', votes: 1204 },
        { name: 'API Webhook-ներ', votes: 873 },
        { name: 'Զանգվածային արտահանում', votes: 641 },
        { name: 'Բջջային հավելված', votes: 2091 },
      ],
      voteBtn: '▲ Ձայն',
      votesSuffix: 'ձայն',
      note: 'Ամենաշատ ձայն հավաքած ֆունկցիաները անցնում են հաջորդ սպրինտ։',
    },
  },
};

export default content;
