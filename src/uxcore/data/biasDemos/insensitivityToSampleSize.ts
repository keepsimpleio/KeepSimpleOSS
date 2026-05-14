const content = {
  title: 'Compare Products',
  buyBtn: 'Buy',
  before: {
    products: [
      {
        name: 'NovaBuds Pro',
        stars: '★★★★★',
        rating: '4.9',
        reviews: '3 reviews',
        price: '$89',
      },
      {
        name: 'SoundWave X',
        stars: '★★★★☆',
        rating: '4.6',
        reviews: '8,412 reviews',
        price: '$94',
      },
    ],
  },
  after: {
    muted: {
      name: 'NovaBuds Pro',
      stars: '★★★★★',
      rating: '4.9',
      reviews: '3 reviews',
      confidenceBadge: 'Not enough data',
      price: '$89',
    },
    verified: {
      name: 'SoundWave X',
      stars: '★★★★☆',
      rating: '4.6',
      reviews: '8,412 reviews',
      verifiedBadge: 'Verified',
      price: '$94',
    },
  },
};

export default content;
