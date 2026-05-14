const content = {
  before: {
    title: 'Annual Pricing',
    yearSuffix: '/year',
    plans: [
      {
        name: 'Starter',
        price: '$120',
        features: ['1 user', '5 GB storage'],
        btn: 'Get Starter',
        featured: false,
      },
      {
        name: 'Pro',
        price: '$300',
        features: ['5 users', '50 GB storage'],
        btn: 'Get Pro',
        featured: true,
      },
      {
        name: 'Business',
        price: '$600',
        features: ['Unlimited users', '500 GB storage'],
        btn: 'Get Business',
        featured: false,
      },
    ],
  },
  after: {
    title: 'Simple Daily Pricing',
    daySuffix: '/day',
    coffeeTag: 'Less than a coffee ☕',
    plans: [
      {
        name: 'Starter',
        price: '$0.33',
        annual: '$120/year',
        features: ['1 user', '5 GB storage'],
        btn: 'Get Starter',
        featured: false,
        showCoffee: false,
      },
      {
        name: 'Pro',
        price: '$0.82',
        annual: '$300/year',
        features: ['5 users', '50 GB storage'],
        btn: 'Get Pro',
        featured: true,
        showCoffee: true,
      },
      {
        name: 'Business',
        price: '$1.64',
        annual: '$600/year',
        features: ['Unlimited users', '500 GB storage'],
        btn: 'Get Business',
        featured: false,
        showCoffee: false,
      },
    ],
  },
};

export default content;
