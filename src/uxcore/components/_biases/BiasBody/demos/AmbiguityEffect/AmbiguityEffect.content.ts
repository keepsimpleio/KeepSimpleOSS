const content = {
  en: {
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
          features: [
            '10 GB storage',
            '99.5% uptime SLA',
            'Email support (48h)',
          ],
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
  },
  ru: {
    title: 'Выберите тариф',
    cta: 'Начать',
    before: {
      plans: [
        {
          name: 'Starter',
          price: '$10',
          priceUnit: '/мес',
          features: [
            'Хранилище и поддержка',
            'Базовые функции',
            'Доступ по email',
          ],
          featured: false,
        },
        {
          name: 'Pro',
          price: '$25',
          priceUnit: '/мес',
          features: ['Больше места', 'Больше функций', 'Приоритетный доступ'],
          featured: true,
        },
        {
          name: 'Business',
          price: '$50',
          priceUnit: '/мес',
          features: [
            'Всё из Pro',
            'Продвинутые функции',
            'Выделенная поддержка',
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
          priceUnit: '/мес',
          features: [
            '10 ГБ хранилища',
            '99,5% SLA аптайма',
            'Email-поддержка (48 ч)',
          ],
          featured: false,
        },
        {
          name: 'Pro',
          price: '$25',
          priceUnit: '/мес',
          features: [
            '50 ГБ хранилища',
            '99,9% SLA аптайма',
            'Чат-поддержка (2 ч)',
          ],
          featured: true,
        },
        {
          name: 'Business',
          price: '$50',
          priceUnit: '/мес',
          features: [
            '500 ГБ хранилища',
            '99,99% SLA аптайма',
            'Выделенный менеджер (1 ч)',
          ],
          featured: false,
        },
      ],
    },
  },
  hy: {
    title: 'Ընտրեք ձեր փաթեթը',
    cta: 'Սկսել',
    before: {
      plans: [
        {
          name: 'Starter',
          price: '$10',
          priceUnit: '/ամս',
          features: [
            'Պահոց և աջակցություն',
            'Հիմնական գործառույթներ',
            'Email մուտք',
          ],
          featured: false,
        },
        {
          name: 'Pro',
          price: '$25',
          priceUnit: '/ամս',
          features: [
            'Ավելի շատ պահոց',
            'Ավելի շատ գործառույթներ',
            'Առաջնահերթ մուտք',
          ],
          featured: true,
        },
        {
          name: 'Business',
          price: '$50',
          priceUnit: '/ամս',
          features: [
            'Ամեն ինչ Pro-ից',
            'Ընդլայնված գործառույթներ',
            'Անհատական աջակցություն',
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
          priceUnit: '/ամս',
          features: [
            '10 ԳԲ պահոց',
            '99,5% աշխատաժամանակի SLA',
            'Email-աջակցություն (48 ժ)',
          ],
          featured: false,
        },
        {
          name: 'Pro',
          price: '$25',
          priceUnit: '/ամս',
          features: [
            '50 ԳԲ պահոց',
            '99,9% աշխատաժամանակի SLA',
            'Չատ-աջակցություն (2 ժ)',
          ],
          featured: true,
        },
        {
          name: 'Business',
          price: '$50',
          priceUnit: '/ամս',
          features: [
            '500 ԳԲ պահոց',
            '99,99% աշխատաժամանակի SLA',
            'Անհատական մենեջեր (1 ժ)',
          ],
          featured: false,
        },
      ],
    },
  },
};

export default content;
