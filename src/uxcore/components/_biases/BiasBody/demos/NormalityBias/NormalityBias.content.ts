const content = {
  en: {
    header: 'My Portfolio',
    positions: [
      {
        ticker: 'AAPL',
        shares: 10,
        price: '$182.30',
        change: '+0.4%',
        down: false,
      },
      {
        ticker: 'MSFT',
        shares: 5,
        price: '$415.20',
        change: '+1.1%',
        down: false,
      },
      {
        ticker: 'NVDA',
        shares: 8,
        price: '$74.60',
        change: '-15.2%',
        down: true,
      },
      {
        ticker: 'AMZN',
        shares: 3,
        price: '$198.50',
        change: '-0.8%',
        down: false,
      },
    ],
    sharesSuffix: 'shares',
    after: {
      warnTitle: 'Unusual Activity: NVDA -15.2%',
      warnSub: 'Largest single-day drop in 18 months',
      slLabel: 'Set a stop-loss to limit your losses:',
      slOptions: [
        { label: '-10% limit', active: false },
        { label: '-15% limit', active: true },
        { label: '-20% limit', active: false },
      ],
      autoBtn: 'Enable Auto-Protect',
    },
  },
  ru: {
    header: 'Мой портфель',
    positions: [
      {
        ticker: 'AAPL',
        shares: 10,
        price: '$182,30',
        change: '+0,4%',
        down: false,
      },
      {
        ticker: 'MSFT',
        shares: 5,
        price: '$415,20',
        change: '+1,1%',
        down: false,
      },
      {
        ticker: 'NVDA',
        shares: 8,
        price: '$74,60',
        change: '-15,2%',
        down: true,
      },
      {
        ticker: 'AMZN',
        shares: 3,
        price: '$198,50',
        change: '-0,8%',
        down: false,
      },
    ],
    sharesSuffix: 'акций',
    after: {
      warnTitle: 'Необычная активность: NVDA -15,2%',
      warnSub: 'Крупнейшее падение за день за 18 месяцев',
      slLabel: 'Установите стоп-лосс, чтобы ограничить убытки:',
      slOptions: [
        { label: 'лимит -10%', active: false },
        { label: 'лимит -15%', active: true },
        { label: 'лимит -20%', active: false },
      ],
      autoBtn: 'Включить автозащиту',
    },
  },
  hy: {
    header: 'Իմ պորտֆելը',
    positions: [
      {
        ticker: 'AAPL',
        shares: 10,
        price: '$182.30',
        change: '+0.4%',
        down: false,
      },
      {
        ticker: 'MSFT',
        shares: 5,
        price: '$415.20',
        change: '+1.1%',
        down: false,
      },
      {
        ticker: 'NVDA',
        shares: 8,
        price: '$74.60',
        change: '-15.2%',
        down: true,
      },
      {
        ticker: 'AMZN',
        shares: 3,
        price: '$198.50',
        change: '-0.8%',
        down: false,
      },
    ],
    sharesSuffix: 'բաժնետոմս',
    after: {
      warnTitle: 'Անսովոր ակտիվություն՝ NVDA -15.2%',
      warnSub: 'Ամենամեծ մեկօրյա անկումը վերջին 18 ամիսներում',
      slLabel: 'Սահմանեք stop-loss՝ ձեր կորուստները սահմանափակելու համար՝',
      slOptions: [
        { label: '-10% սահման', active: false },
        { label: '-15% սահման', active: true },
        { label: '-20% սահման', active: false },
      ],
      autoBtn: 'Միացնել ավտո-պաշտպանությունը',
    },
  },
};

export default content;
