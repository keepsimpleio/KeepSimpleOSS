const content = {
  en: {
    title: 'Connection Status',
    statusText: 'Slowdown detected in your area',
    before: {
      body: "We're aware of intermittent slowdowns affecting your neighborhood. Our engineers are monitoring the situation. No action needed on your end.",
      speedValue: '12',
      speedUnit: 'Mbps',
    },
    after: {
      body: 'Run the Network Optimizer to clear cached routes and improve your connection.',
      runBtn: 'Run Network Optimizer',
      steps: [
        { label: 'Scanning routes...', state: 'done' },
        { label: 'Optimizing DNS...', state: 'done' },
        { label: 'Clearing cache...', state: 'active' },
      ],
      result: 'Speed improved by 12%',
    },
  },
  ru: {
    title: 'Статус соединения',
    statusText: 'В вашем районе замедление сети',
    before: {
      body: 'Мы знаем о периодических замедлениях в вашем районе. Наши инженеры следят за ситуацией. С вашей стороны ничего делать не нужно.',
      speedValue: '12',
      speedUnit: 'Мбит/с',
    },
    after: {
      body: 'Запустите сетевой оптимизатор, чтобы очистить кешированные маршруты и улучшить соединение.',
      runBtn: 'Запустить сетевой оптимизатор',
      steps: [
        { label: 'Сканирование маршрутов...', state: 'done' },
        { label: 'Оптимизация DNS...', state: 'done' },
        { label: 'Очистка кеша...', state: 'active' },
      ],
      result: 'Скорость улучшена на 12%',
    },
  },
  hy: {
    title: 'Կապի կարգավիճակ',
    statusText: 'Ձեր տարածքում դանդաղեցում է հայտնաբերվել',
    before: {
      body: 'Մենք տեղյակ ենք ձեր թաղամասում դիտվող պարբերական դանդաղեցումներից։ Մեր ինժեներները հետևում են իրավիճակին։ Ձեր կողմից որևէ գործողություն չի պահանջվում։',
      speedValue: '12',
      speedUnit: 'Մբիթ/վ',
    },
    after: {
      body: 'Գործարկեք Ցանցի օպտիմիզատորը՝ քեշավորված երթուղիները մաքրելու և ձեր կապը բարելավելու համար։',
      runBtn: 'Գործարկել Ցանցի օպտիմիզատորը',
      steps: [
        { label: 'Երթուղիների սկանավորում...', state: 'done' },
        { label: 'DNS-ի օպտիմալացում...', state: 'done' },
        { label: 'Քեշի մաքրում...', state: 'active' },
      ],
      result: 'Արագությունը բարելավվել է 12%-ով',
    },
  },
};

export default content;
