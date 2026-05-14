const content = {
  en: {
    before: {
      from: 'marketing@saas.io',
      subject: "AMAZING deal inside — Don't miss out!",
      heroBanner: 'AMAZING DEAL!',
      hype: "Don't miss out! Everyone is switching to Pro. This is the BEST offer we've ever made!",
      dealLabel: 'LIMITED TIME',
      dealPrice: '50% OFF PRO',
      cta: 'CLAIM YOUR DEAL NOW',
      urgency: 'Offer expires in 2 hours!',
      label: 'Overt marketing — power users disengage immediately',
    },
    after: {
      from: 'product@saas.io',
      subject: 'What changed in v4.2 and how it affects your workflow',
      greeting: 'Hi Alex,',
      intro:
        "We shipped v4.2 last week. Here's what's relevant to how you use the product.",
      changes: [
        {
          title: 'Batch export is now 4x faster',
          sub: 'Based on your usage, this saves ~8 min on your weekly exports.',
        },
        {
          title: 'API rate limits doubled',
          sub: "Your integrations were hitting limits on Tuesdays — that's resolved.",
        },
      ],
      stats: [
        { num: '847', label: 'exports last month' },
        { num: '12', label: 'API calls/day' },
      ],
      cta: 'See Full Changelog',
      label: 'Informational + data-driven — bypasses skepticism',
    },
  },
  ru: {
    before: {
      from: 'marketing@saas.io',
      subject: 'ПОТРЯСАЮЩАЯ скидка внутри — не упустите!',
      heroBanner: 'ПОТРЯСАЮЩАЯ СКИДКА!',
      hype: 'Не упустите! Все переходят на Pro. Это ЛУЧШЕЕ предложение, которое мы когда-либо делали!',
      dealLabel: 'ОГРАНИЧЕННОЕ ВРЕМЯ',
      dealPrice: '50% НА PRO',
      cta: 'ПОЛУЧИТЬ СКИДКУ СЕЙЧАС',
      urgency: 'Предложение истекает через 2 часа!',
      label: 'Откровенный маркетинг — опытные пользователи сразу отключаются',
    },
    after: {
      from: 'product@saas.io',
      subject: 'Что изменилось в v4.2 и как это влияет на ваш workflow',
      greeting: 'Привет, Алекс,',
      intro:
        'На прошлой неделе мы выпустили v4.2. Вот что касается того, как вы используете продукт.',
      changes: [
        {
          title: 'Массовый экспорт стал в 4 раза быстрее',
          sub: 'Учитывая ваше использование, это экономит ~8 мин на ваших еженедельных экспортах.',
        },
        {
          title: 'Лимиты API удвоены',
          sub: 'Ваши интеграции упирались в лимиты по вторникам — это исправлено.',
        },
      ],
      stats: [
        { num: '847', label: 'экспортов за прошлый месяц' },
        { num: '12', label: 'API-запросов/день' },
      ],
      cta: 'Смотреть весь changelog',
      label: 'Информативно + с данными — обходит скепсис',
    },
  },
  hy: {
    before: {
      from: 'marketing@saas.io',
      subject: 'ԶԱՐՄԱՆԱԼԻ առաջարկ ներսում — Մի բաց թողեք։',
      heroBanner: 'ԶԱՐՄԱՆԱԼԻ ԱՌԱՋԱՐԿ։',
      hype: 'Մի բաց թողեք։ Բոլորն անցնում են Pro-ի։ Սա լավագույն առաջարկն է, որ մենք երբևէ արել ենք։',
      dealLabel: 'ՍԱՀՄԱՆԱՓԱԿ ԺԱՄԱՆԱԿ',
      dealPrice: '50% ԶԵՂՉ PRO-ԻՆ',
      cta: 'ՍՏԱՆԱԼ ԱՌԱՋԱՐԿԸ ՀԻՄԱ',
      urgency: 'Առաջարկն ավարտվում է 2 ժամից։',
      label:
        'Բացահայտ մարքեթինգ — փորձառու օգտատերերը ակնթարթորեն անջատվում են',
    },
    after: {
      from: 'product@saas.io',
      subject: 'Ինչ է փոխվել v4.2-ում և ինչպես է դա ազդում ձեր աշխատանքի վրա',
      greeting: 'Բարև, Ալեքս,',
      intro:
        'Անցյալ շաբաթ թողարկեցինք v4.2-ը։ Ահա թե ինչն է վերաբերում ձեր օգտագործման ձևին։',
      changes: [
        {
          title: 'Զանգվածային արտահանումն այժմ 4 անգամ ավելի արագ է',
          sub: 'Ելնելով ձեր օգտագործումից՝ սա խնայում է ~8 րոպե ձեր շաբաթական արտահանումների վրա։',
        },
        {
          title: 'API-ի սահմանաչափերը կրկնապատկվել են',
          sub: 'Ձեր ինտեգրացիաները երեքշաբթի օրերին խփում էին սահմաններին — դա լուծված է։',
        },
      ],
      stats: [
        { num: '847', label: 'արտահանում անցած ամսում' },
        { num: '12', label: 'API հարցում/օր' },
      ],
      cta: 'Դիտել ամբողջ փոփոխությունների գրանցամատյանը',
      label:
        'Տեղեկատվական + տվյալների վրա հիմնված — շրջանցում է թերահավատությունը',
    },
  },
};

export default content;
