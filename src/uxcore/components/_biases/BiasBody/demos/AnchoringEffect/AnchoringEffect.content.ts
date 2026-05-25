const content = {
  en: {
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
  },
  ru: {
    title: 'Выберите тариф',
    selectBtn: 'Выбрать',
    monthSuffix: '/мес',
    featuredBadge: 'Лучшее предложение',
    plans: [
      {
        name: 'Starter',
        price: '$10',
        wasPrice: 'было $39/мес',
        features: ['1 пользователь', '5 проектов', 'Базовая аналитика'],
        featured: false,
      },
      {
        name: 'Pro',
        price: '$25',
        wasPrice: 'было $99/мес',
        features: [
          '5 пользователей',
          'Безлимит проектов',
          'Продвинутая аналитика',
        ],
        featured: true,
      },
      {
        name: 'Enterprise',
        price: '$50',
        wasPrice: 'было $149/мес',
        features: [
          'Безлимит пользователей',
          'Безлимит проектов',
          'Кастомные интеграции',
        ],
        featured: false,
      },
    ],
  },
  hy: {
    title: 'Ընտրեք ձեր փաթեթը',
    selectBtn: 'Ընտրել',
    monthSuffix: '/ամս',
    featuredBadge: 'Լավագույն արժեքը',
    plans: [
      {
        name: 'Starter',
        price: '$10',
        wasPrice: 'նախկինում $39/ամս',
        features: ['1 օգտատեր', '5 պրոյեկտ', 'Հիմնական վերլուծություն'],
        featured: false,
      },
      {
        name: 'Pro',
        price: '$25',
        wasPrice: 'նախկինում $99/ամս',
        features: [
          '5 օգտատեր',
          'Անսահմանափակ պրոյեկտներ',
          'Ընդլայնված վերլուծություն',
        ],
        featured: true,
      },
      {
        name: 'Enterprise',
        price: '$50',
        wasPrice: 'նախկինում $149/ամս',
        features: [
          'Անսահմանափակ օգտատերեր',
          'Անսահմանափակ պրոյեկտներ',
          'Անհատական ինտեգրումներ',
        ],
        featured: false,
      },
    ],
  },
};

export default content;
