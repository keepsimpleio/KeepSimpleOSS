const content = {
  en: {
    before: {
      errorCode: '404',
      title: 'Page Not Found',
      body: 'The page you requested could not be found on this server. Please check the URL or return to the homepage.',
      link: 'Return to homepage',
    },
    after: {
      title: 'This page wandered off to find itself.',
      body: "While it's on its journey, here are some articles that stayed put.",
      suggestions: [
        { icon: '\u{1F4D6}', label: 'Getting started guide' },
        { icon: '\u{1F50D}', label: 'Browse all topics' },
        { icon: '\u{1F4AC}', label: 'Ask the community' },
      ],
      link: 'Take me home',
    },
  },
  ru: {
    before: {
      errorCode: '404',
      title: 'Страница не найдена',
      body: 'Страница, которую вы запросили, не найдена на этом сервере. Проверьте URL или вернитесь на главную.',
      link: 'Вернуться на главную',
    },
    after: {
      title: 'Эта страница ушла искать себя.',
      body: 'Пока её нет, вот статьи, которые остались на месте.',
      suggestions: [
        { icon: '\u{1F4D6}', label: 'Гайд для начинающих' },
        { icon: '\u{1F50D}', label: 'Все темы' },
        { icon: '\u{1F4AC}', label: 'Спросить сообщество' },
      ],
      link: 'Домой',
    },
  },
  hy: {
    before: {
      errorCode: '404',
      title: 'Էջը չի գտնվել',
      body: 'Ձեր պահանջած էջը չի գտնվել այս սերվերում։ Խնդրում ենք ստուգել URL-ը կամ վերադառնալ գլխավոր էջ։',
      link: 'Վերադառնալ գլխավոր էջ',
    },
    after: {
      title: 'Այս էջը գնացել է իրեն գտնելու։',
      body: 'Մինչ նա իր ճանապարհորդության մեջ է, ահա մի քանի հոդված, որոնք իրենց տեղում են մնացել։',
      suggestions: [
        { icon: '\u{1F4D6}', label: 'Սկսնակների ուղեցույց' },
        { icon: '\u{1F50D}', label: 'Դիտել բոլոր թեմաները' },
        { icon: '\u{1F4AC}', label: 'Հարցնել համայնքին' },
      ],
      link: 'Տար ինձ տուն',
    },
  },
};

export default content;
