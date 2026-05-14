const content = {
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
};

export default content;
