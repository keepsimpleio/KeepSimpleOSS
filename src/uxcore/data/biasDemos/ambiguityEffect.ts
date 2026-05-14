const content = {
  title: 'Choose Your Plan',
  cta: 'Get Started',
  before: {
    plans: [
      {
        name: 'Starter',
        price: '$10',
        priceUnit: '/mo',
        features: ['Storage and support', 'Basic features', 'Email access'],
        featured: false,
      },
      {
        name: 'Pro',
        price: '$25',
        priceUnit: '/mo',
        features: ['More storage', 'More features', 'Priority access'],
        featured: true,
      },
      {
        name: 'Business',
        price: '$50',
        priceUnit: '/mo',
        features: [
          'Everything in Pro',
          'Advanced features',
          'Dedicated support',
        ],
        featured: false,
      },
    ],
  },
  after: {
    plans: [
      {
        name: 'Starter',
        price: '$10',
        priceUnit: '/mo',
        features: ['10 GB storage', '99.5% uptime SLA', 'Email support (48h)'],
        featured: false,
      },
      {
        name: 'Pro',
        price: '$25',
        priceUnit: '/mo',
        features: [
          '50 GB storage',
          '99.9% uptime SLA',
          'Live chat support (2h)',
        ],
        featured: true,
      },
      {
        name: 'Business',
        price: '$50',
        priceUnit: '/mo',
        features: [
          '500 GB storage',
          '99.99% uptime SLA',
          'Dedicated manager (1h)',
        ],
        featured: false,
      },
    ],
  },
};

export default content;
