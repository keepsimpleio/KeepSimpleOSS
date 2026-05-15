const content = {
  title: 'User Reviews',
  negativeReviews: [
    {
      stars: 1,
      text: 'Terrible. Crashed every time I opened it.',
      author: 'Jordan M.',
    },
    {
      stars: 1,
      text: 'Waste of money. Support is non-existent.',
      author: 'Priya K.',
    },
    {
      stars: 2,
      text: 'Full of bugs. Would not recommend.',
      author: 'Carlos R.',
    },
  ],
  before: {
    overallSmall: '4.8 stars from 15,847 ratings',
  },
  after: {
    summaryScore: '4.8',
    summaryStars: '★★★★★',
    summaryCount: '15,847 ratings',
    bars: [
      { stars: 5, pct: 78 },
      { stars: 4, pct: 14 },
      { stars: 3, pct: 4 },
      { stars: 2, pct: 2 },
      { stars: 1, pct: 2 },
    ],
  },
};

export default content;
