const content = {
  title: 'Choose Your Plan',
  cta: 'Select',
  priceUnit: '/mo',
  before: {
    plans: [
      {
        name: 'Free',
        price: '$0',
        features: [
          '1 user',
          '3 projects',
          '500MB storage',
          'Email support',
          'Basic reports',
        ],
      },
      {
        name: 'Starter',
        price: '$9',
        features: [
          '3 users',
          '10 projects',
          '5 GB storage',
          'Email support',
          'Basic reports',
          'API access',
          'Integrations',
          'CSV export',
        ],
      },
      {
        name: 'Pro',
        price: '$29',
        features: [
          '10 users',
          'Unlimited projects',
          '50 GB storage',
          'Priority support',
          'Advanced reports',
          'API access',
          'All integrations',
          'CSV export',
          'Custom branding',
          'SSO',
          'Audit log',
          'SLA guarantee',
        ],
      },
    ],
  },
  after: {
    plans: [
      {
        name: 'Free',
        price: '$0',
        features: ['1 user', '3 projects', 'Email support'],
        primary: false,
      },
      {
        name: 'Pro',
        price: '$29',
        features: ['10 users', 'Unlimited projects', 'Priority support'],
        primary: true,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        features: ['Unlimited users', 'Dedicated support', 'Custom SLA'],
        primary: false,
      },
    ],
    badge: 'Most Popular',
    customPrice: 'Custom',
    compareLink: 'Compare all features →',
  },
};

export default content;
