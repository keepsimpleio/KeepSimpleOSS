const content = {
  img: '🎧',
  addToCart: 'Add to Cart',
  before: {
    title: 'Featured Headphones',
    productName: 'SoundWave Pro',
    productDesc: 'Balanced audio, 24h battery, foldable design',
    productPrice: '$79',
  },
  after: {
    title: 'Choose Your Headphones',
    featuredBadge: 'Most Popular',
    products: [
      {
        variant: 'budget',
        name: 'BasiSound',
        desc: 'Standard audio, 8h battery',
        price: '$19',
        btn: 'secondary',
      },
      {
        variant: 'featured',
        name: 'SoundWave Pro',
        desc: 'Balanced audio, 24h battery, foldable',
        price: '$79',
        btn: 'primary',
      },
      {
        variant: 'premium',
        name: 'EliteAudio X',
        desc: 'Studio-grade, ANC, 40h battery',
        price: '$349',
        btn: 'secondary',
      },
    ],
  },
};

export default content;
