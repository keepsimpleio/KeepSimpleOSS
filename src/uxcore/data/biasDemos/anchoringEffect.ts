const content = {
  title: 'Choose Your Plan',
  selectBtn: 'Select',
  monthSuffix: '/mo',
  featuredBadge: 'Best Value',
  plans: [
    {
      name: 'Starter',
      price: '$10',
      wasPrice: 'was $39/mo',
      features: ['1 user', '5 projects', 'Basic analytics'],
      featured: false,
    },
    {
      name: 'Pro',
      price: '$25',
      wasPrice: 'was $99/mo',
      features: ['5 users', 'Unlimited projects', 'Advanced analytics'],
      featured: true,
    },
    {
      name: 'Enterprise',
      price: '$50',
      wasPrice: 'was $149/mo',
      features: [
        'Unlimited users',
        'Unlimited projects',
        'Custom integrations',
      ],
      featured: false,
    },
  ],
};

export default content;
