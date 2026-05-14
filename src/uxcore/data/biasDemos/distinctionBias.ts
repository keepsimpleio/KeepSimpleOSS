const content = {
  title: 'Choose Your Plan',
  cta: 'Get Started',
  monthSuffix: '/mo',
  plans: [
    {
      name: 'Team',
      price: '$12',
      features: [
        'Up to 10 users',
        '20 GB storage',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      name: 'Business',
      price: '$14',
      features: [
        'Up to 25 users',
        '50 GB storage',
        'Priority support',
        'Advanced analytics',
      ],
    },
  ],
  before: {
    note: 'Side-by-side: small differences feel large',
  },
  after: {
    dividerText: 'scroll to compare',
    note: 'Separated: same plans feel less different',
  },
};

export default content;
