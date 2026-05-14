const content = {
  en: {
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
  },
  ru: {
    title: 'Выберите тариф',
    cta: 'Выбрать',
    priceUnit: '/мес',
    before: {
      plans: [
        {
          name: 'Бесплатный',
          price: '$0',
          features: [
            '1 пользователь',
            '3 проекта',
            '500 МБ хранилища',
            'Поддержка по email',
            'Базовые отчёты',
          ],
        },
        {
          name: 'Стартовый',
          price: '$9',
          features: [
            '3 пользователя',
            '10 проектов',
            '5 ГБ хранилища',
            'Поддержка по email',
            'Базовые отчёты',
            'Доступ к API',
            'Интеграции',
            'Экспорт в CSV',
          ],
        },
        {
          name: 'Pro',
          price: '$29',
          features: [
            '10 пользователей',
            'Неограниченно проектов',
            '50 ГБ хранилища',
            'Приоритетная поддержка',
            'Расширенные отчёты',
            'Доступ к API',
            'Все интеграции',
            'Экспорт в CSV',
            'Свой брендинг',
            'SSO',
            'Журнал аудита',
            'Гарантия SLA',
          ],
        },
      ],
    },
    after: {
      plans: [
        {
          name: 'Бесплатный',
          price: '$0',
          features: ['1 пользователь', '3 проекта', 'Поддержка по email'],
          primary: false,
        },
        {
          name: 'Pro',
          price: '$29',
          features: [
            '10 пользователей',
            'Неограниченно проектов',
            'Приоритетная поддержка',
          ],
          primary: true,
        },
        {
          name: 'Enterprise',
          price: 'Договорная',
          features: [
            'Неограниченно пользователей',
            'Выделенная поддержка',
            'Индивидуальный SLA',
          ],
          primary: false,
        },
      ],
      badge: 'Популярный',
      customPrice: 'Договорная',
      compareLink: 'Сравнить все функции →',
    },
  },
  hy: {
    title: 'Ընտրեք ձեր փաթեթը',
    cta: 'Ընտրել',
    priceUnit: '/ամս',
    before: {
      plans: [
        {
          name: 'Անվճար',
          price: '$0',
          features: [
            '1 օգտատեր',
            '3 նախագիծ',
            '500 ՄԲ պահոց',
            'Էլ. փոստի աջակցություն',
            'Հիմնական հաշվետվություններ',
          ],
        },
        {
          name: 'Սթարթեր',
          price: '$9',
          features: [
            '3 օգտատեր',
            '10 նախագիծ',
            '5 ԳԲ պահոց',
            'Էլ. փոստի աջակցություն',
            'Հիմնական հաշվետվություններ',
            'API մուտք',
            'Ինտեգրացիաներ',
            'CSV արտահանում',
          ],
        },
        {
          name: 'Pro',
          price: '$29',
          features: [
            '10 օգտատեր',
            'Անսահմանափակ նախագծեր',
            '50 ԳԲ պահոց',
            'Առաջնահերթ աջակցություն',
            'Խորացված հաշվետվություններ',
            'API մուտք',
            'Բոլոր ինտեգրացիաները',
            'CSV արտահանում',
            'Անհատական ապրանքանիշ',
            'SSO',
            'Աուդիտի մատյան',
            'SLA երաշխիք',
          ],
        },
      ],
    },
    after: {
      plans: [
        {
          name: 'Անվճար',
          price: '$0',
          features: ['1 օգտատեր', '3 նախագիծ', 'Էլ. փոստի աջակցություն'],
          primary: false,
        },
        {
          name: 'Pro',
          price: '$29',
          features: [
            '10 օգտատեր',
            'Անսահմանափակ նախագծեր',
            'Առաջնահերթ աջակցություն',
          ],
          primary: true,
        },
        {
          name: 'Enterprise',
          price: 'Պայմանագրային',
          features: [
            'Անսահմանափակ օգտատերեր',
            'Անհատական աջակցություն',
            'Անհատական SLA',
          ],
          primary: false,
        },
      ],
      badge: 'Ամենահայտնի',
      customPrice: 'Պայմանագրային',
      compareLink: 'Համեմատել բոլոր ֆունկցիաները →',
    },
  },
};

export default content;
