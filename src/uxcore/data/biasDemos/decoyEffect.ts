const content = {
  title: 'Pick a Plan',
  basic: {
    name: 'Basic',
    price: '$8',
    priceUnit: '/mo',
    features: ['3 projects', '2 GB storage', 'Email support'],
    cta: 'Choose Basic',
  },
  premium: {
    name: 'Premium',
    price: '$24',
    priceUnit: '/mo',
    features: [
      'Unlimited projects',
      '20 GB storage',
      'Priority support',
      'Team collaboration',
      'Advanced analytics',
    ],
    cta: 'Choose Premium',
  },
  after: {
    plus: {
      decoyTag: 'Also Available',
      name: 'Plus',
      price: '$22',
      priceUnit: '/mo',
      features: ['10 projects', '8 GB storage', 'Email support'],
      cta: 'Choose Plus',
    },
    premiumBadge: 'Best Value',
  },
};

export default content;
